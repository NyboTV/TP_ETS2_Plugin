const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const AdmZip = require('adm-zip');
const readline = require('readline');

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

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

async function runBuild() {
    try {
        console.log('\n--- Starting Build Process (V1 Parity) ---');

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

        const versionParts = pkgJson.version.split('.').map(id => {
            // Remove any suffix like -alpha or -beta before parsing
            return parseInt(id.split('-')[0]);
        });

        // Carry-over logic: x.y.9 -> x.(y+1).0 | x.9.9 -> (x+1).0.0
        versionParts[2]++; // Always increment patch
        if (versionParts[2] > 9) {
            versionParts[2] = 0;
            versionParts[1]++;
            if (versionParts[1] > 9) {
                versionParts[1] = 0;
                versionParts[0]++;
            }
        }

        const newVersion = versionParts.join('.');
        pkgJson.version = newVersion;
        await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 4 });
        console.log(`Version updated to: ${newVersion}`);

        console.log('Updating entry.tp version...');
        const entryTpPath = path.join(ROOT_DIR, 'entry.tp');
        const entryTp = await fs.readJson(entryTpPath);
        entryTp.version = parseInt(newVersion.split('.')[0]);
        await fs.writeJson(entryTpPath, entryTp, { spaces: 2 });

        console.log('Updating root cfg.json version...');
        const rootCfgPath = path.join(ROOT_DIR, 'config', 'cfg.json');
        if (await fs.pathExists(rootCfgPath)) {
            const cfg = await fs.readJson(rootCfgPath);
            cfg.version = newVersion;
            await fs.writeJson(rootCfgPath, cfg, { spaces: 2 });
            console.log(`- Updated root cfg.json to version ${newVersion}`);
        }

        // 3. Compile
        console.log('Compiling TypeScript...');
        execSync('npm run build', { stdio: 'inherit', cwd: ROOT_DIR });

        // 4. PKG Binary Generation
        console.log('Generating binaries with pkg...');
        const targets = platforms.map(p => p.pkg).join(',');
        execSync(`npx pkg . --targets ${targets} --out-path build`, { stdio: 'inherit', cwd: ROOT_DIR });

        // 5. Packaging loop
        for (const platform of platforms) {
            console.log(`\nPackaging for ${platform.name}...`);
            const stagingPath = path.join(TMP_DIR, platform.name, APP_NAME);
            await fs.ensureDir(stagingPath);

            const pkgBaseName = 'tp_ets2_plugin';
            let binarySource = path.join(BUILD_DIR, `${pkgBaseName}-${platform.name}${platform.ext}`);
            if (platform.name === 'win' && !binarySource.endsWith('.exe')) binarySource += '.exe';

            const binaryDest = path.join(stagingPath, `${APP_NAME}${platform.ext}`);

            if (await fs.pathExists(binarySource)) {
                await fs.copy(binarySource, binaryDest);
                console.log(`- Copied binary: ${path.basename(binarySource)} -> ${APP_NAME}${platform.ext}`);
            } else {
                const altSource = path.join(BUILD_DIR, `${pkgBaseName}-${platform.pkg}${platform.ext}`);
                if (await fs.pathExists(altSource)) {
                    await fs.copy(altSource, binaryDest);
                    console.log(`- Copied binary (alt): ${path.basename(altSource)} -> ${APP_NAME}${platform.ext}`);
                } else {
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

            await fs.copy(path.join(ROOT_DIR, 'config'), path.join(stagingPath, 'config'));
            await fs.copy(path.join(ROOT_DIR, 'entry.tp'), path.join(stagingPath, 'entry.tp'));
            await fs.copy(path.join(ROOT_DIR, 'LICENSE'), path.join(stagingPath, 'LICENSE'));

            const stagingCfgPath = path.join(stagingPath, 'config', 'cfg.json');
            if (await fs.pathExists(stagingCfgPath)) {
                const cfg = await fs.readJson(stagingCfgPath);
                cfg.version = newVersion;
                cfg.firstInstall = true;
                await fs.writeJson(stagingCfgPath, cfg, { spaces: 2 });
                console.log(`- Injected version ${newVersion} and set firstInstall: true into packaged cfg.json`);
            }

            const scsSource = path.join(ROOT_DIR, 'bin', 'scs-sdk-plugin', platform.scs);
            if (await fs.pathExists(scsSource)) {
                await fs.copy(scsSource, path.join(stagingPath, 'bin', 'scs-sdk-plugin', platform.scs));
            }

            console.log('- Generating files.json...');
            const { Files, Folder } = await ThroughDirectory(stagingPath);
            const allItems = [...Folder, ...Files];
            const relativeItems = allItems.map(item => {
                let rel = path.relative(stagingPath, item);
                return rel.split(path.sep).join('/');
            });
            await fs.writeJson(path.join(stagingPath, 'config', 'files.json'), relativeItems, { spaces: 2 });

            const zipPath = path.join(DIST_DIR, `${APP_NAME}_${platform.name}_v${newVersion}.tpp`);
            const zip = new AdmZip();
            zip.addLocalFolder(stagingPath, APP_NAME);
            zip.writeZip(zipPath);
            console.log(`- Created: ${path.basename(zipPath)}`);
        }

        console.log('Final cleanup...');
        await fs.remove(TMP_DIR);
        await fs.remove(BUILD_DIR);
        await fs.remove(path.join(ROOT_DIR, 'dist'));

        console.log('\n--- Build Completed Successfully! ---');
        console.log(`Packages are in: ${DIST_DIR}`);
        return newVersion;

    } catch (e) {
        console.error('Build failed:', e);
        throw e;
    }
}

