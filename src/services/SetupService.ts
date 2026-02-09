import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';
import axios from 'axios';
import { logger } from './LoggerService';
import { configService } from './ConfigService';
import { spawn, exec } from 'child_process';
import { dialogService } from './DialogService';

// V1 URL: "https://github.com/NyboTV/TP_ETS2_Plugin/raw/master/src/build/defaultPage/" + download_File
// We should probably check if these assets still exist or use updated ones.
const DEFAULT_PAGE_BASE_URL = 'https://github.com/NyboTV/TP_ETS2_Plugin/raw/master/src/build/defaultPage/';

class SetupService {

    public async runFirstSetup() {
        if (!configService.cfg.firstInstall) return;

        logger.info('[SetupService] Starting First Setup...');

        try {
            // Welcome
            await dialogService.show(
                "Welcome to the TP ETS2 Plugin V2 Setup!\nWe will guide you through the installation.",
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
                const unit = await dialogService.showSelectionDialog(
                    "Choose Units",
                    "Select your preferred units for the default page:",
                    ["KMH (Kilometers)", "MPH (Miles)"],
                    0
                );

                if (unit && unit !== 'Cancel') {
                    // Save unit preference
                    const isMiles = unit.includes("MPH");
                    configService.updateUserCfg('Basics', 'unit', isMiles ? 'Miles' : 'Kilometer');

                    await this.installPages(isMiles);
                }
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

            // Target: bin/win_x64/plugins/scs-telemetry.dll
            // Note: V2 is currently running on Windows (based on fs usage). 
            // If cross-platform, we need logic to detect OS or ask user. 
            // For now assuming Windows context as per previous impl.
            const pluginsDir = path.join(gamePath, 'bin', 'win_x64', 'plugins');
            await fs.ensureDir(pluginsDir);

            // Source: ./bin/scs-sdk-plugin/windows/scs-telemetry.dll
            // We moved it to V2/bin/scs-sdk-plugin/windows/scs-telemetry.dll
            const sourceDll = path.join(process.cwd(), 'bin', 'scs-sdk-plugin', 'windows', 'scs-telemetry.dll');

            if (await fs.pathExists(sourceDll)) {
                const destDll = path.join(pluginsDir, 'scs-telemetry.dll');
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

    private async installPages(isMiles: boolean) {
        try {
            const zipFileName = isMiles ? 'ETS2_Dashboard_MPH.zip' : 'ETS2_Dashboard_KMH.zip';
            const downloadUrl = `https://github.com/NyboTV/TP_ETS2_Plugin/releases/latest/download/${zipFileName}`;
            const zipPath = path.join(process.env.USERPROFILE || '', 'Downloads', zipFileName);

            // Using axios to download
            const writer = fs.createWriteStream(zipPath);

            const response = await axios({
                url: downloadUrl,
                method: 'GET',
                responseType: 'stream'
            });

            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(true));
                writer.on('error', (e) => reject(e));
            });

            // Extract
            const zip = new AdmZip(zipPath);

            // Extract to temp
            const extractPath = path.join(process.env.USERPROFILE || '', 'Downloads', 'ETS2_Pages_Temp');
            zip.extractAllTo(extractPath, true);

            // Find .tpz files and execute them
            const files = await fs.readdir(extractPath);
            const tpzFiles = files.filter(f => f.endsWith('.tpz'));

            for (const tpz of tpzFiles) {
                const fullPath = path.join(extractPath, tpz);
                exec(`"${fullPath}"`); // Open with default app (Touch Portal)
            }

            // Clean up
            // fs.remove(extractPath); // fast cleanup might lock files being opened

        } catch (e) {
            logger.error(`Failed to install Pages: ${e}`);
            await dialogService.show(`Failed to download/install pages: ${e}`, "Error");
        }
    }
}

export const setupService = new SetupService();
