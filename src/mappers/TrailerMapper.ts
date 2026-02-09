import { configService } from '../services/ConfigService';

export const mapTrailerStates = (telemetry: any) => {
    // trailers array
    const trailers = telemetry.trailers;
    const states: { id: string, value: string }[] = [];
    const basics = configService.userCfg.Basics;

    // Check first trailer (main one)
    const hasTrailer = trailers && trailers.length > 0 && trailers[0].attached;

    states.push({ id: 'Nybo.ETS2.Trailer.TrailerAttached', value: hasTrailer.toString() });

    if (hasTrailer) {
        const trailer = trailers[0];
        states.push({ id: 'Nybo.ETS2.Trailer.TrailerName', value: trailer.name });
        states.push({ id: 'Nybo.ETS2.Trailer.TrailerChainType', value: trailer.chainType });

        // Wear
        states.push({ id: 'Nybo.ETS2.Trailer.Wear', value: `${Math.round(trailer.wear * 100)}%` });
        states.push({ id: 'Nybo.ETS2.Trailer.wearChassis', value: `${Math.round(trailer.wearChassis * 100)}%` });
        states.push({ id: 'Nybo.ETS2.Trailer.wearWheels', value: `${Math.round(trailer.wearWheels * 100)}%` });

        // Cargo (top level in telemetry for current job?)
        // Or trailer cargo? telemetry.cargo is usually the job cargo.
        // SDK says cargoId, cargo, cargoMass are at root level for the JOB.
        // But trailer might also have cargo access? 
        // Let's use telemetry.cargo (string) and telemetry.cargoMass etc.

        states.push({ id: 'Nybo.ETS2.Trailer.Cargo', value: telemetry.cargo });
        states.push({ id: 'Nybo.ETS2.Trailer.CargoID', value: telemetry.cargoId });
        states.push({ id: 'Nybo.ETS2.Trailer.CargoLoaded', value: telemetry.cargoLoaded.toString() });
        states.push({ id: 'Nybo.ETS2.Trailer.CargoType', value: telemetry.cargo }); // Duplicate?
        states.push({ id: 'Nybo.ETS2.Trailer.CargoDamage', value: `${Math.round(telemetry.cargoDamage * 100)}%` });

        // Mass
        let mass = telemetry.cargoMass; // kg
        let unitLabel = 'Tons';
        const weightUnit = basics.weight;

        if (weightUnit === 0) { // Tons
            mass = Math.round(mass / 1000);
            unitLabel = 'Tons';
        } else if (weightUnit === 1) { // US Tons
            mass = Math.round((mass / 1000) * 1.102311);
            unitLabel = 'US Tons';
        } else if (weightUnit === 2) { // UK Tons
            mass = Math.round((mass / 1000) * 0.9843065);
            unitLabel = 'UK Tons';
        } else if (weightUnit === 3) { // Pounds
            mass = Math.round((mass / 1000) * 2204.6226);
            unitLabel = 'Pounds';
        }

        states.push({ id: 'Nybo.ETS2.Trailer.CargoMass', value: `${mass} ${unitLabel}` });

    } else {
        states.push({ id: 'Nybo.ETS2.Trailer.TrailerName', value: '-' });
        // Set others to -? Leaving as previous logic.
    }

    return states;
};
