import fs from 'fs-extra';
import path from 'path';
import { z } from 'zod';
import { EventEmitter } from 'events';
import { logger } from './LoggerService';

const CONFIG_DIR = path.join(process.cwd(), 'config');
const CFG_PATH = path.join(CONFIG_DIR, 'cfg.json');
const USER_CFG_PATH = path.join(CONFIG_DIR, 'usercfg.json');

// --- Schemas ---

const CfgSchema = z.object({
    refreshInterval: z.number().min(10).default(50),
    TruckersMPServer: z.number().default(1),
    UpdateCheck: z.boolean().default(true),
    OfflineMode: z.boolean().default(false),
    firstInstall: z.boolean().default(false),
    debug: z.boolean().default(false),
    version: z.string().optional(),
    previewPage: z.string().optional()
});

const UserCfgSchema = z.object({
    Basics: z.object({
        unit: z.enum(['Kilometer', 'Miles']).default('Kilometer'),
        fluid: z.number().min(0).max(2).default(0), // 0: Liter, 1: US Gallon, 2: UK Gallon
        fluidCon: z.number().min(0).max(2).default(0),
        weight: z.number().min(0).max(3).default(0), // 0: kg, 1: tons...
        temp: z.enum(['Celsius', 'Fahrenheit']).default('Celsius'),
        timeFormat: z.enum(['EU', 'US']).default('EU'),
        currency: z.string().default('EUR')
    }),
    Modules: z.object({
        driverStates: z.boolean().default(true),
        gameStates: z.boolean().default(true),
        gaugeStates: z.boolean().default(true),
        jobStates: z.boolean().default(true),
        navigationStates: z.boolean().default(true),
        trailerStates: z.boolean().default(true),
        truckStates: z.boolean().default(true),
        worldStates: z.boolean().default(true)
    }),
    PreRelease: z.boolean().default(false),
    truckersmpStates: z.boolean().default(true)
});

const GaugeDesignSchema = z.object({
    backgroundColor: z.string().default('#1a1a1a'),
    borderColor: z.string().default('#333'),
    tickColor: z.string().default('#fff'),
    textColor: z.string().default('#eee'),
    titleColor: z.string().default('#aaa'),
    unitColor: z.string().default('#888'),
    needleColor: z.string().default('#ff3333'),
    redZoneColor: z.string().default('#cc0000'),
    fontFamily: z.string().default('Arial'),
    shape: z.enum(['circle', 'square']).default('circle'),
    backgroundPattern: z.enum(['none', 'grid', 'carbon']).default('none'),
    needleShape: z.enum(['classic', 'sport']).default('classic'),
    showNumber: z.boolean().default(true),
    showLabel: z.boolean().default(true),
    showUnit: z.boolean().default(true),
    // Accessibility
    titleFontScale: z.number().default(1.0),
    unitFontScale: z.number().default(1.0),
    numberFontScale: z.number().default(1.0),
    tickWidthMajor: z.number().default(3),
    tickWidthMinor: z.number().default(1),
    needleWidthScale: z.number().default(1.0),
    scaleFontScale: z.number().default(1.0)
});

const DesignSchema = z.object({
    speed: GaugeDesignSchema.default({}),
    rpm: GaugeDesignSchema.default({}),
    fuel: GaugeDesignSchema.default({}),
    air: GaugeDesignSchema.default({}),
    water: GaugeDesignSchema.default({}),
    oilTemp: GaugeDesignSchema.default({}),
    oilPressure: GaugeDesignSchema.default({}),
    battery: GaugeDesignSchema.default({}),
    adblue: GaugeDesignSchema.default({}),
    pedals: GaugeDesignSchema.default({})
});

export type CfgType = z.infer<typeof CfgSchema>;
export type UserCfgType = z.infer<typeof UserCfgSchema>;
export type DesignCfgType = z.infer<typeof DesignSchema>;

const DESIGN_CFG_PATH = path.join(CONFIG_DIR, 'designs.json');

class ConfigService extends EventEmitter {
    private _cfg: CfgType;
    private _userCfg: UserCfgType;
    private _designCfg: DesignCfgType;
    private saveTimeout: NodeJS.Timeout | null = null;

