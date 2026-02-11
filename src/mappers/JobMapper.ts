import { configService } from '../services/ConfigService';
import fs from 'fs-extra';
import path from 'path';
import { logger } from '../services/LoggerService';

// We need to load currency.json
let currencyData: any = null;
const loadCurrencyData = async () => {
    try {
        const p = path.join(process.cwd(), 'config', 'currency.json');
        if (await fs.pathExists(p)) {
            currencyData = await fs.readJson(p);
        }
    } catch (e) {
        logger.error(`Failed to load currency.json: ${e}`);
    }
};
loadCurrencyData();

export const mapJobStates = (telemetry: any) => {
    const states: { id: string, value: string }[] = [];
    if (!telemetry) return states;

    const basics = configService.userCfg.Basics;

    // 1. Basic Job Info
    states.push({ id: 'Nybo.ETS2.Job.OnJob', value: (telemetry.onJob ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Job.SpecialJob', value: (telemetry.specialJob ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Job.Market', value: telemetry.jobMarket || '-' });
    states.push({ id: 'Nybo.ETS2.Job.PlannedDistance', value: (telemetry.plannedDistanceKm || 0).toString() });

    // 2. Economics (Currency formatting could be added later if needed)
    states.push({ id: 'Nybo.ETS2.Job.JobIncome', value: String(telemetry.jobIncome || 0).replace(/\D/g, '') });

    // 3. Progress and Timing
    const deliveryTime = telemetry.timeAbsDelivery;
    const currentTime = telemetry.timeAbs;
    if (deliveryTime > 0) {
        const remainingMinutes = deliveryTime - currentTime;
        if (remainingMinutes > 0) {
            const days = Math.floor(remainingMinutes / (24 * 60));
            const hours = Math.floor((remainingMinutes % (24 * 60)) / 60);
            const mins = Math.floor(remainingMinutes % 60);
            states.push({ id: 'Nybo.ETS2.Job.JobRemainingTime', value: `${days}D, ${hours}:${mins.toString().padStart(2, '0')}` });
        } else {
            states.push({ id: 'Nybo.ETS2.Job.JobRemainingTime', value: 'Overdue' });
        }
    } else {
        states.push({ id: 'Nybo.ETS2.Job.JobRemainingTime', value: '-' });
    }

    // 4. Location Data
    states.push({ id: 'Nybo.ETS2.Job.JobSourceCity', value: telemetry.citySrc || '-' });
    states.push({ id: 'Nybo.ETS2.Job.JobSourceCompany', value: telemetry.compSrc || '-' });
    states.push({ id: 'Nybo.ETS2.Job.JobDestinationCity', value: telemetry.cityDst || '-' });
    states.push({ id: 'Nybo.ETS2.Job.JobDestinationCompany', value: telemetry.compDst || '-' });

    // 5. Cargo Details
    states.push({ id: 'Nybo.ETS2.Job.Cargo', value: telemetry.cargo || '-' });
    states.push({ id: 'Nybo.ETS2.Job.CargoID', value: telemetry.cargoId || '-' });
    states.push({ id: 'Nybo.ETS2.Job.CargoLoaded', value: (telemetry.isCargoLoaded ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Job.CargoDamage', value: `${Math.round((telemetry.cargoDamage || 0) * 100)}%` });
    states.push({ id: 'Nybo.ETS2.Job.UnitCount', value: (telemetry.unitCount || 0).toString() });

    // Mass Formatting Helper
    const formatMass = (massKg: number) => {
        const massTons = Math.round(massKg / 1000);
        let massValue = massTons;
        let unitLabel = 'Tons';
        const weightUnit = basics.weight;

        if (weightUnit === 0) { // Tons
            massValue = massTons;
            unitLabel = 'Tons';
        } else if (weightUnit === 1) { // US Tons
            massValue = Math.round(massTons * 1.102311);
            unitLabel = 'US Tons';
        } else if (weightUnit === 2) { // UK Tons
            massValue = Math.round(massTons * 0.9843065);
            unitLabel = 'UK Tons';
        } else if (weightUnit === 3) { // Pounds
            massValue = Math.round(massTons * 2204.6226);
            unitLabel = 'Pounds';
        }
        return `${massValue} ${unitLabel}`;
    };

    states.push({ id: 'Nybo.ETS2.Job.CargoMass', value: formatMass(telemetry.cargoMass || 0) });
    states.push({ id: 'Nybo.ETS2.Job.UnitMass', value: formatMass(telemetry.unitMass || 0) });

    return states;
};
