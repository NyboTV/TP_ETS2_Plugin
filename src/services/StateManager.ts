import { touchPortalService } from './TouchPortalService';
import { configService } from './ConfigService';
import { logger } from './LoggerService';
import { mapTruckStates } from '../mappers/TruckMapper';
import { mapGameStates } from '../mappers/GameMapper';
import { mapNavigationStates } from '../mappers/NavigationMapper';
import { mapDriverStates } from '../mappers/DriverMapper';
import { mapWorldStates } from '../mappers/WorldMapper';
import { mapTrailerStates } from '../mappers/TrailerMapper';
import { mapJobStates } from '../mappers/JobMapper';
import { mapGaugeStates } from '../mappers/GaugeMapper';
import { mapSettingsStates } from '../mappers/SettingsMapper';
import { mapEventStates } from '../mappers/EventMapper';

export class StateManager {
    private cache: Record<string, string> = {};
    private isUpdating: boolean = false;

    constructor() {
    }

    public start() {
        logger.debug('StateManager ready.');

        // Listen for setting changes and push them immediately to TP
        configService.on('userConfigChanged', () => {
            logger.debug('[StateManager] Settings changed, pushing updates...');
            this.pushSettings();
        });

        // Initial push
        this.pushSettings();
    }

    private pushSettings() {
        try {
            const updates = mapSettingsStates();
            touchPortalService.updateStates(updates);
        } catch (error) {
            logger.error(`Error pushing setting states: ${error}`);
        }
    }

    public async update(data: any) {
        if (this.isUpdating) {
            logger.debug('[StateManager] Update already in progress, skipping...');
            return;
        }

        this.isUpdating = true;

        // Snapshot data to prevent inconsistencies due to the library's 60Hz internal loop
        // We use a safe clone that handles BigInt if necessary.
        const snapshot = this.clone(data);

        try {
            const updates: { id: string, value: string }[] = [];

            // Run mappers with the consistent snapshot
            updates.push(...mapTruckStates(snapshot));
            updates.push(...mapGameStates(snapshot));
            const navUpdates = await mapNavigationStates(snapshot);
            updates.push(...navUpdates);

            updates.push(...mapDriverStates(snapshot));
            updates.push(...mapWorldStates(snapshot));
            updates.push(...mapTrailerStates(snapshot));
            updates.push(...mapJobStates(snapshot));
            updates.push(...mapEventStates(snapshot));
            updates.push(...await mapGaugeStates(snapshot));
            updates.push(...mapSettingsStates());

            // Diff against cache
            const changedUpdates: { id: string, value: string }[] = [];

            for (const u of updates) {
                const cached = this.cache[u.id];
                if (cached !== u.value) {
                    this.cache[u.id] = u.value;
                    changedUpdates.push(u);
                }
            }

            if (changedUpdates.length > 0) {
                // Send to TP
                touchPortalService.updateStates(changedUpdates);
                // logger.debug(`Sent ${changedUpdates.length} updates`);
            }

        } catch (error) {
            logger.error(`Error in StateManager update: ${error}`);
        } finally {
            this.isUpdating = false;
        }
    }

    private clone(obj: any): any {
        if (obj === null || typeof obj !== 'object') return obj;
        if (typeof obj === 'bigint') return obj;

        if (Array.isArray(obj)) {
            return obj.map(item => this.clone(item));
        }

        const copy: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = this.clone(obj[key]);
            }
        }
        return copy;
    }
}

export const stateManager = new StateManager();
