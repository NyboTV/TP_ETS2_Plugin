import fs from 'fs-extra';
import path from 'path';
import { z } from 'zod';
import { logger } from './LoggerService';

const CONFIG_DIR = path.join(process.cwd(), 'config');
const CFG_PATH = path.join(CONFIG_DIR, 'cfg.json');
const USER_CFG_PATH = path.join(CONFIG_DIR, 'usercfg.json');

// --- Schemas ---

const CfgSchema = z.object({
    refreshInterval: z.number().min(50).default(200),
    TruckersMPServer: z.number().default(1),
    UpdateCheck: z.boolean().default(true),
    OfflineMode: z.boolean().default(false),
    firstInstall: z.boolean().default(false),
    debug: z.boolean().default(false),
    version: z.string().optional()
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

const DesignSchema = z.object({
    gauge: z.object({
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
        needleShape: z.enum(['classic', 'sport']).default('classic')
    })
});

export type CfgType = z.infer<typeof CfgSchema>;
export type UserCfgType = z.infer<typeof UserCfgSchema>;
export type DesignCfgType = z.infer<typeof DesignSchema>;

const DESIGN_CFG_PATH = path.join(CONFIG_DIR, 'designs.json');

class ConfigService {
    private _cfg: CfgType;
    private _userCfg: UserCfgType;
    private _designCfg: DesignCfgType;

    constructor() {
        this._cfg = CfgSchema.parse({});
        this._userCfg = UserCfgSchema.parse({ Basics: {}, Modules: {} });
        this._designCfg = DesignSchema.parse({ gauge: {} });
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

        } catch (error) {
            logger.error(`Error loading configs: ${error}`);
        }
    }

    public get cfg() { return this._cfg; }
    public get userCfg() { return this._userCfg; }
    public get designCfg() { return this._designCfg; }

    public async saveCfg() {
        try { await fs.writeJSON(CFG_PATH, this._cfg, { spaces: 2 }); }
        catch (e) { logger.error(`Failed to save cfg.json: ${e}`); }
    }

    public async saveUserCfg() {
        try { await fs.writeJSON(USER_CFG_PATH, this._userCfg, { spaces: 2 }); }
        catch (e) { logger.error(`Failed to save usercfg.json: ${e}`); }
    }

    public async saveDesignCfg() {
        try { await fs.writeJSON(DESIGN_CFG_PATH, this._designCfg, { spaces: 2 }); }
        catch (e) { logger.error(`Failed to save designs.json: ${e}`); }
    }

    public updateCfg(key: keyof CfgType, value: any) {
        (this._cfg as any)[key] = value;
        this.saveCfg();
    }

    public updateUserCfg(section: keyof UserCfgType, key: string, value: any) {
        if (section === 'Basics' || section === 'Modules') {
            (this._userCfg[section] as any)[key] = value;
        } else {
            (this._userCfg as any)[section] = value;
        }
        this.saveUserCfg();
    }
}

export const configService = new ConfigService();
