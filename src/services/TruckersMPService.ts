import axios from 'axios';
import { logger } from './LoggerService';
import { configService } from './ConfigService';
import { touchPortalService } from './TouchPortalService';

class TruckersMPService {
    private intervalId: NodeJS.Timeout | null = null;

    public start() {
        if (this.intervalId) return;

        // Poll every minute? V1 was refreshInterval * 200.
        // Let's settle on 60s for external API.
        this.intervalId = setInterval(() => this.poll(), 60000);
        this.poll(); // initial
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private async poll() {
        try {
            // Check if enabled? V1 logic checked usercfg modules.truckersmpStates
            // Assuming enabled for proper migration.

            const serverId = configService.cfg.TruckersMPServer || 0;

            const response = await axios.get('https://api.truckersmp.com/v2/servers');
            const data = response.data;

            if (data && data.response) {
                const servers = data.response;
                const server = servers[serverId];

                const updates = [
                    { id: 'Nybo.ETS2.TruckersMP.Servers', value: servers.length.toString() },
                    { id: 'Nybo.ETS2.TruckersMP.ServerName', value: server ? server.shortname : 'Unknown' },
                    { id: 'Nybo.ETS2.TruckersMP.ServerPlayers', value: server ? server.players.toString() : '0' },
                    { id: 'Nybo.ETS2.TruckersMP.ServerPlayerQueue', value: server ? server.queue.toString() : '0' },
                    { id: 'Nybo.ETS2.TruckersMP.APIOnline', value: 'true' }
                ];

                touchPortalService.updateStates(updates);
            }

        } catch (error) {
            logger.error(`TruckersMP API Error: ${error}`);
            touchPortalService.updateStates([
                { id: 'Nybo.ETS2.TruckersMP.APIOnline', value: 'false' },
                { id: 'Nybo.ETS2.TruckersMP.Servers', value: 'Error' }
            ]);
        }
    }
}

export const truckersMPService = new TruckersMPService();
