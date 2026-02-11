import { Client } from 'touchportal-api';
import { logger } from './LoggerService';
import { configService } from './ConfigService';

const PLUGIN_ID = 'TP_ETS2_Plugin';

class TouchPortalService {
    private client: any;
    private connected: boolean = false;

    constructor() {
        this.client = new Client();
        this.setupListeners();
    }

    private setupListeners() {
        this.client.on('Info', (data: any) => {
            this.connected = true;
            logger.info('[TouchPortal] Connected to Touch Portal!');
        });

        this.client.on('Settings', (data: any) => {
            logger.info('[TouchPortal] Settings received');
            this.handleSettings(data);
        });

        this.client.on('Action', (data: any) => {
            logger.info(`[TouchPortal] Action received: ${data.actionId}`);
            this.handleAction(data);
        });

        this.client.on('Close', () => {
            this.connected = false;
            logger.warn('[TouchPortal] Disconnected from Touch Portal');
        });

        this.client.on('error', (err: any) => {
            logger.error(`[TouchPortal] Error: ${err}`);
        });
    }

    private handleSettings(data: any) {
        logger.info(`[TouchPortal] Processing settings update...`);
        if (!data) {
            logger.warn(`[TouchPortal] Received empty/null settings data`);
            return;
        }
        logger.info(`[TouchPortal] Raw data: ${JSON.stringify(data)}`);

        const settings = data.reduce((acc: any, item: any) => {
            // Standard TP API: [{ "Name": "Refresh_Interval", "Value": "200" }, ...]
            if (item.Name && item.Value !== undefined) {
                acc[item.Name] = item.Value;
            } else {
                // Fallback for [{ "Refresh_Interval": "200" }] format
                Object.keys(item).forEach(key => {
                    acc[key] = item[key];
                });
            }
            return acc;
        }, {});

        logger.debug(`[TouchPortal] Mapped settings: ${JSON.stringify(settings)}`);

        if (settings.Refresh_Interval !== undefined) {
            const val = Number(settings.Refresh_Interval);
            if (!isNaN(val)) {
                logger.info(`[TouchPortal] Setting Sync: Refresh_Interval -> ${val}ms`);
                configService.updateCfg('refreshInterval', val);
            }
        }

        if (settings.TruckersMP_Server !== undefined) {
            const val = Number(settings.TruckersMP_Server);
            if (!isNaN(val)) {
                logger.info(`[TouchPortal] Setting Sync: TruckersMP_Server -> ${val}`);
                configService.updateCfg('TruckersMPServer', val);
            }
        }

        if (settings.AutoUpdate !== undefined) {
            const val = settings.AutoUpdate.toString().toLowerCase() === 'true';
            logger.info(`[TouchPortal] Setting Sync: AutoUpdate -> ${val}`);
            configService.updateCfg('UpdateCheck', val);
        }

        if (settings.OfflineMode !== undefined) {
            const val = settings.OfflineMode.toString().toLowerCase() === 'true';
            logger.info(`[TouchPortal] Setting Sync: OfflineMode -> ${val}`);
            configService.updateCfg('OfflineMode', val);
        }

        if (settings.Currency) {
            logger.info(`[TouchPortal] Setting Sync: Currency -> ${settings.Currency}`);
            configService.updateUserCfg('Basics', 'currency', settings.Currency);
        }

        if (settings.PreRelease !== undefined) {
            const val = settings.PreRelease.toString().toLowerCase() === 'true';
            logger.info(`[TouchPortal] Setting Sync: PreRelease -> ${val}`);
            configService.updateUserCfg('PreRelease', '', val);
        }

        const valPreview = settings['Preview Download (Direct .tpz2 file)'];
        if (valPreview !== undefined) {
            logger.info(`[TouchPortal] Setting Sync: previewPage -> ${valPreview}`);
            configService.updateCfg('previewPage', valPreview);
        }
    }

    private handleAction(data: any) {
        const basics = configService.userCfg.Basics;

        switch (data.actionId) {
            case 'setting_speed':
                const newUnit = basics.unit === 'Kilometer' ? 'Miles' : 'Kilometer';
                configService.updateUserCfg('Basics', 'unit', newUnit);
                break;

            case 'setting_fluid':
                // 0: Liter, 1: US, 2: UK
                let newFluid = (basics.fluid + 1) % 3;
                configService.updateUserCfg('Basics', 'fluid', newFluid);
                break;

            case 'setting_fluidCon':
                let newFluidCon = (basics.fluidCon + 1) % 3;
                configService.updateUserCfg('Basics', 'fluidCon', newFluidCon);
                break;

            case 'setting_weight':
                // 0: kg, 1: tons, 2: us pounds, 3: uk pounds (V1: 0,1,2,3)
                // V1 logic: 0->1, 1->2, 2->3, 3->0
                let newWeight = (basics.weight + 1) % 4;
                configService.updateUserCfg('Basics', 'weight', newWeight);
                break;

            case 'setting_temp':
                const newTemp = basics.temp === 'Celsius' ? 'Fahrenheit' : 'Celsius';
                configService.updateUserCfg('Basics', 'temp', newTemp);
                break;

            case 'setting_time':
                const newTime = basics.timeFormat === 'EU' ? 'US' : 'EU';
                configService.updateUserCfg('Basics', 'timeFormat', newTime);
                break;
        }
    }

    public connect() {
        this.client.connect({ pluginId: PLUGIN_ID });
    }

    public updateStates(updates: { id: string, value: string }[]) {
        if (!this.connected) return;
        if (updates.length === 0) return;

        this.client.stateUpdateMany(updates);
    }
}

export const touchPortalService = new TouchPortalService();
