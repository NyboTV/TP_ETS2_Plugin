// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json') 

const truckStates = async (TPClient, telemetry_path, logIt, timeout, path, cfg_path) => {
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    let unit = ""
    let unitOld = ""
    
    let fluid = ""
    let fluidOld = ""

    let fluidCon = ""
    let fluidConOld = ""

    let temp = ""
    let tempOld = ""

    let truck = ""

    let HazardLightsCounter = 10

    let Constructor = ""
    let ConstructorOld = ""

    let Model = ""
    let ModelOld = ""

    let	CruiseControlSpeed = ""
    let	CruiseControlSpeedOld = ""

    let	CruiseControlOn = ""
    let	CruiseControlOnOld = ""

    let Odometer = ""
    let OdometerOld = ""

    let	ShifterType = ""
    let	ShifterTypeOld = ""

    let	Gear = ""
    let	GearOld = ""

    let	Speed = ""
    let	SpeedOld = ""

    let	EngineRPM = ""
    let	EngineRPMOld = ""

    let	EngineOn = ""
    let	EngineOnOld = ""

    let	ElectricOn = ""
    let	ElectricOnOld = ""

    let	WipersOn = ""
    let	WipersOnOld = ""

    let	ParkBrakeOn = ""
    let	ParkBrakeOnOld = ""

    let	MotorBrakeOn = ""
    let	MotorBrakeOnOld = ""

    let Retarder = ""
    let RetarderOld = ""


    let	Fuel = ""
    let	FuelOld = ""

    let FuelConsumption = ""
    let FuelConsumptionOld = ""
    
    let	AdBlue = ""
    let	AdBlueOld = ""
    
    let	AirPressure = ""
    let	AirPressureOld = ""
    
    let	OilTemp = ""
    let	OilTempOld = ""
    
    let	WaterTemp = ""
    let	WaterTempOld = ""
    
    let	BatteryVoltage = ""
    let	BatteryVoltageOld = ""

    let	FuelCapacity = ""
    let	FuelCapacityOld = ""

    let	FuelWarningOn = ""
    let	FuelWarningOnOld = ""

    let	AdBlueWarningOn = ""
    let	AdBlueWarningOnOld = ""

    let	AirPressureWarningOn = ""
    let	AirPressureWarningOnOld = ""

    let	AirPressureEmergencyOn = ""
    let	AirPressureEmergencyOnOld = ""

    let	OilPressureWarningOn = ""
    let	OilPressureWarningOnOld = ""

    let	WaterTempWarningOn = ""
    let	WaterTempWarningOnOld = ""

    let	BatteryVoltageWarningOn = ""
    let	BatteryVoltageWarningOnOld = ""


    // Wears
    let wearEngine = ""
    let wearEngineOld = ""

    let wearTransmission = ""
    let wearTransmissionOld = ""

    let wearCabin = "" 
    let wearCabinOld = ""
    
    let wearChassis = ""
    let wearChassisOld = ""
    
    let wearWheels = ""
    let wearWheelsOld = ""


    // Indicator
    let	BlinkerLeftActive = ""
    let BlinkerLeftActiveOld = ""

    let	BlinkerRightActive = ""
    let BlinkerRightActiveOld = ""
    
    let	BlinkerLeftOn = ""
    let	BlinkerLeftOnOld = ""

    let	BlinkerRightOn = ""
    let	BlinkerRightOnOld = ""
    
    let HazardLightsOn = ""
    let HazardLightsOnOld = ""


    // Lights
    let	LightsDashboardValue = ""
    let LightsDashboardValueOld = ""

    let	LightsDashboardOn = ""
    let	LightsDashboardOnOld = ""
    
    let	LightsParkingOn = ""
    let	LightsParkingOnOld = ""
    
    let	LightsBeamLowOn = ""
    let	LightsBeamLowOnOld = ""
    
    let	LightsBeamHighOn = ""
    let	LightsBeamHighOnOld = ""
    
    let	LightsAuxFrontOn = ""
    let	LightsAuxFrontOnOld = ""
    
    let	LightsAuxRoofOn = ""
    let	LightsAuxRoofOnOld = ""
    
    let	LightsBeaconOn = ""
    let	LightsBeaconOnOld = ""
    
    let	LightsBrakeOn = ""
    let	LightsBrakeOnOld = ""
    
    let	LightsReverseOn = ""
    let	LightsReverseOnOld = ""

    var states = []

    var offline = false

    // Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    var telemetry = new sJSON(`${telemetry_path}/tmp.json`)
    let config = new sJSON(`${cfg_path}/cfg.json`)
    let userconfig = new sJSON(`${cfg_path}/usercfg.json`)

    // Setting Values First Time to refresh
    refreshInterval = config.refreshInterval

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(refreshInterval), configLoop++) {
            if(module.Modules.truckStates === false) {
                if(ModuleLoaded === true) { logIt("MODULE", `${moduleName}States`, `Module unloaded`) }
                ModuleLoaded = false
            } else if(ModuleLoaded === false) { 
                logIt("MODULE", `${moduleName}States`, `Module loaded`)
                ModuleLoaded = true 
            }
        }
    }

    //Module Loop
    async function moduleloop () {
        for (var moduleLoop = 0; moduleLoop < Infinity; await timeout(refreshInterval), moduleLoop++) {
            refreshInterval = config.refreshInterval
           
    
            if(ModuleLoaded === false) { 
                states = []
                if(offline === false) {
                    states = [
                        {
                        id: "Nybo.ETS2.Truck.Truck_Make",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.Model",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.CruiseControlSpeed",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.CruiseControlOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.Speed",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.EngineRPM",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.Gear",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.EngineOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.ElectricOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.WipersOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.ParkBrakeOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.MotorBrakeOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.Fuel",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.AdBlue",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.AirPressure",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.OilTemp",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.WaterTemp",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.BatteryVoltage",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.FuelCapacity",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.FuelWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.AdBlueWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.AirPressureWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.AirPressureEmergencyOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.OilPressureWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.WaterTempWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.BatteryVoltageWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.BlinkerLeftActive",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.BlinkerRightActive",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.BlinkerLeftOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.BlinkerRightOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.HazardLightsOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.LightsDashboardValue",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.LightsDashboardOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.LightsParkingOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.LightsBeamLowOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.LightsBeamHighOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.LightsAuxFrontOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.LightsAuxRoofOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.LightsBeaconOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.LightsBrakeOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.LightsReverseOn",
                        value: `MODULE OFFLINE` 
                        },

                        
                        {
                        id: "Nybo.ETS2.Truck.wearEngine",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.wearTransmission",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.wearCabin",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.wearChassis",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Truck.wearWheels",
                        value: `MODULE OFFLINE` 
                        }
                    ]
                    
                    TPClient.stateUpdateMany(states);
    
                    offline = true
                }
                continue
            } else 

            // States
            states = []
                    
            // Vars
            truck = telemetry.truck

            Constructor = truck.make
            Model = truck.model

            CruiseControlSpeed = truck.cruiseControlSpeed
            CruiseControlOn = truck.cruiseControlOn

            Odometer = Math.round(truck.odometer)
            
            Speed = Math.round(truck.speed)
            EngineRPM = Math.round(truck.engineRpm)

            ShifterType = truck.shifterType
            Gear = truck.displayedGear
        
            EngineOn = truck.engineOn
            ElectricOn = truck.electricOn
            WipersOn = truck.wipersOn

            ParkBrakeOn = truck.parkBrakeOn
            MotorBrakeOn = truck.motorBrakeOn

            Retarder = truck.retarderBrake

            Fuel = Math.round(truck.fuel)
            FuelConsumption = truck.fuelAverageConsumption
            FuelCapacity = Math.round(truck.fuelCapacity)
            AdBlue = Math.round(truck.adblue)

            AirPressure = Math.round(truck.airPressure)
            OilTemp = Math.round(truck.oilTemperature)
            WaterTemp = Math.round(truck.waterTemperature)
            BatteryVoltage = Math.round(truck.batteryVoltage)

            FuelWarningOn = truck.fuelWarningOn        
            AdBlueWarningOn = truck.adblueWarningOn
            AirPressureWarningOn = truck.airPressureWarningOn
            AirPressureEmergencyOn = truck.airPressureEmergencyOn
            OilPressureWarningOn = truck.oilPressureWarningOn
            WaterTempWarningOn = truck.waterTemperatureWarningOn
            BatteryVoltageWarningOn = truck.batteryVoltageWarningOn

            wearEngine = truck.wearEngine
            wearTransmission = truck.wearTransmission
            wearCabin = truck.wearCabin
            wearChassis = truck.wearChassis
            wearWheels = truck.wearWheels
        
            BlinkerLeftActive = truck.blinkerLeftActive
            BlinkerRightActive = truck.blinkerRightActive
            BlinkerLeftOn = truck.blinkerLeftOn
            BlinkerRightOn = truck.blinkerRightOn
            HazardLightsOn = true
        
            LightsDashboardValue = Math.round(truck.lightsDashboardValue * 100) / 100
            LightsDashboardOn = truck.lightsDashboardOn
            LightsParkingOn = truck.lightsParkingOn
            LightsBeamLowOn = truck.lightsBeamLowOn
            LightsBeamHighOn = truck.lightsBeamHighOn
            LightsAuxFrontOn = truck.lightsAuxFrontOn
            LightsAuxRoofOn = truck.lightsAuxRoofOn
            LightsBeaconOn = truck.lightsBeaconOn
            LightsBrakeOn = truck.lightsBrakeOn
            LightsReverseOn = truck.lightsReverseOn

            unit = userconfig.Basics.unit
            unit = unit.toLowerCase()

            fluid = userconfig.Basics.fluid  // NUMBERS
            fluidCon = userconfig.Basics.fluidCon // NUMBERS

            temp = userconfig.Basics.temp
            temp = temp.toLowerCase()


            // Script
            
            if(Constructor !== ConstructorOld || offline === true) {
                ConstructorOld = Constructor

                var data = {
                    id: "Nybo.ETS2.Truck.Truck_Make",
                    value: `${Constructor}`
                }

                states.push(data)
            }

            if(Model !== ModelOld || offline === true) {
                ModelOld = Model

                var data = {
                    id: "Nybo.ETS2.Truck.Model",
                    value: `${Model}`
                }

                states.push(data)
            }

            if(CruiseControlSpeed !== CruiseControlSpeedOld || unit !== unitOld || offline === true) {
                CruiseControlSpeedOld = CruiseControlSpeed

                if(unit === "miles") {
                    CruiseControlSpeed = Math.round(CruiseControlSpeed / 1.609344)
                } else {
                    CruiseControlSpeed = Math.round(CruiseControlSpeed)
                }
            
                var data = {
                    id: "Nybo.ETS2.Truck.CruiseControlSpeed",
                    value: `${CruiseControlSpeed}`
                }

                states.push(data)
            }

            if(CruiseControlOn !== CruiseControlOnOld || offline === true) {
                CruiseControlOnOld = CruiseControlOn

                var data = {
                    id: "Nybo.ETS2.Truck.CruiseControlOn",
                    value: `${CruiseControlOn}`
                }

                states.push(data)
            }

            if(Odometer !== OdometerOld || unit !== unitOld || offline === true) {
                OdometerOld = Odometer

                if(unit === "miles") {
                    Odometer = Math.floor(Odometer / 1.609344)
                }

                var data = {
                    id: "Nybo.ETS2.Truck.Odometer",
                    value: `${Odometer}`
                }

                states.push(data)
            }

            if(Speed !== SpeedOld || unit !== unitOld || offline === true) {
                SpeedOld = Speed

                if(unit === "miles") {
                    Speed = Math.round(Speed / 1.609344)
                } else {
                    Speed = Math.round(Speed)
                }

                var data = {
                    id: "Nybo.ETS2.Truck.Speed",
                    value: `${Speed}`
                }

                states.push(data)
            }

            if(EngineRPM !== EngineRPMOld || offline === true) {
                EngineRPMOld = EngineRPM

                var data = {
                    id: "Nybo.ETS2.Truck.EngineRPM",
                    value: `${EngineRPM}`
                }

                states.push(data)
            }

            if(Gear !== GearOld || ShifterType !== ShifterTypeOld || offline === true) {
                GearOld = Gear
                ShifterTypeOld = ShifterType

                Gear = await getGear(Gear, ShifterType)

                var data = {
                    id: "Nybo.ETS2.Truck.Gear",
                    value: `${Gear}`
                }

                states.push(data)
            }
        
            if(EngineOn !== EngineOnOld || offline === true) {
                EngineOnOld = EngineOn

                var data = {
                        id: "Nybo.ETS2.Truck.EngineOn",
                        value: `${EngineOn}`
                    }

                var data_event =  {
                        id: "Nybo.ETS2.Event.EngineOn",
                        value: `${EngineOn}`
                    }
                
                states.push(data)
                states.push(data_event)
            }
            
            if(ElectricOn !== ElectricOnOld || offline === true) {
                ElectricOnOld = ElectricOn

                var data = {
                        id: "Nybo.ETS2.Truck.ElectricOn",
                        value: `${ElectricOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Event.ElectricOn",
                        value: `${ElectricOn}`
                    }

                states.push(data)
                states.push(data_event)
            }
            
            if(WipersOn !== WipersOnOld || offline === true) {
                WipersOnOld = WipersOn

                var data = {
                        id: "Nybo.ETS2.Truck.WipersOn",
                        value: `${WipersOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Event.WipersOn",
                        value: `${WipersOn}`
                    }

                states.push(data)
                states.push(data_event)
            }

            if(ParkBrakeOn !== ParkBrakeOnOld || offline === true) {
                ParkBrakeOnOld = ParkBrakeOn

                var data = {
                        id: "Nybo.ETS2.Truck.ParkBrakeOn",
                        value: `${ParkBrakeOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Event.ParkBrakeOn",
                        value: `${ParkBrakeOn}`
                    }               

                states.push(data)
                states.push(data_event)
            }

            if(MotorBrakeOn !== MotorBrakeOnOld || offline === true) {
                MotorBrakeOnOld = MotorBrakeOn

                var data = {
                    id: "Nybo.ETS2.Truck.MotorBrakeOn",
                    value: `${MotorBrakeOn}`
                }

                states.push(data)
            }

            if(Retarder !== RetarderOld || offline === true) {
                RetarderOld = Retarder

                var data = {
                    id: "Nybo.ETS2.Truck.Retarder",
                    value: `${Retarder}`
                }

                var data_event = {
                    id: "Nybo.ETS2.Event.Retarder",
                    value: `${Retarder}`
                }

                states.push(data)
                states.push(data_event)
            }

            if(Fuel !== FuelOld || fluid !== fluidOld || offline === true) {
                FuelOld = Fuel

                if(fluid === 1) {
                    Fuel = Math.floor(Fuel / 3.785)  // US
                } else if (fluid === 2) {
                    Fuel = Math.floor(Fuel / 4.546)  // British
                }

                var data = {
                    id: "Nybo.ETS2.Truck.Fuel",
                    value: `${Fuel}`
                }

                states.push(data)
            }

            if(FuelConsumption !== FuelConsumptionOld || unit !== unitOld || fluidCon !== fluidConOld || offline === true) {
                FuelConsumptionOld = FuelConsumption
                fluidConOld = fluidCon

                switch (fluidCon) {
                    case 0:
                        FuelConsumption = FuelConsumption
                    break

                    case 1:
                        FuelConsumption = FuelConsumption / 3.785
                    break

                    case 2:
                        FuelConsumption = FuelConsumption / 4.546
                    break

                    default:
                        FuelConsumption = "ERROR"
                    break
                }

                if(unit === "miles") {
                    FuelConsumption = FuelConsumption * 1.609
                }

                var data = {
                    id: "Nybo.ETS2.Truck.FuelConsumption",
                    value: `${FuelConsumption}`
                }

                states.push(data)
            }

            if(FuelCapacity !== FuelCapacityOld || fluid !== fluidOld || offline === true) {
                FuelCapacityOld = FuelCapacity

                if(fluid === 1) {
                    FuelCapacity = FuelCapacity / 3.785
                } else if (fluid === 2) {
                    FuelCapacity = FuelCapacity / 4.546
                }

                var data = {
                    id: "Nybo.ETS2.Truck.FuelCapacity",
                    value: `${FuelCapacity}`
                }

                states.push(data)
            }

            if(AdBlue !== AdBlueOld || offline === true) {
                AdBlueOld = AdBlue

                var data = {
                    id: "Nybo.ETS2.Truck.AdBlue",
                    value: `${AdBlue}`
                }

                states.push(data)
            }

            if(AirPressure !== AirPressureOld || offline === true) {
                AirPressureOld = AirPressure

                var data = {
                    id: "Nybo.ETS2.Truck.AirPressure",
                    value: `${AirPressure}`
                }

                states.push(data)
            }

            if(OilTemp !== OilTempOld || temp !== tempOld || offline === true) {
                OilTempOld = OilTemp

                if(temp === "fahrenheit") {
                    OilTemp = Math.floor(OilTemp * 9/5) + 32

                    var data = {
                        id: "Nybo.ETS2.Truck.OilTemp",
                        value: `${OilTemp} F°`
                    }
                } else {
                    var data = {
                        id: "Nybo.ETS2.Truck.OilTemp",
                        value: `${OilTemp} C°`
                    }
                }

                states.push(data)
            }

            if(WaterTemp !== WaterTempOld || temp !== tempOld || offline === true) {
                WaterTempOld = WaterTemp

                if(temp === "fahrenheit") {
                    WaterTemp = Math.floor(WaterTemp * 9/5) + 32

                    var data = {
                        id: "Nybo.ETS2.Truck.WaterTemp",
                        value: `${WaterTemp} F°`
                    }
                } else {
                    var data = {
                        id: "Nybo.ETS2.Truck.WaterTemp",
                        value: `${WaterTemp} C°`
                    }
                }

                states.push(data)
            }

            if(BatteryVoltage !== BatteryVoltageOld || offline === true) {
                BatteryVoltageOld = BatteryVoltage

                var data = {
                    id: "Nybo.ETS2.Truck.BatteryVoltage",
                    value: `${BatteryVoltage}`
                }

                states.push(data)
            }

            if(FuelWarningOn !== FuelWarningOnOld || offline === true) {
                FuelWarningOnOld = FuelWarningOn

                var data = {
                        id: "Nybo.ETS2.Truck.FuelWarningOn",
                        value: `${FuelWarningOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Event.FuelWarningOn",
                        value: `${FuelWarningOn}`
                    }

                states.push(data)
                states.push(data_event)
            }
                
            if(AdBlueWarningOn !== AdBlueWarningOnOld || offline === true) {
                AdBlueWarningOnOld = AdBlueWarningOn

                var data = {
                        id: "Nybo.ETS2.Truck.AdBlueWarningOn",
                        value: `${AdBlueWarningOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Event.AdBlueWarningOn",
                        value: `${AdBlueWarningOn}`
                    }                 

                states.push(data)
                states.push(data_event)
            }
                
            if(AirPressureWarningOn !== AirPressureWarningOnOld || offline === true) {
                AirPressureWarningOnOld = AirPressureWarningOn

                var data = {
                        id: "Nybo.ETS2.Truck.AirPressureWarningOn",
                        value: `${AirPressureWarningOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Event.AirPressureWarningOn",
                        value: `${AirPressureWarningOn}`
                    }                 

                states.push(data)
                states.push(data_event)
            }
                
            if(AirPressureEmergencyOn !== AirPressureEmergencyOnOld || offline === true) {
                AirPressureEmergencyOnOld = AirPressureEmergencyOn

                var data = {
                    id: "Nybo.ETS2.Truck.AirPressureEmergencyOn",
                    value: `${AirPressureEmergencyOn}`
                }

                states.push(data)
            }
                
            if(OilPressureWarningOn !== OilPressureWarningOnOld || offline === true) {
                OilPressureWarningOnOld = OilPressureWarningOn

                var data = {
                        id: "Nybo.ETS2.Truck.OilPressureWarningOn",
                        value: `${OilPressureWarningOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Event.OilPressureWarningOn",
                        value: `${OilPressureWarningOn}`
                    }

                states.push(data)
                states.push(data_event)
            }
        
            if(WaterTempWarningOn !== WaterTempWarningOnOld || offline === true) {
                WaterTempWarningOnOld = WaterTempWarningOn

                var data = {
                        id: "Nybo.ETS2.Truck.WaterTempWarningOn",
                        value: `${WaterTempWarningOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Event.WaterTempWarningOn",
                        value: `${WaterTempWarningOn}`
                    }

                states.push(data)
                states.push(data_event)
            }

            if(BatteryVoltageWarningOn !== BatteryVoltageWarningOnOld || offline === true) {
                BatteryVoltageWarningOnOld = BatteryVoltageWarningOn

                var data = {
                    id: "Nybo.ETS2.Truck.BatteryVoltageWarningOn",
                    value: `${BatteryVoltageWarningOn}`
                }

                states.push(data)
            }


            // Indicator
            if(BlinkerLeftActive !== BlinkerLeftActiveOld || offline === true) {
                BlinkerLeftActiveOld = BlinkerLeftActive

                var data = {
                        id: "Nybo.ETS2.Truck.BlinkerLeftActive",
                        value: `${BlinkerLeftActive}`
                    }
                
                var data_event = {
                        id: "Nybo.ETS2.Event.BlinkerLeftActive",
                        value: `${BlinkerLeftActive}`
                    }

                states.push(data)
                states.push(data_event)
            } 

            if(BlinkerRightActive !== BlinkerRightActiveOld || offline === true) {
                BlinkerRightActiveOld = BlinkerRightActive

                var data = {
                        id: "Nybo.ETS2.Truck.BlinkerRightActive",
                        value: `${BlinkerRightActive}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Event.BlinkerRightActive",
                        value: `${BlinkerRightActive}`
                    }               

                states.push(data)
                states.push(data_event)
            } 

            if(BlinkerLeftOn !== BlinkerLeftOnOld || offline === true) {
                BlinkerLeftOnOld = BlinkerLeftOn

                var data = {
                        id: "Nybo.ETS2.Truck.BlinkerLeftOn",
                        value: `${BlinkerLeftOn}`
                    }

                states.push(data)
            }
            
            if(BlinkerRightOn !== BlinkerRightOnOld || offline === true) {
                BlinkerRightOnOld = BlinkerRightOn

                var data = {
                        id: "Nybo.ETS2.Truck.BlinkerRightOn",
                        value: `${BlinkerRightOn}`
                    }                

                states.push(data)
            }

            if (BlinkerLeftOn && BlinkerRightOn || offline === true) {
                HazardLightsOn = true
                HazardLightsCounter = 0
            }

            if (HazardLightsCounter < 10) {
                HazardLightsCounter++ 
            } else {
                HazardLightsOn = false
            }

            if(HazardLightsOn !== HazardLightsOnOld || offline === true) {
                HazardLightsOnOld = HazardLightsOn

                var data = {
                    id: "Nybo.ETS2.Truck.HazardLightsOn",
                    value: `${HazardLightsOn}`
                }

                var data_event = {
                    id: "Nybo.ETS2.Event.HazardLightsOn",
                    value: `${HazardLightsOn}`
                }

                states.push(data)
                states.push(data_event)
            }


            // Wears
            if(wearEngine !== wearEngineOld || offline === true) {
                wearEngineOld = wearEngine

                wearEngine = Math.round(wearEngine*100)

                var data = {
                    id: "Nybo.ETS2.Truck.wearEngine",
                    value: `${wearEngine}%`
                }

                states.push(data)
            }

            if(wearTransmission !== wearTransmissionOld || offline === true) {
                wearTransmissionOld = wearTransmission
                
                wearTransmission = Math.round(wearTransmission*100)

                var data = {
                    id: "Nybo.ETS2.Truck.wearTransmission",
                    value: `${wearTransmission}%`
                }

                states.push(data)
            }
            
            if(wearCabin !== wearCabinOld || offline === true) {
                wearCabinOld = wearCabin
                
                wearCabin = Math.round(wearCabin*100)

                var data = {
                    id: "Nybo.ETS2.Truck.wearCabin",
                    value: `${wearCabin}%`
                }

                states.push(data)
            }
            
            if(wearChassis !== wearChassisOld || offline === true) {
                wearChassisOld = wearChassis
                
                wearChassis = Math.round(wearChassis*100)

                var data = {
                    id: "Nybo.ETS2.Truck.wearChassis",
                    value: `${wearChassis}%`
                }

                states.push(data)
            }
            
            if(wearWheels !== wearWheelsOld || offline === true) {
                wearWheelsOld = wearWheels

                wearWheels = Math.round(wearWheels*100)

                var data = {
                    id: "Nybo.ETS2.Truck.wearWheels",
                    value: `${wearWheels}%`
                }

                states.push(data)
            }
        

            // Lights
            if(LightsDashboardValue !== LightsDashboardValueOld || offline === true) {
                LightsDashboardValueOld = LightsDashboardValue

                var data = {
                    id: "Nybo.ETS2.Truck.LightsDashboardValue",
                    value: `${LightsDashboardValue}`
                }

                states.push(data)
            }

            if(LightsDashboardOn !== LightsDashboardOnOld || offline === true) {
                LightsDashboardOnOld = LightsDashboardOn 

                var data = {
                        id: "Nybo.ETS2.Truck.LightsDashboardOn",
                        value: `${LightsDashboardOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Event.LightsDashboardOn",
                        value: `${LightsDashboardOn}`
                    }             

                states.push(data)
                states.push(data_event)
            }

            if(LightsParkingOn !== LightsParkingOnOld || offline === true) {
                LightsParkingOnOld = LightsParkingOn

                var data = {
                    id: "Nybo.ETS2.Truck.LightsParkingOn",
                    value: `${LightsParkingOn}`
                }

                states.push(data)
            }

            if(LightsBeamLowOn !== LightsBeamLowOnOld || offline === true) {
                LightsBeamLowOnOld = LightsBeamLowOn

                var data = {
                    id: "Nybo.ETS2.Truck.LightsBeamLowOn",
                    value: `${LightsBeamLowOn}`
                }

                states.push(data)
            }

            if(LightsBeamHighOn !== LightsBeamHighOnOld || offline === true) {
                LightsBeamHighOnOld = LightsBeamHighOn

                var data = {
                    id: "Nybo.ETS2.Truck.LightsBeamHighOn",
                    value: `${LightsBeamHighOn}`
                }

                states.push(data)
            }

            if(LightsAuxFrontOn !== LightsAuxFrontOnOld || offline === true) {
                LightsAuxFrontOnOld = LightsAuxFrontOn

                var data = {
                    id: "Nybo.ETS2.Truck.LightsAuxFrontOn",
                    value: `${LightsAuxFrontOn}`
                }

                states.push(data)
            }

            if(LightsAuxRoofOn !== LightsAuxRoofOnOld || offline === true) {
                LightsAuxRoofOnOld = LightsAuxRoofOn

                var data = {
                    id: "Nybo.ETS2.Truck.LightsAuxRoofOn",
                    value: `${LightsAuxRoofOn}`
                }

                states.push(data)
            }

            if(LightsBeaconOn !== LightsBeaconOnOld || offline === true) {
                LightsBeaconOnOld = LightsBeaconOn

                var data = {
                    id: "Nybo.ETS2.Truck.LightsBeaconOn",
                    value: `${LightsBeaconOn}`
                }

                states.push(data)
            }

            if(LightsBrakeOn !== LightsBrakeOnOld || offline === true) {
                LightsBrakeOnOld = LightsBrakeOn

                var data = {
                    id: "Nybo.ETS2.Truck.LightsBrakeOn",
                    value: `${LightsBrakeOn}`
                }

                states.push(data)
            }

            if(LightsReverseOn !== LightsReverseOnOld || offline === true) {
                LightsReverseOnOld = LightsReverseOn

                var data = {
                    id: "Nybo.ETS2.Truck.LightsReverseOn",
                    value: `${LightsReverseOn}`
                }

                states.push(data)
            }

            async function getGear(Gears, Shifter) {
                return new Promise(async (resolve, reject) => {
                    if (Shifter === "automatic") {
                        if (Gears === 0 ) {
                            resolve("N")
                        } else if (Gears > 0) {
                            resolve(`D${Gears}`)
                        } else if (Gears < 0) {
                            resolve(`R${Gears}`)
                        }
                    } else if (Shifter === "manual") {
                        if (Gears === 0) {
                            resolve("N")
                        } else if (Gears > 0) {
                            resolve(`${Gears}`)
                        } else if (Gears < 0) {
                            resolve(`-${Gears}`)
                        } 
                    } else {
                        resolve(Gears)
                    }
                })
            }        
            
            offline = false
            
            tempOld = temp
            unitOld = unit
            fluidOld = fluid
    
            try {
                if(states.length > 0) {
                    TPClient.stateUpdateMany(states);
                }
            } catch (error) {
                logIt("MODULE", `${moduleName}States`, `Error: ${error}`)
            }

		}
	}

	configloop()
	moduleloop()	
}
module.exports = truckStates