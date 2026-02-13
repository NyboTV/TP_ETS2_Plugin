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
        if (this.isUpdating) return;
        this.isUpdating = true;

        try {
            // Snapshot only necessary top-level objects to avoid deep recursion
            // For trucksim-telemetry, we mostly need the current state.
            const snapshot = {
                ...data,
                truck: data.truck ? { ...data.truck } : {},
                trailer: data.trailer ? [...data.trailer] : [],
                job: data.job ? { ...data.job } : {},
                navigation: data.navigation ? { ...data.navigation } : {},
            };

            const updates: { id: string, value: string }[] = [];

            // Run mappers in parallel where possible (some are async)
            const [
                truck, game, nav, driver, world, trailer, job, events, gauges
            ] = await Promise.all([
                mapTruckStates(snapshot),
                mapGameStates(snapshot),
                mapNavigationStates(snapshot),
                mapDriverStates(snapshot),
                mapWorldStates(snapshot),
                mapTrailerStates(snapshot),
                mapJobStates(snapshot),
                mapEventStates(snapshot),
                mapGaugeStates(snapshot)
            ]);

            updates.push(...truck, ...game, ...nav, ...driver, ...world, ...trailer, ...job, ...events, ...gauges, ...mapSettingsStates());

            // Diff against cache
            const changedUpdates: { id: string, value: string }[] = changedUpdatesOnly(updates, this.cache);

            if (changedUpdates.length > 0) {
                touchPortalService.updateStates(changedUpdates);
            }

        } catch (error) {
            logger.error(`Error in StateManager update: ${error}`);
        } finally {
            this.isUpdating = false;
        }
    }
}

// Helper to avoid redundant cache checks and property access
const changedUpdatesOnly = (updates: any[], cache: Record<string, string>) => {
    const changed: any[] = [];
    for (let i = 0; i < updates.length; i++) {
        const u = updates[i];
        if (cache[u.id] !== u.value) {
            cache[u.id] = u.value;
            changed.push(u);
        }
    }
    return changed;
};

export const stateManager = new StateManager();
