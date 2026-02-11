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
    states.push({ id: 'Nybo.ETS2.Setting.timeFormat', value: b.timeFormat });

    // Fluid Consumption Unit Label
    let fluidConUnit = `Liters / ${b.unit}`;
    if (b.fluidCon === 1) fluidConUnit = `US Gallons / ${b.unit}`;
    if (b.fluidCon === 2) fluidConUnit = `UK Gallons / ${b.unit}`;
    states.push({ id: 'Nybo.ETS2.Setting.fluidConUnit', value: fluidConUnit });

    // Plugin Settings
    const c = configService.cfg;
    states.push({ id: 'Nybo.ETS2.Setting.RefreshInterval', value: `${c.refreshInterval}ms` });
    states.push({ id: 'Nybo.ETS2.Setting.TruckersMPServer', value: c.TruckersMPServer.toString() });
    states.push({ id: 'Nybo.ETS2.Setting.OfflineMode', value: c.OfflineMode.toString() });
    states.push({ id: 'Nybo.ETS2.Setting.AutoUpdate', value: c.UpdateCheck.toString() });

    return states;
};
