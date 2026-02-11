import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import AdmZip from 'adm-zip';
import axios from 'axios';
import { logger } from './LoggerService';
import { configService } from './ConfigService';
import { spawn, exec } from 'child_process';
import { dialogService } from './DialogService';

class SetupService {

    public async runFirstSetup() {
        if (!configService.cfg.firstInstall) return;

        logger.info('[SetupService] Starting First Setup...');

        try {
            // Welcome
            await dialogService.show(
                "Welcome to the TP ETS2 Plugin Setup!\nWe will guide you through the installation.",
                "ETS2 Plugin Setup",
                "OK",
                "Information"
            );

            // 1. Install SCS SDK Plugin
            const installRes = await dialogService.show(
                "Do you want to install the Telemetry Plugin (scs-sdk-plugin) now?\n(Required if not already installed)",
                "Telemetry Plugin",
                "YesNo",
                "Question"
            );

            if (installRes === 'Yes') {
                await this.installScsPlugin();
            }

            // 2. Install TouchPortal Pages
            const pageRes = await dialogService.show(
                "Do you want to install the default TouchPortal Pages?",
                "TouchPortal Pages",
                "YesNo",
                "Question"
            );

            if (pageRes === 'Yes') {
                await this.installPages();
            }

            // Finish
            await dialogService.show(
                "Setup Complete!\nPlease restart Touch Portal to load the new pages and plugin updates.",
                "Setup Finished",
                "OK",
                "Information"
            );

            // Mark as installed
            configService.updateCfg('firstInstall', false);

        } catch (error) {
            logger.error(`Setup failed: ${error}`);
            await dialogService.show(`Setup failed: ${error}`, "Error", "OK", "Error");
        }
    }

    private async installScsPlugin() {
        try {
            let gamePath: string | null = null;

            // Try Auto-Detect
            const detectedPath = await this.detectGamePath();
            if (detectedPath) {
                const res = await dialogService.show(
                    `We found a game installation at:\n${detectedPath}\n\nDo you want to use this path?`,
                    "Game Detected",
                    "YesNo",
                    "Question"
                );
                if (res === 'Yes') {
                    gamePath = detectedPath;
                }
            }

            // Fallback to manual
            if (!gamePath) {
                gamePath = await dialogService.selectFolder("Select your ETS2 or ATS Installation Folder (e.g. steamapps/common/Euro Truck Simulator 2)");
            }

            if (!gamePath) {
                await dialogService.show("No folder selected. Skipping plugin installation.", "Warning", "OK", "Warning");
                return;
            }

            // Target: bin/[platform_arch]/plugins/scs-telemetry.dll
            let archDir = 'win_x64';
            let pluginSubFolder = 'windows';
            let pluginFile = 'scs-telemetry.dll';

            if (process.platform === 'linux') {
                archDir = 'bin/linux_x64'; // Common ETS2 Linux path structure
                pluginSubFolder = 'linux';
                pluginFile = 'scs-telemetry.so';
            }

            const pluginsDir = path.join(gamePath, 'bin', archDir, 'plugins');
            await fs.ensureDir(pluginsDir);

            // Source: ./bin/scs-sdk-plugin/[platform]/scs-telemetry.[ext]
            const sourceDll = path.join(process.cwd(), 'bin', 'scs-sdk-plugin', pluginSubFolder, pluginFile);

            if (await fs.pathExists(sourceDll)) {
                const destDll = path.join(pluginsDir, pluginFile);
                await fs.copy(sourceDll, destDll, { overwrite: true });
                logger.info(`Installed scs-telemetry.dll to ${destDll}`);
                await dialogService.show(`Plugin installed successfully to:\n${destDll}`, "Success", "OK", "Information");
            } else {
                logger.error(`Source DLL not found at ${sourceDll}`);
                await dialogService.show(`Could not find source plugin at:\n${sourceDll}\nPlease verify installation.`, "Error", "OK", "Error");
            }

        } catch (e) {
            logger.error(`Failed to install SCS Plugin: ${e}`);
            await dialogService.show(`Failed to install SCS Plugin: ${e}`, "Error", "OK", "Error");
        }
    }

