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

// ANSI Colors
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        crimson: "\x1b[38m"
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        crimson: "\x1b[48m"
    }
};

const log = {
    header: (msg) => console.log(`\n${colors.fg.cyan}${colors.bright}>>> ${msg} <<<${colors.reset}`),
    step: (msg) => console.log(`${colors.fg.blue}➜ ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.fg.green}✔ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.dim}  ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.fg.yellow}⚠ ${msg}${colors.reset}`),
    error: (msg) => console.error(`${colors.fg.red}✖ ${msg}${colors.reset}`),
    box: (lines) => {
        const maxLength = Math.max(...lines.map(l => l.length));
        const border = '='.repeat(maxLength + 4);
        console.log(`${colors.fg.magenta}${border}`);
        lines.forEach(l => {
            const padding = ' '.repeat(maxLength - l.length);
            console.log(`| ${l}${padding} |`);
        });
        console.log(`${border}${colors.reset}`);
    }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(`${colors.fg.white}${query}${colors.reset}`, resolve));

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
        log.header('Starting Build Process (V1 Parity)');

        // 1. Cleanup
        log.step('Cleaning up...');
        await fs.remove(DIST_DIR);
        await fs.remove(BUILD_DIR);
        await fs.remove(TMP_DIR);
        await fs.remove(path.join(ROOT_DIR, 'dist'));
        await fs.ensureDir(DIST_DIR);

        // 2. Versioning
        log.step('Incrementing version...');
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
        log.success(`Version updated to: ${newVersion}`);

        log.info('Updating entry.tp version...');
        const entryTpPath = path.join(ROOT_DIR, 'entry.tp');
        const entryTp = await fs.readJson(entryTpPath);
        entryTp.version = parseInt(newVersion.split('.')[0]);
        await fs.writeJson(entryTpPath, entryTp, { spaces: 2 });

        log.info('Updating root cfg.json version...');
        const rootCfgPath = path.join(ROOT_DIR, 'config', 'cfg.json');
        if (await fs.pathExists(rootCfgPath)) {
            const cfg = await fs.readJson(rootCfgPath);
            cfg.version = newVersion;
            await fs.writeJson(rootCfgPath, cfg, { spaces: 2 });
            log.success(`Updated root cfg.json to version ${newVersion}`);
        }

        // 3. Compile
        log.step('Compiling TypeScript...');
        execSync('npm run build', { stdio: 'inherit', cwd: ROOT_DIR });

        // 4. PKG Binary Generation
        log.step('Generating binaries with pkg...');
        const targets = platforms.map(p => p.pkg).join(',');
        execSync(`npx pkg . --targets ${targets} --out-path build`, { stdio: 'inherit', cwd: ROOT_DIR });

        // 5. Packaging loop
        for (const platform of platforms) {
            log.header(`Packaging for ${platform.name}...`);
            const stagingPath = path.join(TMP_DIR, platform.name, APP_NAME);
            await fs.ensureDir(stagingPath);

            const pkgBaseName = 'tp_ets2_plugin';
            let binarySource = path.join(BUILD_DIR, `${pkgBaseName}-${platform.name}${platform.ext}`);
            if (platform.name === 'win' && !binarySource.endsWith('.exe')) binarySource += '.exe';

            const binaryDest = path.join(stagingPath, `${APP_NAME}${platform.ext}`);

            if (await fs.pathExists(binarySource)) {
                await fs.copy(binarySource, binaryDest);
                log.info(`Copied binary: ${path.basename(binarySource)} -> ${APP_NAME}${platform.ext}`);
            } else {
                const altSource = path.join(BUILD_DIR, `${pkgBaseName}-${platform.pkg}${platform.ext}`);
                if (await fs.pathExists(altSource)) {
                    await fs.copy(altSource, binaryDest);
                    log.info(`Copied binary (alt): ${path.basename(altSource)} -> ${APP_NAME}${platform.ext}`);
                } else {
                    const files = await fs.readdir(BUILD_DIR);
                    const match = files.find(f => f.startsWith(pkgBaseName) && f.includes(platform.name));
                    if (match) {
                        await fs.copy(path.join(BUILD_DIR, match), binaryDest);
                        log.info(`Copied binary (match): ${match} -> ${APP_NAME}${platform.ext}`);
                    } else {
                        log.warn(`Binary source not found for ${platform.name}`);
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
                log.info(`Injected version ${newVersion} and set firstInstall: true`);
            }

            const scsSource = path.join(ROOT_DIR, 'bin', 'scs-sdk-plugin', platform.scs);
            if (await fs.pathExists(scsSource)) {
                await fs.copy(scsSource, path.join(stagingPath, 'bin', 'scs-sdk-plugin', platform.scs));
            }

            log.info('Generating files.json...');
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
            log.success(`Created: ${path.basename(zipPath)}`);
        }

        log.step('Final cleanup...');
        await fs.remove(TMP_DIR);
        await fs.remove(BUILD_DIR);
        await fs.remove(path.join(ROOT_DIR, 'dist'));

        log.header('Build Completed Successfully!');
        log.success(`Packages are in: ${DIST_DIR}`);
        return newVersion;

    } catch (e) {
        log.error(`Build failed: ${e.message}`);
        throw e;
    }
}

