import { configService } from './services/ConfigService';
import { logger } from './services/LoggerService';
import { telemetryService } from './services/TelemetryService';
import { touchPortalService } from './services/TouchPortalService';
import { stateManager } from './services/StateManager'; // Import to initialize listener
import { truckersMPService } from './services/TruckersMPService';
import path from 'path';
import fs from 'fs-extra';

import { updateService } from './services/UpdateService';
import { setupService } from './services/SetupService';

const main = async () => {
    try {
        logger.info('Starting TP_ETS2_Plugin V2...');

        // Load Configs
        // Check for Config Backup (Restore after update)
        const downloadDir = path.join(process.env.USERPROFILE || '', 'Downloads');
        const backupPath = path.join(downloadDir, 'ETS2_Dashboard-Backup');
        const configDir = path.join(process.cwd(), 'config');

        if (await fs.pathExists(backupPath)) {
            logger.info("[MAIN] Found Old Config Backup... Loading Backup...");
            try {
                await fs.copy(backupPath, configDir);
                await fs.remove(backupPath);
                logger.info("[MAIN] Config Backup Restored & Deleted.");
            } catch (e) {
                logger.error(`[MAIN] Failed to restore backup: ${e}`);
            }
        }

        await configService.loadConfigs();

        // Set Log Level
        logger.level = configService.cfg.debug ? 'debug' : 'info';
        logger.info(`Log level set to: ${logger.level}`);

        // Run First Setup if needed
        await setupService.runFirstSetup();

        // Check for Updates
        updateService.checkForUpdates(); // Async, don't await to not block startup

        // Start StateManager (listeners)
        stateManager.start();

        // Start Telemetry
        await telemetryService.start();
        truckersMPService.start();

        // Connect to Touch Portal
        touchPortalService.connect();

        logger.info('Plugin initialization complete.');

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            logger.info('Shutting down...');
            telemetryService.stop();
            truckersMPService.stop();
            process.exit(0);
        });

    } catch (error) {
        logger.error(`Fatal error in main: ${error}`);
        process.exit(1);
    }
};

main();
