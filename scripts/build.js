const fs = require('fs-extra');
const path = require('path');
const { execSync, exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);
const AdmZip = require('adm-zip');
const readline = require('readline');

const APP_NAME = 'ETS2_Dashboard';
const ROOT_DIR = path.join(__dirname, '..');
// We will output final TPP packages to the 'Releases' folder to avoid conflicts
const DIST_DIR = path.join(ROOT_DIR, 'Releases');
// We use a dedicated temp directory for intermediate pkg binaries and staging
const TMP_DIR = path.join(ROOT_DIR, 'scripts', 'tmp');
const PKG_OUT_DIR = path.join(TMP_DIR, 'pkg_binaries');

const platforms = [
    { name: 'win', pkg: 'node18-win-x64', pkgName: 'win', ext: '.exe', scs: 'windows', wsl: false },
    { name: 'linux', pkg: 'node18-linux-x64', pkgName: 'linux', ext: '', scs: 'linux', wsl: true },
    { name: 'mac', pkg: 'node18-macos-x64', pkgName: 'macos', ext: '', scs: 'macos', wsl: true } // macOS built via WSL so linux modules are bundled or fetched if prebuilt
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
    error: (msg) => console.error(`\n${colors.fg.red}${colors.bright}✖ ${msg}${colors.reset}\n`),
    divider: () => console.log(`${colors.dim}${"─".repeat(50)}${colors.reset}`)
};

class Spinner {
    constructor(text) {
        this.text = text;
        this.chars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        this.index = 0;
        this.timer = null;
    }
    start() {
        process.stdout.write('\x1B[?25l'); // Hide cursor
        this.timer = setInterval(() => {
            process.stdout.write(`\r${colors.fg.cyan}${this.chars[this.index]}${colors.reset} ${this.text}`);
            this.index = (this.index + 1) % this.chars.length;
        }, 80);
        return this;
    }
    stop(success = true, finalText = null) {
        clearInterval(this.timer);
        process.stdout.write('\x1B[?25h'); // Show cursor
        const symbol = success ? `${colors.fg.green}✔${colors.reset}` : `${colors.fg.red}✖${colors.reset}`;
        process.stdout.write(`\r${symbol} ${finalText || this.text}\n`);
    }
}

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
        await execAsync(cmd, { cwd, env: env || process.env });
    } catch (e) {
        // Only throw a concise error, suppress noisy raw logs
        throw new Error(`Command failed: ${cmd}\n${e.message}`);
    }
}

