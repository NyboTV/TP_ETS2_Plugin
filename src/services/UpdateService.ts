import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { logger } from './LoggerService';
import { configService } from './ConfigService';
import { spawn } from 'child_process';

import { dialogService } from './DialogService';

const DOWNLOAD_DIR = path.join(process.env.USERPROFILE || '', 'Downloads');
const REPO_URL = 'https://api.github.com/repos/NyboTV/TP_ETS2_Plugin/releases';

class UpdateService {

    private getPackageVersion(): string {
        try {
            // In pkg, bundled assets are relative to __dirname (dist/services/...)
            const pkgPath = path.join(__dirname, '..', '..', 'package.json');
            if (fs.existsSync(pkgPath)) {
                const pkg = fs.readJSONSync(pkgPath);
                return pkg.version || '0.0.0';
            }
            return '0.0.0';
        } catch (e) {
            return '0.0.0';
        }
    }

    public async checkForUpdates() {
        if (!configService.cfg.UpdateCheck) return;

        logger.info('[UpdateService] Checking for updates...');

        try {
            const response = await axios.get(REPO_URL);
            if (!response.data || response.data.length === 0) return;

            const latestRelease = response.data[0];
            const latestVersion = latestRelease.tag_name;
            const currentVersion = configService.cfg.version || this.getPackageVersion();

            logger.info(`[UpdateService] Current version: ${currentVersion} | Latest version: ${latestVersion}`);

            // V1 Logic: Check PreRelease
            if (latestRelease.prerelease && !configService.userCfg.PreRelease) {
                logger.info('[UpdateService] Newest version is a pre-release and not allowed in settings.');
                return;
            }

            if (this.isNewerVersion(latestVersion, currentVersion)) {
                logger.info(`[UpdateService] New version found: ${latestVersion}`);

                const updateRes = await dialogService.show(
                    `We found a new Update! Version: ${latestVersion}\n\nInstall?`,
                    "ETS2 Dashboard Update",
                    'YesNo',
                    'Question'
                );

                if (updateRes === 'Yes') {
                    const asset = latestRelease.assets.find((a: any) => a.name.endsWith('.tpp'));
                    if (asset) {
                        await dialogService.show(
                            "The update will download shortly. If the import doesn't start automatically, please run the .tpp file from your Downloads folder manually.",
                            "ETS2 Dashboard Update",
                            'OK',
                            'Warning'
                        );

                        await this.downloadAndInstall(asset.browser_download_url, latestVersion);
                    }
                }
            } else {
                logger.info('[UpdateService] Up to date.');
            }

        } catch (error) {
            logger.error(`[UpdateService] Error: ${error}`);
        }
    }

    private isNewerVersion(newVer: string, oldVer: string): boolean {
        const parseVersion = (v: string) => v.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
        const v1 = parseVersion(newVer);
        const v2 = parseVersion(oldVer);

        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            const n1 = v1[i] || 0;
            const n2 = v2[i] || 0;
            if (n1 > n2) return true;
            if (n1 < n2) return false;
        }
        return false;
    }

    private async downloadAndInstall(url: string, version: string) {
        try {
            logger.info(`[UpdateService] Downloading ${version}...`);
            const dest = path.join(DOWNLOAD_DIR, 'ETS2_Dashboard.tpp');

            await this.backupConfig(version);

            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(dest);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', async () => {
                    logger.info('[UpdateService] Download finished.');

                    // V1 waited 1.5s then 0.2s then started install
                    await new Promise(r => setTimeout(r, 1500));

                    this.install(dest);
                    resolve(true);
                });
                writer.on('error', reject);
            });

        } catch (error) {
            logger.error(`[UpdateService] Failed: ${error}`);
        }
    }

    private async backupConfig(newVersion: string) {
        try {
            const backupDir = path.join(DOWNLOAD_DIR, 'ETS2_Dashboard-Backup'); // V1 compatible
            await fs.ensureDir(backupDir);
            await fs.emptyDir(backupDir); // Clear old backups if any
            await fs.copy(path.join(process.cwd(), 'config'), backupDir);

            const cfgPath = path.join(backupDir, 'cfg.json');
            if (await fs.pathExists(cfgPath)) {
                const cfg = await fs.readJSON(cfgPath);
                cfg.version = newVersion;
                await fs.writeJSON(cfgPath, cfg, { spaces: 2 });
            }
        } catch (e) {
            logger.error(`[UpdateService] Backup failed: ${e}`);
        }
    }

    private install(filePath: string) {
        const cmd = process.platform === 'win32' ? 'start' : 'open';
        // Executing the .tpp file
        spawn(cmd, ['', filePath], { shell: true, detached: true }).unref();

        logger.info('[UpdateService] Exiting for update...');
        // V1 used exit()
        process.exit(0);
    }
}

export const updateService = new UpdateService();
