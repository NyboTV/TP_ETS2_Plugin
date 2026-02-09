const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');

const APP_NAME = 'ETS2_Dashboard';
const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist_package');
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const TMP_DIR = path.join(ROOT_DIR, 'scripts', 'tmp');

const platforms = [
    { name: 'win', pkg: 'node18-win-x64', ext: '.exe', scs: 'windows' },
    { name: 'linux', pkg: 'node18-linux-x64', ext: '', scs: 'linux' },
    { name: 'mac', pkg: 'node18-macos-x64', ext: '', scs: 'macos' }
];

async function ThroughDirectory(Directory, Files = [], Folder = []) {
    const items = await fs.readdir(Directory);
    for (const item of items) {
        const Absolute = path.join(Directory, item);
        if ((await fs.stat(Absolute)).isDirectory()) {
            Folder.push(Absolute);
            await ThroughDirectory(Absolute, Files, Folder);
        } else {
            Files.push(Absolute);
        }
    }
    return { Files, Folder };
}

async function build() {
    try {
        console.log('--- Starting Refined Build Process (V1 Parity) ---');

        // 1. Cleanup
        console.log('Cleaning up...');
        await fs.remove(DIST_DIR);
        await fs.remove(BUILD_DIR);
        await fs.remove(TMP_DIR);
        await fs.remove(path.join(ROOT_DIR, 'dist'));
        await fs.ensureDir(DIST_DIR);

        // 2. Versioning
        console.log('Incrementing version...');
        const pkgJsonPath = path.join(ROOT_DIR, 'package.json');
        const pkgJson = await fs.readJson(pkgJsonPath);
        const versionParts = pkgJson.version.split('.');
        versionParts[2] = parseInt(versionParts[2]) + 1;
        const newVersion = versionParts.join('.');
        pkgJson.version = newVersion;
        await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 4 });
        console.log(`Version updated to: ${newVersion}`);

        console.log('Updating entry.tp version...');
        const entryTpPath = path.join(ROOT_DIR, 'entry.tp');
        const entryTp = await fs.readJson(entryTpPath);
        entryTp.version = parseInt(newVersion.split('.')[0]);
        await fs.writeJson(entryTpPath, entryTp, { spaces: 2 });

        // 3. Compile
        console.log('Compiling TypeScript...');
        execSync('npm run build', { stdio: 'inherit', cwd: ROOT_DIR });

        // 4. PKG Binary Generation
        console.log('Generating binaries with pkg...');
        // We run pkg for all targets at once
        const targets = platforms.map(p => p.pkg).join(',');
        execSync(`npx pkg . --targets ${targets} --out-path build`, { stdio: 'inherit', cwd: ROOT_DIR });

        // 5. Packaging loop
        for (const platform of platforms) {
            console.log(`\nPackaging for ${platform.name}...`);
            const stagingPath = path.join(TMP_DIR, platform.name, APP_NAME);
            await fs.ensureDir(stagingPath);

            // Copy Binary
            // pkg naming convention: [name]-[target][ext]
            // We'll try to find the binary by name pattern
            const pkgBaseName = 'tp_ets2_plugin';
            let binarySource = path.join(BUILD_DIR, `${pkgBaseName}-${platform.name}${platform.ext}`);

            // On Windows, pkg might output as .exe
            if (platform.name === 'win' && !binarySource.endsWith('.exe')) binarySource += '.exe';

            const binaryDest = path.join(stagingPath, `${APP_NAME}${platform.ext}`);

            if (await fs.pathExists(binarySource)) {
                await fs.copy(binarySource, binaryDest);
                console.log(`- Copied binary: ${path.basename(binarySource)} -> ${APP_NAME}${platform.ext}`);
            } else {
                // Try alternate naming in case of pkg variation
                const altSource = path.join(BUILD_DIR, `${pkgBaseName}-${platform.pkg}${platform.ext}`);
                if (await fs.pathExists(altSource)) {
                    await fs.copy(altSource, binaryDest);
                    console.log(`- Copied binary (alt): ${path.basename(altSource)} -> ${APP_NAME}${platform.ext}`);
                } else {
                    // One last try: just searching the dir
                    const files = await fs.readdir(BUILD_DIR);
                    const match = files.find(f => f.startsWith(pkgBaseName) && f.includes(platform.name));
                    if (match) {
                        await fs.copy(path.join(BUILD_DIR, match), binaryDest);
                        console.log(`- Copied binary (match): ${match} -> ${APP_NAME}${platform.ext}`);
                    } else {
                        console.warn(`! Binary source not found for ${platform.name}`);
                    }
                }
            }

            // Copy Folders
            await fs.copy(path.join(ROOT_DIR, 'config'), path.join(stagingPath, 'config'));
            await fs.copy(path.join(ROOT_DIR, 'server'), path.join(stagingPath, 'server'));
            await fs.copy(path.join(ROOT_DIR, 'entry.tp'), path.join(stagingPath, 'entry.tp'));
            await fs.copy(path.join(ROOT_DIR, 'LICENSE'), path.join(stagingPath, 'LICENSE'));

            // Copy platform-specific SCS plugin
            const scsSource = path.join(ROOT_DIR, 'bin', 'scs-sdk-plugin', platform.scs);
            if (await fs.pathExists(scsSource)) {
                await fs.copy(scsSource, path.join(stagingPath, 'bin', 'scs-sdk-plugin', platform.scs));
            }

            // 6. Generate files.json (V1 Parity)
            console.log('- Generating files.json...');
            const { Files, Folder } = await ThroughDirectory(stagingPath);
            const allItems = [...Folder, ...Files];
            const relativeItems = allItems.map(item => {
                let rel = path.relative(stagingPath, item);
                return rel.split(path.sep).join('/');
            });
            await fs.writeJson(path.join(stagingPath, 'config', 'files.json'), relativeItems, { spaces: 2 });

            // 7. Zip into .tpp
            const zipPath = path.join(DIST_DIR, `${APP_NAME}_${platform.name}_v${newVersion}.tpp`);
            const zip = new AdmZip();
            // Important: Zip root contains the folder name "ETS2_Dashboard"
            zip.addLocalFolder(stagingPath, APP_NAME);
            zip.writeZip(zipPath);
            console.log(`- Created: ${path.basename(zipPath)}`);
        }

        // Cleanup intermediate folders
        console.log('Final cleanup...');
        await fs.remove(TMP_DIR);
        await fs.remove(BUILD_DIR);
        await fs.remove(path.join(ROOT_DIR, 'dist'));

        console.log('\n--- Build Completed Successfully! ---');
        console.log(`Packages are in: ${DIST_DIR}`);

    } catch (e) {
        console.error('Build failed:', e);
        process.exit(1);
    }
}

build();
