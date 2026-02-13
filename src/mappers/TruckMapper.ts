import { configService } from '../services/ConfigService';

const getGear = (gears: number, shifter: string): string => {
    if (shifter === "automatic") {
        if (gears === 0) return "N";
        if (gears > 0) return `D${gears}`;
        if (gears < 0) return `R${Math.abs(gears)}`;
    } else if (shifter === "manual") {
        if (gears === 0) return "N";
        if (gears > 0) return `${gears}`;
        if (gears < 0) return `-${Math.abs(gears)}`; // Or just gears which is negative
    }
    return gears.toString();
};

let hazardLightsOn = false;
let hazardCounter = 10;

export const mapTruckStates = (telemetry: any) => {
    const truck = telemetry;
    const states: { id: string, value: string }[] = [];
    const basics = configService.userCfg.Basics;

    if (!truck) return states;

    // Helper for unit conversion
    // Input speed is m/s
    const mpsToKmh = (mps: number) => mps * 3.6;
    const mpsToMph = (mps: number) => mps * 2.236936;
    const toFahrenheit = (c: number) => (c * 9 / 5) + 32;
    const toGallonUS = (l: number) => l / 3.785;
    const toGallonUK = (l: number) => l / 4.546;

    let speed = truck.speed || 0;
    let cruiseSpeed = truck.cruiseControlSpeed || 0;
    let odometer = truck.truckOdometer || 0;

    if (basics.unit === 'Miles') {
        speed = mpsToMph(speed);
        cruiseSpeed = mpsToMph(cruiseSpeed);
        odometer = odometer * 0.621371; // km to miles
    } else {
        speed = mpsToKmh(speed);
        cruiseSpeed = mpsToKmh(cruiseSpeed);
        // Odometer is km by default
    }

    states.push({ id: 'Nybo.ETS2.Truck.Speed', value: Math.round(speed).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.CruiseControlSpeed', value: Math.round(cruiseSpeed).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.Odometer', value: Math.round(odometer).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.CruiseControlOn', value: (truck.cruiseControl ?? false).toString() });

    states.push({ id: 'Nybo.ETS2.Truck.EngineRPM', value: Math.round(truck.engineRpm ?? 0).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.Gear', value: getGear(truck.gearDashboard ?? 0, truck.shifterType ?? "automatic") });
    states.push({ id: 'Nybo.ETS2.Truck.EngineOn', value: (truck.engineEnabled ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.ElectricOn', value: (truck.electricEnabled ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.WipersOn', value: (truck.wipers ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.ParkBrakeOn', value: (truck.parkBrake ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.MotorBrakeOn', value: (truck.motorBrake ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.Retarder', value: (truck.retarderBrake ?? 0).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.RetarderStepCount', value: (truck.retarderStepCount ?? 0).toString() });

    let fuel = truck.fuel;
    let fuelCapacity = truck.fuelCapacity;

    if (basics.fluid === 1) { // US Gallon
        fuel = toGallonUS(fuel);
        fuelCapacity = toGallonUS(fuelCapacity);
    } else if (basics.fluid === 2) { // UK Gallon
        fuel = toGallonUK(fuel);
        fuelCapacity = toGallonUK(fuelCapacity);
    }

    states.push({ id: 'Nybo.ETS2.Truck.Fuel', value: Math.round(fuel).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.FuelCapacity', value: Math.round(fuelCapacity).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.AdBlue', value: Math.round(truck.adblue ?? 0).toString() });

    // Fuel Consumption (L/km usually in telemetry)
    let consumption = truck.fuelAvgConsumption;

    if (basics.fluidCon === 1) { // US Gal
        consumption = consumption / 3.785;
    } else if (basics.fluidCon === 2) { // UK Gal
        consumption = consumption / 4.546;
    }

    if (basics.unit === 'Miles') {
        consumption = consumption * 1.609; // L/km -> L/Mile (approx)? 
        // Logic: if L/km, then L/Mile = L/km * 1.609. Correct.
    }

    states.push({ id: 'Nybo.ETS2.Truck.FuelConsumption', value: consumption.toFixed(2) });

    let oilTemp = truck.oilTemperature;
    let waterTemp = truck.waterTemperature;

    if (basics.temp === 'Fahrenheit') {
        oilTemp = toFahrenheit(oilTemp);
        waterTemp = toFahrenheit(waterTemp);
        states.push({ id: 'Nybo.ETS2.Truck.OilTemp', value: `${Math.floor(oilTemp)} F°` });
        states.push({ id: 'Nybo.ETS2.Truck.WaterTemp', value: `${Math.floor(waterTemp)} F°` });
    } else {
        states.push({ id: 'Nybo.ETS2.Truck.OilTemp', value: `${Math.floor(oilTemp)} C°` });
        states.push({ id: 'Nybo.ETS2.Truck.WaterTemp', value: `${Math.floor(waterTemp)} C°` });
    }

    // Brake Temperature (Average of all wheels if available, or just first)
    const brakeTemp = truck.brakeTemperature || 0;
    states.push({ id: 'Nybo.ETS2.Truck.BrakeTemperature', value: `${Math.round(brakeTemp)} °C` });

    states.push({ id: 'Nybo.ETS2.Truck.Truck_Make', value: truck.truckBrand || '-' });
    states.push({ id: 'Nybo.ETS2.Truck.Model', value: truck.truckName || '-' });
    states.push({ id: 'Nybo.ETS2.Truck.LicensePlate', value: truck.licensePlate || '-' });
    states.push({ id: 'Nybo.ETS2.Truck.LicensePlateCountry', value: truck.licensePlateCountry || '-' });

    // Weights / Wear
    states.push({ id: 'Nybo.ETS2.Truck.wearEngine', value: `${Math.round((truck.wearEngine || 0) * 100)}%` });
    states.push({ id: 'Nybo.ETS2.Truck.wearTransmission', value: `${Math.round((truck.wearTransmission || 0) * 100)}%` });
    states.push({ id: 'Nybo.ETS2.Truck.wearCabin', value: `${Math.round((truck.wearCabin || 0) * 100)}%` });
    states.push({ id: 'Nybo.ETS2.Truck.wearChassis', value: `${Math.round((truck.wearChassis || 0) * 100)}%` });
    states.push({ id: 'Nybo.ETS2.Truck.wearWheels', value: `${Math.round((truck.wearWheels || 0) * 100)}%` });

    // Lights
    states.push({ id: 'Nybo.ETS2.Truck.LightsDashboardOn', value: ((truck.lightsDashboard ?? 0) > 0).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsDashboardValue', value: (truck.lightsDashboard ?? 0).toFixed(2) });
    states.push({ id: 'Nybo.ETS2.Truck.LightsParkingOn', value: (truck.lightsParking ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsBeamLowOn', value: (truck.lightsBeamLow ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsBeamHighOn', value: (truck.lightsBeamHigh ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsBeaconOn', value: (truck.lightsBeacon ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsBrakeOn', value: (truck.lightsBrake ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsReverseOn', value: (truck.lightsReverse ?? false).toString() });

    states.push({ id: 'Nybo.ETS2.Truck.LightsAuxFrontOn', value: (truck.lightsAuxFront ?? 0).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsAuxRoofOn', value: (truck.lightsAuxRoof ?? 0).toString() });

    const left = truck.blinkerLeftOn;
    const right = truck.blinkerRightOn;

    if (left && right) {
        hazardLightsOn = true;
        hazardCounter = 0;
    }
    if (hazardCounter < 10) hazardCounter++;
    else hazardLightsOn = false;

    let blinkerState = "Off";
    if (hazardLightsOn) blinkerState = "Hazard";
    else if (left) blinkerState = "Left";
    else if (right) blinkerState = "Right";

    states.push({ id: 'Nybo.ETS2.Truck.HazardLightsOn', value: hazardLightsOn.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.BlinkerLeftOn', value: (left ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.BlinkerRightOn', value: (right ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.BlinkerState', value: blinkerState });

    states.push({ id: 'Nybo.ETS2.Truck.FuelWarningOn', value: (truck.fuelWarning ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.AdBlueWarningOn', value: (truck.adblueWarning ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.AirPressureWarningOn', value: (truck.airPressureWarning ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.AirPressureEmergencyOn', value: (truck.airPressureEmergency ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.OilPressureWarningOn', value: (truck.oilPressureWarning ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.WaterTempWarningOn', value: (truck.waterTemperatureWarning ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.BatteryVoltageWarningOn', value: (truck.batteryVoltageWarning ?? false).toString() });

    // Warning Factors (Thresholds)
    states.push({ id: 'Nybo.ETS2.Truck.FuelWarningFactor', value: (truck.fuelWarningFactor ?? 0).toFixed(2) });
    states.push({ id: 'Nybo.ETS2.Truck.AdBlueWarningFactor', value: (truck.adblueWarningFactor ?? 0).toFixed(2) });
    states.push({ id: 'Nybo.ETS2.Truck.AirPressureWarningFactor', value: (truck.airPressureWarningFactor ?? 0).toFixed(2) });
    states.push({ id: 'Nybo.ETS2.Truck.AirPressureEmergencyWarningFactor', value: (truck.airPressureEmergencyWarningFactor ?? 0).toFixed(2) });
    states.push({ id: 'Nybo.ETS2.Truck.OilPressureWarningFactor', value: (truck.oilPressureWarningFactor ?? 0).toFixed(2) });
    states.push({ id: 'Nybo.ETS2.Truck.WaterTempWarningFactor', value: (truck.waterTemperatureWarningFactor ?? 0).toFixed(2) });
    states.push({ id: 'Nybo.ETS2.Truck.BatteryVoltageWarningFactor', value: (truck.batteryVoltageWarningFactor ?? 0).toFixed(2) });

    states.push({ id: 'Nybo.ETS2.Truck.BlinkerLeftActive', value: (truck.blinkerLeftActive ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.BlinkerRightActive', value: (truck.blinkerRightActive ?? false).toString() });

    states.push({ id: 'Nybo.ETS2.Truck.BatteryVoltage', value: (truck.batteryVoltage ?? 0).toFixed(1) });
    states.push({ id: 'Nybo.ETS2.Truck.AirPressure', value: Math.round(truck.airPressure ?? 0).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.DifferentialRatio', value: (truck.gearDifferential ?? 0).toFixed(2) });

    // H-Shifter Position
    states.push({ id: 'Nybo.ETS2.Truck.HShifterSlot', value: (truck.hshifterSlot ?? 0).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.HShifterSelector', value: (truck.hshifterSelector ?? 0).toString() });

    // Shifter Tech
    states.push({ id: 'Nybo.ETS2.Truck.ShifterType', value: truck.shifterType || 'Unknown' });
    states.push({ id: 'Nybo.ETS2.Truck.ForwardGears', value: (truck.forwardGears ?? 0).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.ReverseGears', value: (truck.reverseGears ?? 0).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.SelectorCount', value: (truck.selectorCount ?? 0).toString() });

    // Axle Lift
    states.push({ id: 'Nybo.ETS2.Truck.LiftAxleOn', value: (truck.liftAxle ?? false).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LiftAxleIndicatorOn', value: (truck.liftAxleIndicator ?? false).toString() });

    return states;
};
