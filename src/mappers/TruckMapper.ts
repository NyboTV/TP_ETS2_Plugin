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

    // --- Speed & Cruise Control ---
    let speed = truck.speed;
    let cruiseSpeed = truck.cruiseControlSpeed;
    let odometer = truck.truckOdometer;

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
    states.push({ id: 'Nybo.ETS2.Truck.CruiseControlOn', value: truck.cruiseControl.toString() });

    // --- Engine & Mechanics ---
    states.push({ id: 'Nybo.ETS2.Truck.EngineRPM', value: Math.round(truck.engineRpm).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.Gear', value: getGear(truck.gearDashboard, truck.shifterType) });
    states.push({ id: 'Nybo.ETS2.Truck.EngineOn', value: truck.engineEnabled.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.ElectricOn', value: truck.electricEnabled.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.WipersOn', value: truck.wipers.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.ParkBrakeOn', value: truck.parkBrake.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.MotorBrakeOn', value: truck.motorBrake.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.Retarder', value: truck.retarderBrake.toString() });

    // --- Fluids ---
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
    states.push({ id: 'Nybo.ETS2.Truck.AdBlue', value: Math.round(truck.adblue).toString() });

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

    // --- Temperatures ---
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

    // --- Usage/Sim info ---
    states.push({ id: 'Nybo.ETS2.Truck.Truck_Make', value: truck.truckBrand });
    states.push({ id: 'Nybo.ETS2.Truck.Model', value: truck.truckName });

    // Weights / Wear
    states.push({ id: 'Nybo.ETS2.Truck.wearEngine', value: `${Math.round(truck.wearEngine * 100)}%` });
    states.push({ id: 'Nybo.ETS2.Truck.wearTransmission', value: `${Math.round(truck.wearTransmission * 100)}%` });
    states.push({ id: 'Nybo.ETS2.Truck.wearCabin', value: `${Math.round(truck.wearCabin * 100)}%` });
    states.push({ id: 'Nybo.ETS2.Truck.wearChassis', value: `${Math.round(truck.wearChassis * 100)}%` });
    states.push({ id: 'Nybo.ETS2.Truck.wearWheels', value: `${Math.round(truck.wearWheels * 100)}%` });

    // Lights
    states.push({ id: 'Nybo.ETS2.Truck.LightsDashboardOn', value: (truck.lightsDashboard > 0).toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsParkingOn', value: truck.lightsParking.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsBeamLowOn', value: truck.lightsBeamLow.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsBeamHighOn', value: truck.lightsBeamHigh.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsBeaconOn', value: truck.lightsBeacon.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsBrakeOn', value: truck.lightsBrake.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.LightsReverseOn', value: truck.lightsReverse.toString() });

    // Hazards
    const left = truck.blinkerLeftOn;
    const right = truck.blinkerRightOn;

    if (left && right) {
        hazardLightsOn = true;
        hazardCounter = 0;
    }

    if (hazardCounter < 10) {
        hazardCounter++;
    } else {
        hazardLightsOn = false;
    }

    states.push({ id: 'Nybo.ETS2.Truck.HazardLightsOn', value: hazardLightsOn.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.BlinkerLeftOn', value: left.toString() });
    states.push({ id: 'Nybo.ETS2.Truck.BlinkerRightOn', value: right.toString() });

    return states;
};