async function runGitUpload(version) {
    log.header('Starting Git Upload');
    try {
        if (!version) {
            const pkgJson = await fs.readJson(path.join(ROOT_DIR, 'package.json'));
            version = pkgJson.version;
        }

        log.step('Staging files...');
        execSync('git add .', { stdio: 'inherit', cwd: ROOT_DIR });

        log.step('Committing...');
        try {
            execSync(`git commit -m "Bump version to v${version}"`, { stdio: 'inherit', cwd: ROOT_DIR });
        } catch (e) {
            log.info('Nothing to commit or commit failed (ignoring if just empty).');
        }

        log.step('Pushing to remote...');
        execSync('git push', { stdio: 'inherit', cwd: ROOT_DIR });
        log.success('Git Upload Completed!');
    } catch (e) {
        log.error(`Git Upload failed: ${e.message}`);
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


function getGhPath() {
    try {
        execSync('gh --version', { stdio: 'ignore' });
        return 'gh';
    } catch {
        const commonPaths = [
            path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Links', 'gh.exe'),
            path.join(process.env.LOCALAPPDATA, 'GitHub CLI', 'gh.exe'),
            path.join(process.env.ProgramFiles, 'GitHub CLI', 'gh.exe'),
            path.join(process.env['ProgramFiles(x86)'], 'GitHub CLI', 'gh.exe')
        ];

        const found = commonPaths.find(p => fs.existsSync(p));
        if (found) {
            return `"${found}"`;
        }
        return null;
    }
}

async function checkGhAuth(ghPath) {
    try {
        // Check if logged in
        execSync(`${ghPath} auth status`, { stdio: 'ignore' });
        return true;
    } catch (e) {
        log.warn('Not logged in to GitHub.');
        log.step('Starting interactive login...');
        try {
            execSync(`${ghPath} auth login`, { stdio: 'inherit' });
            return true;
        } catch (authErr) {
            log.error('Authentication failed or cancelled.');
            return false;
        }
    }
}

async function runAutoRelease(version) {
    log.header('Starting Auto Release Preparation');
    try {
        const { title, body } = await getChangelogInfo();
        log.box([
            'Detected Release Info from CHANGELOG.md:',
            `Title: ${title}`,
            `Body Length: ${body.length} chars`
        ]);

        const confirm = await askQuestion('\nIs this correct? (y/n): ');
        if (confirm.toLowerCase() !== 'y') {
            log.warn('Aborting release creation.');
            return;
        }

        // 1. Resolve GH Path
        const ghPath = getGhPath();
        if (!ghPath) {
            log.warn('GitHub CLI (gh) not found in PATH or common locations.');
            log.info('Please install it manually or ensure it is in your PATH.');
            throw new Error('GitHub CLI not found.');
        } else if (ghPath !== 'gh') {
            log.info(`Using GitHub CLI at: ${ghPath}`);
        }

        // 2. Check/Perform Auth
        if (!await checkGhAuth(ghPath)) {
            throw new Error('GitHub CLI authentication failed.');
        }

        // 3. Create Release
        // Construct notes file
        const noteFile = path.join(TMP_DIR, 'release_notes.txt');
        await fs.ensureDir(TMP_DIR);
        await fs.writeFile(noteFile, body);

        const assets = await fs.readdir(DIST_DIR);
        const assetPaths = assets.map(a => path.join(DIST_DIR, a)).map(p => `"${p}"`).join(' ');

        log.step('Creating GitHub Release...');
        const cmd = `${ghPath} release create v${version} -t "${title}" -F "${noteFile}" ${assetPaths}`;
        log.info(`Executing: ${cmd}`);

        try {
            execSync(cmd, { stdio: 'inherit', cwd: ROOT_DIR });
            log.success('Release created successfully!');
        } catch (e) {
            throw e;
        } finally {
            await fs.remove(noteFile);
        }

    } catch (e) {
        log.error(`Auto Release failed: ${e.message}`);
        log.info('If this was a network/auth error, you can try again.');
        log.header('MANUAL RELEASE FALLBACK');
        log.box([
            `1. Go to https://github.com/NyboTV/TP_ETS2_Plugin/releases/new`,
            `2. Tag version: v${version}`,
            `3. Upload files from: ${DIST_DIR}`
        ]);
    }
}

async function mainMenu() {
    console.clear();
    log.box([
        '   ETS2 Dashboard - Build & Release Tool  ',
        '   v1.0.0 Interactive                     '
    ]);
    console.log(`${colors.fg.cyan}1.${colors.reset} Simple Build ${colors.dim}(Clean, Version++, Pack)${colors.reset}`);
    console.log(`${colors.fg.cyan}2.${colors.reset} Git Upload ${colors.dim}(Add, Commit, Push)${colors.reset}`);
    console.log(`${colors.fg.cyan}3.${colors.reset} Full Release ${colors.dim}(Build + Git + GH Release)${colors.reset}`);
    console.log(`${colors.fg.cyan}4.${colors.reset} Exit`);
    console.log('');

    const answer = await askQuestion(`Select an option (${colors.fg.cyan}1-4${colors.fg.white}): `);

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
        log.error('Invalid selection.');
    }

    rl.close();
}

mainMenu();