// Ensure WSL exists and its dependencies
function checkWsl() {
    try {
        execSync('wsl --status', { stdio: 'ignore' });
    } catch {
        log.error('WSL is required for Linux/Mac builds but was not found.');
        return false;
    }

    try {
        execSync('wsl --exec bash -lic "command -v g++"', { stdio: 'ignore' });
        execSync('wsl --exec bash -lic "command -v make"', { stdio: 'ignore' });
        return true;
    } catch {
        log.error('WSL is missing required build tools (g++ or make) for native addons.');
        log.info('Please open your WSL terminal (Ubuntu) and install them by running:');
        console.log(`${colors.fg.cyan}  sudo apt-get update && sudo apt-get install -y build-essential python3${colors.reset}\n`);
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

async function setCustomVersion(newVersion) {
    const pkgJsonPath = path.join(ROOT_DIR, 'package.json');
    const pkgJson = await fs.readJson(pkgJsonPath);

    pkgJson.version = newVersion;
    await fs.writeJson(pkgJsonPath, pkgJson, { spaces: 4 });
    log.success(`Version updated to: ${newVersion}`);

    const entryTpPath = path.join(ROOT_DIR, 'entry.tp');
    if (await fs.pathExists(entryTpPath)) {
        const entryTp = await fs.readJson(entryTpPath);
        const major = parseInt(newVersion.split('.')[0]);
        if (!isNaN(major)) {
            entryTp.version = major;
        }
        await fs.writeJson(entryTpPath, entryTp, { spaces: 2 });
    }

    const rootCfgPath = path.join(ROOT_DIR, 'config', 'cfg.json');
    if (await fs.pathExists(rootCfgPath)) {
        const cfg = await fs.readJson(rootCfgPath);
        cfg.version = newVersion;
        await fs.writeJson(rootCfgPath, cfg, { spaces: 2 });
    }
}

// The main compile phase for a SPECIFIC env (windows native vs WSL)
async function compileAndPackageEnv(isWsl, targetPlatforms) {
    const envName = isWsl ? 'WSL (Linux/Mac)' : 'Windows native';

    // 1. Clean temp & outputs
    await fs.remove(path.join(ROOT_DIR, 'node_modules'));
    await fs.remove(path.join(ROOT_DIR, 'dist'));
    await fs.remove(path.join(ROOT_DIR, 'build'));
    await fs.remove(PKG_OUT_DIR);
    await fs.ensureDir(PKG_OUT_DIR);

    // 2. Install
    const installSpinner = new Spinner(`Installing node_modules via ${envName}...`).start();
    try {
        if (isWsl) {
            await runCommand(`wsl --exec bash -lic "npm install"`);
        } else {
            await runCommand('npm install');
        }
        installSpinner.stop(true);
    } catch (err) {
        installSpinner.stop(false);
        throw err;
    }

    // 3. Compile TS
    const tsSpinner = new Spinner(`Compiling TypeScript (${envName})...`).start();
    try {
        if (isWsl) {
            await runCommand(`wsl --exec bash -lic "npm run build"`);
        } else {
            await runCommand('npm run build');
        }
        tsSpinner.stop(true);
    } catch (err) {
        tsSpinner.stop(false);
        throw err;
    }

    // 4. PKG
    const targets = targetPlatforms.map(p => p.pkg).join(',');
    const pkgSpinner = new Spinner(`Packaging binaries (${targets})...`).start();
    try {
        if (isWsl) {
            await runCommand(`wsl --exec bash -lic "npx pkg . --targets ${targets} --out-path scripts/tmp/pkg_binaries"`);
        } else {
            await runCommand(`npx pkg . --targets ${targets} --out-path ${PKG_OUT_DIR}`);
        }
        pkgSpinner.stop(true);
    } catch (err) {
        pkgSpinner.stop(false);
        throw err;
    }
}

async function prepareTppUploads(targetPlatforms, version) {
    for (const platform of targetPlatforms) {
        const tppSpinner = new Spinner(`Assembling .tpp for ${platform.name}...`).start();
        try {
            const stagingPath = path.join(TMP_DIR, platform.name, APP_NAME);
            await fs.ensureDir(stagingPath);

            const pkgBaseName = 'tp_ets2_plugin';
            let binarySource = path.join(PKG_OUT_DIR, `${pkgBaseName}-${platform.pkgName}${platform.ext}`);
            if (platform.name === 'win' && !binarySource.endsWith('.exe')) binarySource += '.exe';
            const binaryDest = path.join(stagingPath, `${APP_NAME}${platform.ext}`);

            if (await fs.pathExists(binarySource)) {
                await fs.copy(binarySource, binaryDest);
            } else {
                const altSource = path.join(PKG_OUT_DIR, `${pkgBaseName}-${platform.pkg}${platform.ext}`);
                const exactSource = path.join(PKG_OUT_DIR, `${pkgBaseName}${platform.ext}`);
                if (await fs.pathExists(altSource)) {
                    await fs.copy(altSource, binaryDest);
                } else if (await fs.pathExists(exactSource)) {
                    await fs.copy(exactSource, binaryDest);
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
            tppSpinner.stop(true, `Created: ${path.basename(zipPath)}`);
        } catch (err) {
            tppSpinner.stop(false);
            throw err;
        }
    }
}

async function runBuildProcess(platformsToBuild) {
    if (platformsToBuild.some(p => p.wsl)) {
        if (!checkWsl()) {
            return; // checkWsl prints its own detailed error
        }
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
        await fs.remove(TMP_DIR); // Removes intermediate staging and pkg_binaries
        await fs.remove(path.join(ROOT_DIR, 'dist')); // Removes tsc output
        await fs.remove(path.join(ROOT_DIR, 'build')); // Clean up any old build folders

        // Restore cleanly for IDE usage
        const restoreSpinner = new Spinner('Restoring local node_modules via Windows for workspace...').start();
        await runCommand('npm install');
        restoreSpinner.stop(true);

        log.success(`Build process complete. Packages in ${DIST_DIR}`);
    } catch (e) {
        log.error(`Process halted: ${e.message}`);
    }
}

async function runGitUpload() {
    log.header('Starting Git Upload');
    const pkgJson = await fs.readJson(path.join(ROOT_DIR, 'package.json'));

    const gitSpinner = new Spinner('Staging, Committing, and Pushing to remote...').start();
    try {
        await runCommand('git add .');

        try {
            await runCommand(`git commit -m "Bump version to v${pkgJson.version}"`);
        } catch {
            // Nothing to commit
        }

        await runCommand('git push');
        gitSpinner.stop(true, 'Git upload complete.');
    } catch (e) {
        gitSpinner.stop(false);
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

        const relSpinner = new Spinner('Creating new draft release on GitHub...').start();
        try {
            await runCommand(`${ghPath} release create v${version} -t "${title}" -F "${noteFile}" -d ${assetPaths}`);
            relSpinner.stop(true, 'Draft release created!');
        } catch (e) {
            relSpinner.stop(false);
            throw e;
        } finally {
            await fs.remove(noteFile);
        }
    } else if (mode === 'replace') {
        const relSpinner = new Spinner('Fetching latest release and updating assets...').start();
        try {
            const latestTagCmd = `${ghPath} release view --json tagName -q ".tagName"`;
            let latestTag = '';
            try {
                latestTag = execSync(latestTagCmd).toString().trim();
            } catch {
                relSpinner.stop(false);
                log.error('Could not find latest release.');
                return;
            }

            // Upload with --clobber to replace
            await runCommand(`${ghPath} release upload ${latestTag} ${assetPaths} --clobber`);
            relSpinner.stop(true, `Updated release ${latestTag} with new assets.`);
        } catch (e) {
            relSpinner.stop(false);
            throw e;
        }
    }
}

// ==== CLI MENU ====

async function promptForVersionAndBuild(platformsToBuild) {
    const pkg = await fs.readJson(path.join(ROOT_DIR, 'package.json'));
    const currentVersion = pkg.version;
    const customVersion = await ask(`Enter version to build (leave blank for v${currentVersion}): `);

    if (customVersion.trim() !== '') {
        await setCustomVersion(customVersion.trim());
    }

    await runBuildProcess(platformsToBuild);
}

async function showBuildSubMenu() {
    console.log();
    console.log(`${colors.fg.cyan}1.${colors.reset} Build -> Windows Only`);
    console.log(`${colors.fg.cyan}2.${colors.reset} Build -> Linux & Mac (via WSL)`);
    console.log(`${colors.fg.cyan}3.${colors.reset} Build -> All Platforms`);
    console.log(`${colors.fg.cyan}4.${colors.reset} Back to Main Menu\n`);

    const choice = await ask(`Select platform option (1-4): `);
    if (choice === '1') await promptForVersionAndBuild([platforms[0]]);
    else if (choice === '2') await promptForVersionAndBuild([platforms[1], platforms[2]]);
    else if (choice === '3') await promptForVersionAndBuild(platforms);
    else if (choice === '4') return;
    else log.error('Invalid choice.');
}

async function showReleaseSubMenu() {
    console.log();
    console.log(`${colors.fg.cyan}1.${colors.reset} Draft New Release`);
    console.log(`${colors.fg.cyan}2.${colors.reset} Replace Latest Release Assets`);
    console.log(`${colors.fg.cyan}3.${colors.reset} Back to Main Menu\n`);

    const choice = await ask(`Select release option (1-3): `);
    if (choice === '1') await runGitHubRelease('draft');
    else if (choice === '2') await runGitHubRelease('replace');
    else if (choice === '3') return;
    else log.error('Invalid choice.');
}

const menuOptions = [
    { label: 'Build Packages', action: showBuildSubMenu },
    { label: 'Git Push Everything', action: () => runGitUpload() },
    { label: 'GitHub Release', action: showReleaseSubMenu },
    {
        label: 'Full CI Workflow (Patch Version, Build All, Git Push, Release)', action: async () => {
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
const args = process.argv.slice(2);
if (args.includes('--win')) {
    runBuildProcess([platforms[0]]).catch(err => { log.error(err); process.exit(1); });
} else if (args.includes('--wsl')) {
    runBuildProcess([platforms[1], platforms[2]]).catch(err => { log.error(err); process.exit(1); });
} else if (args.includes('--all')) {
    runBuildProcess(platforms).catch(err => { log.error(err); process.exit(1); });
} else {
    showMenu().catch(err => {
        log.error(`Process fatal error: ${err.message}`);
        process.exit(1);
    });
}
