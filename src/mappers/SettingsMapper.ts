import { configService } from '../services/ConfigService';

export const mapSettingsStates = () => {
    const states: { id: string, value: string }[] = [];
    const b = configService.userCfg.Basics;

    states.push({ id: 'Nybo.ETS2.Setting.currencyUnit', value: b.currency });
    states.push({ id: 'Nybo.ETS2.Setting.speedUnit', value: b.unit });

    const fluids = ["Liters", "US Gallons", "UK Gallons"];
    states.push({ id: 'Nybo.ETS2.Setting.fluidUnit', value: fluids[b.fluid] || "Liters" });

    const weights = ["Tons", "US Tons", "UK Tons", "Pounds"];
    states.push({ id: 'Nybo.ETS2.Setting.weightUnit', value: weights[b.weight] || "Tons" });

    states.push({ id: 'Nybo.ETS2.Setting.tempUnit', value: b.temp });

    // Fluid Consumption Unit Label
    let fluidConUnit = `Liters / ${b.unit}`;
    if (b.fluidCon === 1) fluidConUnit = `US Gallons / ${b.unit}`;
    if (b.fluidCon === 2) fluidConUnit = `UK Gallons / ${b.unit}`;
    states.push({ id: 'Nybo.ETS2.Setting.fluidConUnit', value: fluidConUnit });

    return states;
};
