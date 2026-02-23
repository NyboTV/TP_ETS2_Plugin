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
    { name: 'win', pkg: 'node18-win-x64', ext: '.exe', scs: 'windows', wsl: false },
    { name: 'linux', pkg: 'node18-linux-x64', ext: '', scs: 'linux', wsl: true },
    { name: 'mac', pkg: 'node18-macos-x64', ext: '', scs: 'macos', wsl: true } // macOS built via WSL so linux modules are bundled or fetched if prebuilt
];

// ANSI Colors for premium UI
const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    fg: {
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
    },
    bg: {
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
    }
};

const log = {
    header: (msg) => console.log(`\n${colors.fg.cyan}${colors.bright}🚀 ${msg}${colors.reset}\n`),
    step: (msg) => console.log(`${colors.fg.blue}➜ ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.fg.green}✔ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.dim}  ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.fg.yellow}⚠ ${msg}${colors.reset}`),
    error: (msg) => console.error(`\n${colors.fg.red}${colors.bright}✖ ${msg}${colors.reset}\n`),
    divider: () => console.log(`${colors.dim}${"─".repeat(50)}${colors.reset}`)
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (query) => new Promise(resolve => rl.question(`${colors.fg.yellow}?${colors.reset} ${colors.bright}${query}${colors.reset}`, resolve));

// Helpers
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

function getGhPath() {
    try {
        execSync('gh --version', { stdio: 'ignore' });
        return 'gh';
    } catch {
        const commonPaths = [
            path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Links', 'gh.exe'),
            path.join(process.env.LOCALAPPDATA || '', 'GitHub CLI', 'gh.exe'),
            path.join(process.env.ProgramFiles || '', 'GitHub CLI', 'gh.exe'),
            path.join(process.env['ProgramFiles(x86)'] || '', 'GitHub CLI', 'gh.exe')
        ];
        const found = commonPaths.find(p => fs.existsSync(p));
        return found ? `"${found}"` : null;
    }
}

async function getChangelogInfo() {
    const changelogPath = path.join(ROOT_DIR, 'CHANGELOG.md');
    if (!await fs.pathExists(changelogPath)) throw new Error('CHANGELOG.md not found!');
    const content = await fs.readFile(changelogPath, 'utf-8');
    const lines = content.split('\n');
    let title = '', body = [], foundTitle = false;
    for (const line of lines) {
        if (line.trim().startsWith('# ')) {
            if (!foundTitle) {
                title = line.trim().substring(2).trim();
                foundTitle = true;
            } else {
                if (line.trim().match(/^#\s+V\d+/)) break;
                body.push(line);
            }
        } else if (foundTitle) {
            body.push(line);
        }
    }
    return { title, body: body.join('\n').trim() };
}

async function runCommand(cmd, cwd = ROOT_DIR, env = undefined) {
    try {
        execSync(cmd, { stdio: 'inherit', cwd, env: env || process.env });
    } catch (e) {
        throw new Error(`Command failed: ${cmd}`);
    }
}

// Ensure WSL exists
function checkWsl() {
    try {
        execSync('wsl --status', { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// ==== Core Build Logic ====

async function incrementVersion(type = 'patch') {
    const pkgJsonPath = path.join(ROOT_DIR, 'package.json');
    const pkgJson = await fs.readJson(pkgJsonPath);
    let [major, minor, patch] = pkgJson.version.split('-')[0].split('.').map(Number);

    if (type === 'major') { major++; minor = 0; patch = 0; }
    else if (type === 'minor') { minor++; patch = 0; }
    else { patch++; }

    const newVersion = `${major}.${minor}.${patch}`;
    pkgJson.version = newVersion;
    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 4 });
    log.success(`package.json version updated to: ${newVersion}`);

    const entryTpPath = path.join(ROOT_DIR, 'entry.tp');
    if (await fs.pathExists(entryTpPath)) {
        const entryTp = await fs.readJson(entryTpPath);
        entryTp.version = major; // Or whatever version integer logic TP needs
        await fs.writeJson(entryTpPath, entryTp, { spaces: 2 });
    }

    const rootCfgPath = path.join(ROOT_DIR, 'config', 'cfg.json');
    if (await fs.pathExists(rootCfgPath)) {
        const cfg = await fs.readJson(rootCfgPath);
        cfg.version = newVersion;
        await fs.writeJson(rootCfgPath, cfg, { spaces: 2 });
    }

    return newVersion;
}

// The main compile phase for a SPECIFIC env (windows native vs WSL)
async function compileAndPackageEnv(isWsl, targetPlatforms) {
    log.step(`Preparing node_modules via ${isWsl ? 'WSL (Linux)' : 'Windows native'}...`);

    // 1. Clean node_modules to force native rebuilds
    await fs.remove(path.join(ROOT_DIR, 'node_modules'));
    await fs.remove(path.join(ROOT_DIR, 'dist'));
    await fs.remove(BUILD_DIR);

    // 2. Install
    if (isWsl) {
        log.info('Running npm install in WSL (grabbing linux native modules)...');
        // Use bash -lic to load nvm if installed
        await runCommand(`wsl --exec bash -lic "npm install"`);
    } else {
        log.info('Running npm install in Windows...');
        await runCommand('npm install');
    }

    // 3. Compile TS
    log.step(`Compiling TypeScript (${isWsl ? 'WSL' : 'Windows'})...`);
    if (isWsl) {
        await runCommand(`wsl --exec bash -lic "npm run build"`);
    } else {
        await runCommand('npm run build');
    }

    // 4. PKG
    const targets = targetPlatforms.map(p => p.pkg).join(',');
    log.step(`Packaging binaries with pkg targets: ${targets}`);
    if (isWsl) {
        await runCommand(`wsl --exec bash -lic "npx pkg . --targets ${targets} --out-path build"`);
    } else {
        await runCommand(`npx pkg . --targets ${targets} --out-path build`);
    }
}

async function prepareTppUploads(targetPlatforms, version) {
    for (const platform of targetPlatforms) {
        log.step(`Assembling .tpp for ${platform.name}...`);
        const stagingPath = path.join(TMP_DIR, platform.name, APP_NAME);
        await fs.ensureDir(stagingPath);

        const pkgBaseName = 'tp_ets2_plugin';
        let binarySource = path.join(BUILD_DIR, `${pkgBaseName}-${platform.name}${platform.ext}`);
        if (platform.name === 'win' && !binarySource.endsWith('.exe')) binarySource += '.exe';
        const binaryDest = path.join(stagingPath, `${APP_NAME}${platform.ext}`);

        if (await fs.pathExists(binarySource)) {
            await fs.copy(binarySource, binaryDest);
        } else {
            const altSource = path.join(BUILD_DIR, `${pkgBaseName}-${platform.pkg}${platform.ext}`);
            if (await fs.pathExists(altSource)) {
                await fs.copy(altSource, binaryDest);
            } else {
                log.warn(`Warning: Exact binary source not found for ${platform.name}, skipping TPP assemble.`);
                continue;
            }
        }

        // Copy configs and metadata
        await fs.copy(path.join(ROOT_DIR, 'config'), path.join(stagingPath, 'config'));
        await fs.copy(path.join(ROOT_DIR, 'entry.tp'), path.join(stagingPath, 'entry.tp'));
        if (await fs.pathExists(path.join(ROOT_DIR, 'LICENSE'))) {
            await fs.copy(path.join(ROOT_DIR, 'LICENSE'), path.join(stagingPath, 'LICENSE'));
        }

        const stagingCfgPath = path.join(stagingPath, 'config', 'cfg.json');
        if (await fs.pathExists(stagingCfgPath)) {
            const cfg = await fs.readJson(stagingCfgPath);
            cfg.version = version;
            cfg.firstInstall = true;
            await fs.writeJson(stagingCfgPath, cfg, { spaces: 2 });
        }

        const scsSource = path.join(ROOT_DIR, 'bin', 'scs-sdk-plugin', platform.scs);
        if (await fs.pathExists(scsSource)) {
            await fs.copy(scsSource, path.join(stagingPath, 'bin', 'scs-sdk-plugin', platform.scs));
        }

        const { Files, Folder } = await ThroughDirectory(stagingPath);
        const allItems = [...Folder, ...Files];
        const relativeItems = allItems.map(item => path.relative(stagingPath, item).split(path.sep).join('/'));
        await fs.writeJson(path.join(stagingPath, 'config', 'files.json'), relativeItems, { spaces: 2 });

        const zipPath = path.join(DIST_DIR, `${APP_NAME}_${platform.name}_v${version}.tpp`);
        const zip = new AdmZip();
        zip.addLocalFolder(stagingPath, APP_NAME);
        zip.writeZip(zipPath);
        log.success(`Created: ${path.basename(zipPath)}`);
    }
}

async function runBuildProcess(platformsToBuild) {
    if (platformsToBuild.some(p => p.wsl) && !checkWsl()) {
        log.error('WSL is required for Linux/Mac builds but was not found.');
        return;
    }

    const pkgJson = await fs.readJson(path.join(ROOT_DIR, 'package.json'));
    const currentVersion = pkgJson.version;

    // Cleanup
    log.header(`Starting Build for v${currentVersion}`);
    await fs.remove(DIST_DIR);
    await fs.remove(TMP_DIR);
    await fs.ensureDir(DIST_DIR);

    const winPlats = platformsToBuild.filter(p => !p.wsl);
    const wslPlats = platformsToBuild.filter(p => p.wsl);

    try {
        if (winPlats.length > 0) {
            await compileAndPackageEnv(false, winPlats);
            await prepareTppUploads(winPlats, currentVersion);
        }

        if (wslPlats.length > 0) {
            await compileAndPackageEnv(true, wslPlats);
            await prepareTppUploads(wslPlats, currentVersion);
        }

        log.step('Final cleanup...');
        await fs.remove(TMP_DIR);
        await fs.remove(BUILD_DIR);
        await fs.remove(path.join(ROOT_DIR, 'dist'));

        // Restore cleanly for IDE usage
        log.info('Restoring local node_modules via Windows...');
        await runCommand('npm install');

        log.success(`Build process complete. Packages in ${DIST_DIR}`);
    } catch (e) {
        log.error(`Build process failed: ${e.message}`);
    }
}

async function runGitUpload() {
    log.header('Starting Git Upload');
    const pkgJson = await fs.readJson(path.join(ROOT_DIR, 'package.json'));

    try {
        log.step('Staging files...');
        await runCommand('git add .');

        log.step('Committing...');
        try {
            await runCommand(`git commit -m "Bump version to v${pkgJson.version}"`);
        } catch {
            log.info('Nothing to commit or commit failed.');
        }

        log.step('Pushing to remote...');
        await runCommand('git push');
        log.success('Git upload complete.');
    } catch (e) {
        log.error(`Git upload failed: ${e.message}`);
    }
}

async function runGitHubRelease(mode = 'draft') {
    log.header(`GitHub Release (${mode === 'draft' ? 'Draft New' : 'Update Latest'})`);

    const ghPath = getGhPath();
    if (!ghPath) {
        log.error('GitHub CLI (gh) not found.');
        return;
    }

    try {
        log.step('Checking auth...');
        execSync(`${ghPath} auth status`, { stdio: 'ignore' });
    } catch {
        log.warn('Authentication needed.');
        await runCommand(`${ghPath} auth login`);
    }

    const pkgJson = await fs.readJson(path.join(ROOT_DIR, 'package.json'));
    const version = pkgJson.version;
    const { title, body } = await getChangelogInfo();

    const assets = await fs.readdir(DIST_DIR);
    if (assets.length === 0) {
        log.error('No .tpp files found in dist_package/. Build first!');
        return;
    }
    const assetPaths = assets.map(a => `"${path.join(DIST_DIR, a)}"`).join(' ');

    if (mode === 'draft') {
        const noteFile = path.join(ROOT_DIR, 'release_notes.txt');
        await fs.writeFile(noteFile, body);

        log.step('Creating new draft release...');
        try {
            await runCommand(`${ghPath} release create v${version} -t "${title}" -F "${noteFile}" -d ${assetPaths}`);
            log.success('Draft release created!');
        } finally {
            await fs.remove(noteFile);
        }
    } else if (mode === 'replace') {
        log.step('Fetching latest release...');
        const latestTagCmd = `${ghPath} release view --json tagName -q ".tagName"`;
        let latestTag = '';
        try {
            latestTag = execSync(latestTagCmd).toString().trim();
        } catch {
            log.error('Could not find latest release.');
            return;
        }

        log.info(`Updating release ${latestTag} with new assets...`);
        // Upload with --clobber to replace
        await runCommand(`${ghPath} release upload ${latestTag} ${assetPaths} --clobber`);
        log.success('Upload complete.');
    }
}

// ==== CLI MENU ====

const menuOptions = [
    { label: 'Build -> Windows Only', action: () => runBuildProcess([platforms[0]]) },
    { label: 'Build -> Linux & Mac (via WSL)', action: () => runBuildProcess([platforms[1], platforms[2]]) },
    { label: 'Build -> All Platforms', action: () => runBuildProcess(platforms) },
    { label: 'Bump Version (Patch)', action: () => incrementVersion('patch') },
    { label: 'Git Push Everything', action: () => runGitUpload() },
    { label: 'GH Release -> Draft New', action: () => runGitHubRelease('draft') },
    { label: 'GH Release -> Replace Latest Assets', action: () => runGitHubRelease('replace') },
    {
        label: 'Full CI Workflow (Bump, Build All, Git Push, Release)', action: async () => {
            await incrementVersion('patch');
            await runBuildProcess(platforms);
            await runGitUpload();
            await runGitHubRelease('draft');
        }
    },
    { label: 'Exit', action: () => process.exit(0) }
];

async function showMenu() {
    console.clear();
    log.divider();
    console.log(`${colors.bg.blue}${colors.fg.white}${colors.bright}   ✨ ETS2 TouchPortal Plugin Builder ✨   ${colors.reset}`);
    log.divider();

    // Read version info
    try {
        const pkg = await fs.readJson(path.join(ROOT_DIR, 'package.json'));
        console.log(`${colors.dim}Current Version: v${pkg.version}${colors.reset}\n`);
    } catch { }

    menuOptions.forEach((opt, idx) => {
        console.log(`  ${colors.fg.cyan}${idx + 1}.${colors.reset} ${opt.label}`);
    });
    console.log();

    const choice = await ask(`Select an option (1-${menuOptions.length}): `);
    const idx = parseInt(choice) - 1;

    if (idx >= 0 && idx < menuOptions.length) {
        await menuOptions[idx].action();
        console.log();
        const runAgain = await ask('Run another action? (y/N): ');
        if (runAgain.toLowerCase() === 'y') {
            await showMenu();
        } else {
            console.log(colors.dim + 'Goodbye!' + colors.reset);
            process.exit(0);
        }
    } else {
        log.error('Invalid choice, try again.');
        setTimeout(() => showMenu(), 1500);
    }
}

// Start
showMenu().catch(err => {
    log.error(`Process fatal error: ${err.message}`);
    process.exit(1);
});
