import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { logger } from './LoggerService';
import { configService } from './ConfigService';
import { spawn } from 'child_process';
import { dialogService } from './DialogService';
import semver from 'semver';

// Fetch the package.json from the master branch directly to avoid GitHub API Rate Limits
const UPDATE_URL = 'https://raw.githubusercontent.com/NyboTV/TP_ETS2_Plugin/master/package.json';
// GitHub always points this URL to the latest Release asset
const DOWNLOAD_URL = 'https://github.com/NyboTV/TP_ETS2_Plugin/releases/latest/download/ETS2_Dashboard.tpp';
const DOWNLOAD_DIR = path.join(os.homedir(), 'Downloads');

class UpdateService {

    private getPackageVersion(): string {
        try {
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
        if (!configService.cfg.UpdateCheck || configService.cfg.OfflineMode) {
            logger.info('[UpdateService] Update check disabled by settings.');
            return;
        }

        logger.info('[UpdateService] Checking for updates via raw GitHub package.json...');

        try {
            const response = await axios.get(UPDATE_URL);
            if (!response.data || !response.data.version) {
                logger.warn('[UpdateService] Could not parse version from remote config.');
                return;
            }

            const latestVersion = response.data.version;
            const currentVersion = configService.cfg.version || this.getPackageVersion();

            logger.info(`[UpdateService] Current version: ${currentVersion} | Latest version: ${latestVersion}`);

            // Ensure versions are semver valid before comparing
            const validLatest = semver.valid(semver.coerce(latestVersion));
            const validCurrent = semver.valid(semver.coerce(currentVersion));

            if (!validLatest || !validCurrent) {
                logger.error('[UpdateService] Invalid version format detected, aborting update check.');
                return;
            }

            const isPreRelease = semver.prerelease(latestVersion) !== null;
            if (isPreRelease && !configService.userCfg.PreRelease) {
                logger.info('[UpdateService] Newest version is a pre-release and not allowed in user settings.');
                return;
            }

            if (semver.gt(validLatest, validCurrent)) {
                logger.info(`[UpdateService] New version found: ${latestVersion}`);

                const updateRes = await dialogService.show(
                    `We found a new Update! Version: ${latestVersion}\n\nDo you want to download and install it now?`,
                    "ETS2 Dashboard Update",
                    'YesNo',
                    'Question'
                );

                if (updateRes === 'Yes') {
                    await dialogService.show(
                        "The update will download shortly. If Touch Portal does not automatically prompt the import screen, please run the .tpp file from your Downloads folder manually.",
                        "ETS2 Dashboard Update",
                        'OK',
                        'Information'
                    );

                    await this.downloadAndInstall(DOWNLOAD_URL, latestVersion);
                }
            } else {
                logger.info('[UpdateService] Up to date.');
            }

        } catch (error) {
            logger.error(`[UpdateService] Error fetching update info: ${error}`);
        }
    }

    private async downloadAndInstall(url: string, version: string) {
        try {
            logger.info(`[UpdateService] Downloading update file for ${version}...`);
            const dest = path.join(DOWNLOAD_DIR, 'ETS2_Dashboard.tpp');

            await this.backupConfig(version);

            const response = await axios({
                url,
                method: 'GET',
                responseType: 'stream'
            });

            const totalLength = response.headers['content-length'];
            let downloadedProgress = 0;
            let lastLogStep = 0;

            response.data.on('data', (chunk: any) => {
                downloadedProgress += chunk.length;
                if (totalLength) {
                    const progress = Math.round((downloadedProgress / totalLength) * 100);
                    // Log progress at 25%, 50%, 75% thresholds
                    if (progress >= lastLogStep + 25) {
                        lastLogStep = progress;
                        logger.debug(`[UpdateService] Download progress: ${progress}%`);
                    }
                }
            });

            const writer = fs.createWriteStream(dest);
            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', async () => {
                    logger.info('[UpdateService] Download finished successfully.');

                    // Wait a moment to ensure file handles are released
                    await new Promise(r => setTimeout(r, 1500));

                    this.install(dest);
                    resolve(true);
                });
                writer.on('error', (err) => {
                    logger.error(`[UpdateService] File write error: ${err}`);
                    reject(err);
                });
            });

        } catch (error) {
            logger.error(`[UpdateService] Download Failed: ${error}`);
        }
    }

    private async backupConfig(newVersion: string) {
        try {
            // Keep backup inside the plugin directory instead of the user's personal Downloads folder
            const backupDir = path.join(process.cwd(), 'backups', 'config_backup');
            await fs.ensureDir(backupDir);
            await fs.emptyDir(backupDir);

            logger.debug(`[UpdateService] Creating settings backup at ${backupDir}`);
            await fs.copy(path.join(process.cwd(), 'config'), backupDir);

            const cfgPath = path.join(backupDir, 'cfg.json');
            if (await fs.pathExists(cfgPath)) {
                const cfg = await fs.readJSON(cfgPath);
                cfg.version = newVersion;
                await fs.writeJSON(cfgPath, cfg, { spaces: 2 });
            }
            logger.info('[UpdateService] Configuration backup completed.');
        } catch (e) {
            logger.error(`[UpdateService] Backup failed: ${e}`);
        }
    }

    private install(filePath: string) {
        let cmd = 'start "" ';
        if (process.platform === 'darwin') cmd = 'open ';
        else if (process.platform === 'linux') cmd = 'xdg-open ';

        logger.info(`[UpdateService] Executing ${filePath} to import into Touch Portal...`);
        spawn(`${cmd}"${filePath}"`, { shell: true, detached: true }).unref();

        logger.info('[UpdateService] Exiting plugin for update process...');
        process.exit(0);
    }
}

export const updateService = new UpdateService();