    private async detectGamePath(): Promise<string | null> {
        // 1. Try to find Steam Path via Registry (Windows Only primarily)
        // If Linux/Mac, we check standard home paths.

        let steamPath: string | null = null;

        if (process.platform === 'win32') {
            try {
                // Command to read registry
                const { stdout } = await this.execPromise('reg query HKCU\\Software\\Valve\\Steam /v SteamPath');
                // Output example: "    SteamPath    REG_SZ    C:/Program Files (x86)/Steam"
                const match = stdout.match(/SteamPath\s+REG_SZ\s+(.*)/);
                if (match && match[1]) {
                    steamPath = match[1].trim();
                }
            } catch (e) {
                logger.warn(`Could not detect Steam path via registry: ${e}`);
            }
        }

        const potentialPaths: string[] = [];

        // Add standard Steam paths if registry failed or not Windows
        if (!steamPath) {
            if (process.platform === 'win32') {
                potentialPaths.push('C:\\Program Files (x86)\\Steam');
                potentialPaths.push('C:\\Program Files\\Steam');
            } else if (process.platform === 'linux') {
                potentialPaths.push(path.join(process.env.HOME || '', '.steam/steam'));
                potentialPaths.push(path.join(process.env.HOME || '', '.local/share/Steam'));
            } else if (process.platform === 'darwin') {
                potentialPaths.push(path.join(process.env.HOME || '', 'Library/Application Support/Steam'));
            }
        } else {
            potentialPaths.push(steamPath);
        }

        // Games to look for
        const games = ['Euro Truck Simulator 2', 'American Truck Simulator'];

        for (const basePath of potentialPaths) {
            // Check common library path
            // Usually: steamapps/common/GAME
            for (const game of games) {
                const p = path.join(basePath, 'steamapps', 'common', game);
                if (await fs.pathExists(p)) {
                    return p;
                }
            }

            // Start checking libraryfolders.vdf? Too complex for now.
            // Just check the main library.
        }

        return null;
    }

    private execPromise(cmd: string): Promise<{ stdout: string, stderr: string }> {
        return new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });
    }

    private async installPages() {
        try {
            let downloadUrl = configService.cfg.previewPage;
            if (!downloadUrl) {
                logger.warn('[SetupService] No previewPage URL configured in cfg.json');
                return;
            }

            // GitHub Fix: Replace /blob/ with /raw/ to get the actual file content
            if (downloadUrl.includes('github.com') && downloadUrl.includes('/blob/')) {
                downloadUrl = downloadUrl.replace('/blob/', '/raw/');
                logger.info(`[SetupService] Transformed GitHub URL to raw: ${downloadUrl}`);
            }

            // Extract filename from URL or default to ETS2_Page.tpz2
            const urlParts = downloadUrl.split('/');
            const fileName = urlParts[urlParts.length - 1] || 'ETS2_Dashboard.tpz2';
            const downloadPath = path.join(os.homedir(), 'Downloads', fileName);

            logger.info(`[SetupService] Downloading pages from ${downloadUrl}...`);

            const response = await axios({
                url: downloadUrl,
                method: 'GET',
                responseType: 'arraybuffer' // Download as buffer for validation
            });

            const data = response.data as Buffer;
            const contentSnippet = data.slice(0, 100).toString().toLowerCase();
            if (contentSnippet.includes('<!doctype html') || contentSnippet.includes('<html')) {
                throw new Error("Downloaded content appears to be an HTML page instead of a binary file. Please check the URL.");
            }

            await fs.writeFile(downloadPath, data);

            logger.info(`[SetupService] Pages downloaded to ${downloadPath}`);

            await dialogService.show(
                "The page file has been downloaded.\n\nNOTE: This is a third-party page managed by Gargamosch. For any issues related to the page design or layout, please contact him directly.\n\nTouch Portal will now open to import the pages.",
                "Importing Pages",
                "OK",
                "Information"
            );

            // Open with default app
            let cmd = 'start "" ';
            if (process.platform === 'darwin') cmd = 'open ';
            else if (process.platform === 'linux') cmd = 'xdg-open ';

            try {
                exec(`${cmd}"${downloadPath}"`);
                logger.info(`[SetupService] Executed ${downloadPath}`);
            } catch (err) {
                logger.error(`[SetupService] Failed to execute download: ${err}`);
                await dialogService.show(
                    `Could not automatically start the import.\nPlease manually import the file from your Downloads folder:\n\n${downloadPath}`,
                    "Manual Import Required",
                    "OK",
                    "Warning"
                );
            }

        } catch (e) {
            logger.error(`Failed to install Pages: ${e}`);
            await dialogService.show(`Failed to download pages: ${e}\n\nPlease try again later or install manually.`, "Error", "OK", "Error");
        }
    }
}

export const setupService = new SetupService();
