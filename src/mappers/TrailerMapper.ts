import { configService } from '../services/ConfigService';

export const mapTrailerStates = (telemetry: any) => {
    const trailers = telemetry.trailers || [];
    const states: { id: string, value: string }[] = [];
    const basics = configService.userCfg.Basics;

    const attachedTrailers = trailers.filter((t: any) => t.attached);
    states.push({ id: 'Nybo.ETS2.Trailer.TrailerAttached', value: (attachedTrailers.length > 0).toString() });
    states.push({ id: 'Nybo.ETS2.Trailer.TrailerCount', value: attachedTrailers.length.toString() });

    let totalWearSum = 0;
    if (attachedTrailers.length > 0) {
        attachedTrailers.forEach((t: any) => {
            const avgWear = ((t.wearChassis || 0) + (t.wearWheels || 0) + (t.wearBody || 0)) / 3;
            totalWearSum += avgWear;
        });
        const totalAvgWear = Math.round((totalWearSum / attachedTrailers.length) * 100);
        states.push({ id: 'Nybo.ETS2.Trailer.TotalWear', value: `${totalAvgWear}%` });
    } else {
        states.push({ id: 'Nybo.ETS2.Trailer.TotalWear', value: '0%' });
    }

    for (let i = 0; i < 3; i++) {
        const trailer = trailers[i];
        const n = i + 1;
        const isAttached = !!(trailer && trailer.attached);

        states.push({ id: `Nybo.ETS2.Trailer.${n}.Attached`, value: isAttached.toString() });

        if (isAttached) {
            states.push({ id: `Nybo.ETS2.Trailer.${n}.Name`, value: trailer.name || '-' });
            states.push({ id: `Nybo.ETS2.Trailer.${n}.Brand`, value: trailer.brand || '-' });
            states.push({ id: `Nybo.ETS2.Trailer.${n}.LicensePlate`, value: trailer.licensePlate || '-' });
            states.push({ id: `Nybo.ETS2.Trailer.${n}.WearChassis`, value: `${Math.round((trailer.wearChassis || 0) * 100)}%` });

            if (n === 1) {
                states.push({ id: 'Nybo.ETS2.Trailer.TrailerName', value: trailer.name || '-' });
                states.push({ id: 'Nybo.ETS2.Trailer.TrailerChainType', value: trailer.chainType || '-' });
                states.push({ id: 'Nybo.ETS2.Trailer.TrailerBodyType', value: trailer.bodyType || '-' });
                states.push({ id: 'Nybo.ETS2.Trailer.Wear', value: `${Math.round(((trailer.wearChassis || 0) + (trailer.wearWheels || 0) + (trailer.wearBody || 0)) / 3 * 100)}%` });
                states.push({ id: 'Nybo.ETS2.Trailer.wearChassis', value: `${Math.round((trailer.wearChassis || 0) * 100)}%` });
                states.push({ id: 'Nybo.ETS2.Trailer.wearWheels', value: `${Math.round((trailer.wearWheels || 0) * 100)}%` });
            }
        } else {
            states.push({ id: `Nybo.ETS2.Trailer.${n}.Name`, value: '-' });
            states.push({ id: `Nybo.ETS2.Trailer.${n}.Brand`, value: '-' });
            states.push({ id: `Nybo.ETS2.Trailer.${n}.LicensePlate`, value: '-' });
            states.push({ id: `Nybo.ETS2.Trailer.${n}.WearChassis`, value: '0%' });

            if (n === 1) {
                states.push({ id: 'Nybo.ETS2.Trailer.TrailerName', value: '-' });
                states.push({ id: 'Nybo.ETS2.Trailer.TrailerChainType', value: '-' });
                states.push({ id: 'Nybo.ETS2.Trailer.TrailerBodyType', value: '-' });
                states.push({ id: 'Nybo.ETS2.Trailer.Wear', value: '0%' });
                states.push({ id: 'Nybo.ETS2.Trailer.wearChassis', value: '0%' });
                states.push({ id: 'Nybo.ETS2.Trailer.wearWheels', value: '0%' });
            }
        }
    }

    const massKg = telemetry.cargoMass || 0;
    const massTons = Math.round(massKg / 1000);
    states.push({ id: 'Nybo.ETS2.Trailer.Cargo', value: telemetry.cargo || '-' });
    states.push({ id: 'Nybo.ETS2.Trailer.CargoID', value: telemetry.cargoId || '-' });
    states.push({ id: 'Nybo.ETS2.Trailer.CargoLoaded', value: (telemetry.isCargoLoaded ?? (massTons > 0)).toString() });
    states.push({ id: 'Nybo.ETS2.Trailer.CargoDamage', value: `${Math.round((telemetry.cargoDamage || 0) * 100)}%` });

    const formatMass = (tons: number) => {
        let val = tons;
        let unit = 'Tons';
        if (basics.weight === 1) { val = Math.round(tons * 1.102311); unit = 'US Tons'; }
        else if (basics.weight === 2) { val = Math.round(tons * 0.9843065); unit = 'UK Tons'; }
        else if (basics.weight === 3) { val = Math.round(tons * 2204.6226); unit = 'Pounds'; }
        return `${val} ${unit}`;
    };
    states.push({ id: 'Nybo.ETS2.Trailer.CargoMass', value: formatMass(massTons) });

    // Trailer Mechanical
    const mainTrailer = trailers[0];
    if (mainTrailer && mainTrailer.attached) {
        states.push({ id: 'Nybo.ETS2.Trailer.BrakeTemperature', value: `${Math.round(mainTrailer.brakeTemperature || 0)} °C` });

        // Fix: Use truck.trailerLiftAxle / truck.trailerLiftAxleIndicator as these are the correct properties for the active trailer
        const truck = telemetry.truck || {};
        states.push({ id: 'Nybo.ETS2.Trailer.LiftAxleOn', value: (truck.trailerLiftAxle ?? false).toString() });
        states.push({ id: 'Nybo.ETS2.Trailer.LiftAxleIndicatorOn', value: (truck.trailerLiftAxleIndicator ?? false).toString() });
    } else {
        states.push({ id: 'Nybo.ETS2.Trailer.BrakeTemperature', value: '0 °C' });
        states.push({ id: 'Nybo.ETS2.Trailer.LiftAxleOn', value: 'false' });
        states.push({ id: 'Nybo.ETS2.Trailer.LiftAxleIndicatorOn', value: 'false' });
    }

    return states;
};