async function runGitUpload(version) {
    console.log('\n--- Starting Git Upload ---');
    try {
        if (!version) {
            const pkgJson = await fs.readJson(path.join(ROOT_DIR, 'package.json'));
            version = pkgJson.version;
        }

        console.log('Staging files...');
        execSync('git add .', { stdio: 'inherit', cwd: ROOT_DIR });

        console.log('Committing...');
        try {
            execSync(`git commit -m "Bump version to v${version}"`, { stdio: 'inherit', cwd: ROOT_DIR });
        } catch (e) {
            console.log('Nothing to commit or commit failed (ignoring if just empty).');
        }

        console.log('Pushing to remote...');
        execSync('git push', { stdio: 'inherit', cwd: ROOT_DIR });
        console.log('Git Upload Completed!');
    } catch (e) {
        console.error('Git Upload failed:', e.message);
    }
}

async function getChangelogInfo() {
    const changelogPath = path.join(ROOT_DIR, 'CHANGELOG.md');
    if (!await fs.pathExists(changelogPath)) {
        throw new Error('CHANGELOG.md not found!');
    }

    const content = await fs.readFile(changelogPath, 'utf-8');
    const lines = content.split('\n');
    let title = '';
    let body = [];
    let foundTitle = false;

    // The first line starting with # is the title
    // Everything after until the next # (or end) is the body
    for (const line of lines) {
        if (line.trim().startsWith('# ')) {
            if (!foundTitle) {
                // Remove '# ' and special chars from title if needed, or keep as is.
                // User said: "V5.1.0 - High-Per..." is the title.
                // We'll take the raw text after '# '
                title = line.trim().substring(2).trim();
                foundTitle = true;
            } else {
                // Stop at next main header if we want strict single release, 
                // but usually changelogs have subsections like ## Features.
                // If we hit another # V... then we stop.
                if (line.trim().match(/^#\s+V\d+/)) break;
                body.push(line);
            }
        } else if (foundTitle) {
            body.push(line);
        }
    }

    return { title, body: body.join('\n').trim() };
}

async function runAutoRelease(version) {
    console.log('\n--- Starting Auto Release Preparation ---');
    try {
        const { title, body } = await getChangelogInfo();
        console.log(`\nDetected Release Info from CHANGELOG.md:`);
        console.log(`Title: ${title}`);
        console.log(`Body Length: ${body.length} chars`);

        const confirm = await askQuestion('\nIs this correct? (y/n): ');
        if (confirm.toLowerCase() !== 'y') {
            console.log('Aborting release creation.');
            return;
        }

        // Check for gh cli
        try {
            execSync('gh --version', { stdio: 'ignore' });

            // If gh exists, create release
            console.log('GitHub CLI found. Creating release...');
            // Construct command carefully. 
            // -t title, -n notes
            // We need to escape quotes in body for command line if passing directly, 
            // but spawn/execSync might be tricky with large multiline strings.
            // Better to write body to a temp file.
            const noteFile = path.join(TMP_DIR, 'release_notes.txt');
            await fs.ensureDir(TMP_DIR);
            await fs.writeFile(noteFile, body);

            const assets = await fs.readdir(DIST_DIR);
            const assetPaths = assets.map(a => path.join(DIST_DIR, a)).map(p => `"${p}"`).join(' ');

            const cmd = `gh release create v${version} -t "${title}" -F "${noteFile}" ${assetPaths}`;
            console.log(`Executing: ${cmd}`);
            execSync(cmd, { stdio: 'inherit', cwd: ROOT_DIR });

            await fs.remove(noteFile);
            console.log('Release created successfully!');

        } catch (e) {
            console.warn('\n! GitHub CLI (gh) not found or failed.');
            console.log('To automate this heavily, please install "gh" (GitHub CLI).');
            console.log('\n--- MANUAL RELEASE INSTRUCTIONS ---');
            console.log(`1. Go to https://github.com/NyboTV/TP_ETS2_Plugin/releases/new`);
            console.log(`2. Tag version: v${version}`);
            console.log(`3. Release title: ${title}`);
            console.log(`4. Description: (Copy from CHANGELOG.md)`);
            console.log(`5. Drag & Drop files from: ${DIST_DIR}`);
        }

    } catch (e) {
        console.error('Auto Release failed:', e);
    }
}

async function mainMenu() {
    console.clear();
    console.log('==========================================');
    console.log('   ETS2 Dashboard - Build & Release Tool  ');
    console.log('==========================================');
    console.log('1. Simple Build (Clean, Version++, Pack)');
    console.log('2. Git Upload (Add, Commit, Push)');
    console.log('3. Full Release (Build + Git + GH Release)');
    console.log('4. Exit');
    console.log('==========================================');

    const answer = await askQuestion('Select an option (1-4): ');

    if (answer === '1') {
        await runBuild();
    } else if (answer === '2') {
        const pkg = await fs.readJson(path.join(ROOT_DIR, 'package.json'));
        await runGitUpload(pkg.version);
    } else if (answer === '3') {
        const newVersion = await runBuild();
        await runGitUpload(newVersion);
        await runAutoRelease(newVersion);
    } else if (answer === '4') {
        process.exit(0);
    } else {
        console.log('Invalid selection.');
    }

    rl.close();
}

mainMenu();
