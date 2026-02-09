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
        // Data is an array of settings objects (from V1 analysis)
        // V1 accessed: data[0].Refresh_Interval, data[1].Currency, etc.
        // BUT `touchportal-api` might return an array of {name, value} or a mapped object depending on version.
        // V1 used `touchportal-api` directly.
        // Let's assume the data structure is a list of settings. 
        // Actually, usually `check-internet-connected` etc were used in V1.
        // Let's iterate or find by name to be safe.

        // V1 Logic:
        // data[0].Refresh_Interval
        // data[1].Currency
        // ...
        // This relies on order. Safer to find by key if possible, but let's stick to V1 parity if TP sends fixed order.
        // However, standard TP API sends array of { "Name": "...", "Value": "..." }.

        // Let's try to parse flexibly.
        const settings = data.reduce((acc: any, item: any) => {
            // If item has keys "Name" and "Value", map them.
            // Or if it's already a dictionary.
            // V1 Code: `data[0].Refresh_Interval`. This implies data is an array of objects, each having ONE key?
            // Or `data` is the array of settings values directly.

            // Let's look at V1: `data[0].Refresh_Interval`. 
            // This suggests: [ { "Refresh_Interval": "200" }, { "Currency": "EUR" }, ... ]
            // We will loop and merge.
            Object.keys(item).forEach(key => {
                acc[key] = item[key];
            });
            return acc;
        }, {});

        if (settings.Refresh_Interval) configService.updateCfg('refreshInterval', Number(settings.Refresh_Interval));
        if (settings.TruckersMP_Server) configService.updateCfg('TruckersMPServer', Number(settings.TruckersMP_Server));

        if (settings.AutoUpdate) configService.updateCfg('UpdateCheck', settings.AutoUpdate.toLowerCase() === 'true');
        if (settings.OfflineMode) configService.updateCfg('OfflineMode', settings.OfflineMode.toLowerCase() === 'true');

        if (settings.Currency) configService.updateUserCfg('Basics', 'currency', settings.Currency);
        if (settings.PreRelease) configService.updateUserCfg('PreRelease', 'PreRelease', settings.PreRelease.toLowerCase() === 'true'); // ConfigService UserCfg structure is flat for PreRelease? No, UserCfgSchema has PreRelease at root.

        // Fix for PreRelease accessing root of UserCfg
        // ConfigService.updateUserCfg params: (section, key, value)
        // My definition: updateUserCfg(section: keyof UserCfgType, key: string, value: any)
        // If section is 'Basics' -> _userCfg.Basics[key] = value.
        // If section is 'PreRelease' -> _userCfg.PreRelease = value. (logic in ConfigService:125)

        if (settings.PreRelease) {
            // We need to pass 'PreRelease' as section, and key is ignored/dummy?
            // Checking ConfigService.ts:125 -> (this._userCfg as any)[section] = value;
            // Yes.
            configService.updateUserCfg('PreRelease', '', settings.PreRelease.toLowerCase() === 'true');
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