    constructor() {
        super();
        this._cfg = CfgSchema.parse({});
        this._userCfg = UserCfgSchema.parse({ Basics: {}, Modules: {} });
        this._designCfg = DesignSchema.parse({
            speed: {}, rpm: {}, fuel: {},
            air: {}, water: {}, oilTemp: {}, oilPressure: {},
            battery: {}, adblue: {}, pedals: {}
        });
    }

    public async loadConfigs() {
        try {
            await fs.ensureDir(CONFIG_DIR);

            // cfg.json
            if (await fs.pathExists(CFG_PATH)) {
                const raw = await fs.readJSON(CFG_PATH);
                const result = CfgSchema.safeParse(raw);
                if (result.success) this._cfg = result.data;
                else logger.error(`Invalid cfg.json: ${result.error.message}`);
            } else {
                await this.saveCfg();
            }

            // usercfg.json
            if (await fs.pathExists(USER_CFG_PATH)) {
                const raw = await fs.readJSON(USER_CFG_PATH);
                const result = UserCfgSchema.safeParse(raw);
                if (result.success) this._userCfg = result.data;
                else logger.error(`Invalid usercfg.json: ${result.error.message}`);
            } else {
                await this.saveUserCfg();
            }

            // designs.json
            if (await fs.pathExists(DESIGN_CFG_PATH)) {
                const raw = await fs.readJSON(DESIGN_CFG_PATH);
                const result = DesignSchema.safeParse(raw);
                if (result.success) this._designCfg = result.data;
                else logger.error(`Invalid designs.json: ${result.error.message}`);
            } else {
                await this.saveDesignCfg();
            }

            logger.info('Configs loaded successfully');

            // Setup 5-second reload for designs.json
            setInterval(() => this.reloadDesignConfig(), 5000);

        } catch (error) {
            logger.error(`Error loading configs: ${error}`);
        }
    }

    private async reloadDesignConfig() {
        try {
            if (await fs.pathExists(DESIGN_CFG_PATH)) {
                const raw = await fs.readJSON(DESIGN_CFG_PATH);
                const result = DesignSchema.safeParse(raw);
                if (result.success) {
                    // Check if anything actually changed before updating (optional but cleaner)
                    const newStr = JSON.stringify(result.data);
                    const oldStr = JSON.stringify(this._designCfg);
                    if (newStr !== oldStr) {
                        this._designCfg = result.data;
                        logger.info('[ConfigService] Designs reloaded (Changes detected in designs.json)');
                    }
                }
            }
        } catch (e) {
            // Ignore reload errors during development/editing
        }
    }

    public get cfg() { return this._cfg; }
    public get userCfg() { return this._userCfg; }
    public get designCfg() { return this._designCfg; }

    private async debouncedSave() {
        if (this.saveTimeout) clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(async () => {
            await this.saveAll();
            this.saveTimeout = null;
        }, 100); // Wait 100ms for more changes
    }

    private async saveAll() {
        try {
            await Promise.all([
                fs.writeJSON(CFG_PATH, this._cfg, { spaces: 2 }),
                fs.writeJSON(USER_CFG_PATH, this._userCfg, { spaces: 2 }),
                fs.writeJSON(DESIGN_CFG_PATH, this._designCfg, { spaces: 2 })
            ]);
            logger.debug('[ConfigService] All configs saved to disk');
        } catch (e) {
            logger.error(`Failed to save configs: ${e}`);
        }
    }

    public async saveCfg() {
        this.debouncedSave();
    }

    public async saveUserCfg() {
        this.debouncedSave();
    }

    public async saveDesignCfg() {
        this.debouncedSave();
    }

    public updateCfg(key: keyof CfgType, value: any) {
        if ((this._cfg as any)[key] === value) return; // No change
        (this._cfg as any)[key] = value;
        this.saveCfg();
        this.emit('configChanged', { key, value });
    }

    public updateUserCfg(section: keyof UserCfgType, key: string, value: any) {
        if (section === 'Basics' || section === 'Modules') {
            (this._userCfg[section] as any)[key] = value;
        } else {
            (this._userCfg as any)[section] = value;
        }
        this.saveUserCfg();
        this.emit('userConfigChanged', { section, key, value });
    }
}

export const configService = new ConfigService();
