// eslint-disable-next-line @typescript-eslint/no-var-requires
const { truckSimTelemetry } = require('trucksim-telemetry');
import { stateManager } from './StateManager';
import { logger } from './LoggerService';
import { configService } from './ConfigService';

export class TelemetryService {
    private telemetry: any;
    private isConnected: boolean = false;
    private interval: NodeJS.Timeout | null = null;

    constructor() {
        try {
            this.telemetry = truckSimTelemetry();
            logger.info('Initialized trucksim-telemetry');
        } catch (e) {
            logger.error(`Failed to initialize trucksim-telemetry: ${e}`);
        }
    }

    public start() {
        if (!this.telemetry) return;

        logger.info('Starting Telemetry polling...');

        this.interval = setInterval(() => {
            const data = this.telemetry.data.current;
            if (!data) return;

            const connected = data.sdkActive && !data.paused;

            if (connected && !this.isConnected) {
                this.isConnected = true;
                logger.info('Connected to Simulator');
            } else if (!connected && this.isConnected) {
                this.isConnected = false;
                logger.info('Disconnected from Simulator');
            }

            if (data.sdkActive) {
                this.processData(data);
            }
        }, configService.cfg.refreshInterval);
    }

    private async processData(data: any) {
        try {
            await stateManager.update(data);
        } catch (error) {
            logger.error(`Error processing telemetry: ${error}`);
        }
    }

    public stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        if (this.telemetry) {
            logger.info('Stopped Telemetry polling');
        }
    }
}

export const telemetryService = new TelemetryService();
