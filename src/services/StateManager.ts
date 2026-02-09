import { touchPortalService } from './TouchPortalService';
import { logger } from './LoggerService';
import { mapTruckStates } from '../mappers/TruckMapper';
import { mapGameStates } from '../mappers/GameMapper';
import { mapNavigationStates } from '../mappers/NavigationMapper';
import { mapDriverStates } from '../mappers/DriverMapper';
import { mapWorldStates } from '../mappers/WorldMapper';
import { mapTrailerStates } from '../mappers/TrailerMapper';
import { mapJobStates } from '../mappers/JobMapper';
import { mapGaugeStates } from '../mappers/GaugeMapper';
// import { mapSettingsStates } from '../mappers/SettingsMapper'; // Assuming this exists or needed

export class StateManager {
    private cache: Record<string, string> = {};

    constructor() {
    }

    public start() {
        logger.debug('StateManager ready.');
    }

    public async update(data: any) {
        try {
            const updates: { id: string, value: string }[] = [];

            // Run mappers
            updates.push(...mapTruckStates(data));
            updates.push(...mapGameStates(data));
            const navUpdates = await mapNavigationStates(data);
            updates.push(...navUpdates);

            updates.push(...mapDriverStates(data));
            updates.push(...mapWorldStates(data));
            updates.push(...mapTrailerStates(data));
            updates.push(...await mapJobStates(data));
            updates.push(...await mapGaugeStates(data));
            // updates.push(...mapSettingsStates());

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
        }
    }
}

export const stateManager = new StateManager();
