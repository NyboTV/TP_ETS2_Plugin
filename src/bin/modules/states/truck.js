// Loading Module
const { logger } = require('../script/logger')
const pluginEvents = require('../script/emitter')

const truckStates = async (TPClient, path, configs) => {
    const { config, userconfig } = configs

    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')

    let unit, unitOld
    let fluid, fluidOld
    let fluidCon, fluidConOld
    let temp, tempOld

    let truck
    let HazardLightsCounter = 10

    let Constructor, ConstructorOld
    let Model, ModelOld

    let	CruiseControlSpeed, CruiseControlSpeedOld
    let	CruiseControlOn, CruiseControlOnOld
    let Odometer, OdometerOld
    let	ShifterType, ShifterTypeOld
    let	Gear, GearOld

    let	Speed, SpeedOld
    let	EngineRPM, EngineRPMOld

    let	EngineOn, EngineOnOld
    let	ElectricOn, ElectricOnOld
    let	WipersOn, WipersOnOld
    let	ParkBrakeOn, ParkBrakeOnOld
    let	MotorBrakeOn, MotorBrakeOnOld
    let Retarder, RetarderOld


    let	Fuel, FuelOld
    let FuelConsumption, FuelConsumptionOld
    let	AdBlue, AdBlueOld
    let	AirPressure, AirPressureOld
    let	OilTemp, OilTempOld
    let	WaterTemp, WaterTempOld
    let	BatteryVoltage, BatteryVoltageOld
    let	FuelCapacity, FuelCapacityOld
    let	FuelWarningOn, FuelWarningOnOld
    let	AdBlueWarningOn, AdBlueWarningOnOld
    let	AirPressureWarningOn, AirPressureWarningOnOld
    let	AirPressureEmergencyOn, AirPressureEmergencyOnOld
    let	OilPressureWarningOn, OilPressureWarningOnOld
    let	WaterTempWarningOn, WaterTempWarningOnOld
    let	BatteryVoltageWarningOn, BatteryVoltageWarningOnOld


    // Wears
    let wearEngine, wearEngineOld

    let wearTransmission, wearTransmissionOld

    let wearCabin , wearCabinOld
    
    let wearChassis, wearChassisOld
    
    let wearWheels, wearWheelsOld


    // Indicator
    let	BlinkerLeftActive, BlinkerLeftActiveOld
    let	BlinkerRightActive, BlinkerRightActiveOld
    
    let	BlinkerLeftOn, BlinkerLeftOnOld
    let	BlinkerRightOn, BlinkerRightOnOld
    let HazardLightsOn, HazardLightsOnOld


    // Lights
    let	LightsDashboardValue, LightsDashboardValueOld
    let	LightsDashboardOn, LightsDashboardOnOld    
    let	LightsParkingOn, LightsParkingOnOld    
    let	LightsBeamLowOn, LightsBeamLowOnOld    
    let	LightsBeamHighOn, LightsBeamHighOnOld    
    let	LightsAuxFrontOn, LightsAuxFrontOnOld    
    let	LightsAuxRoofOn, LightsAuxRoofOnOld    
    let	LightsBeaconOn, LightsBeaconOnOld    
    let	LightsBrakeOn, LightsBrakeOnOld    
    let	LightsReverseOn, LightsReverseOnOld

    var states = []


    logger.info(`[MODULES] - [${moduleName}] Module loaded`)

	pluginEvents.on(`${moduleName}States`, async (telemetry) => {
		// States
        states = []
                    
        // Vars
        truck = telemetry

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
        
        if(Constructor !== ConstructorOld) {
            ConstructorOld = Constructor

            var data = {
                id: "Nybo.ETS2.Truck.Truck_Make",
                value: `${Constructor}`
            }

            states.push(data)
        }

        if(Model !== ModelOld) {
            ModelOld = Model

            var data = {
                id: "Nybo.ETS2.Truck.Model",
                value: `${Model}`
            }

            states.push(data)
        }

        if(CruiseControlSpeed !== CruiseControlSpeedOld || unit !== unitOld) {
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

        if(CruiseControlOn !== CruiseControlOnOld) {
            CruiseControlOnOld = CruiseControlOn

            var data = {
                id: "Nybo.ETS2.Truck.CruiseControlOn",
                value: `${CruiseControlOn}`
            }

            states.push(data)
        }

        if(Odometer !== OdometerOld || unit !== unitOld) {
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

        if(Speed !== SpeedOld || unit !== unitOld) {
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

        if(EngineRPM !== EngineRPMOld) {
            EngineRPMOld = EngineRPM

            var data = {
                id: "Nybo.ETS2.Truck.EngineRPM",
                value: `${EngineRPM}`
            }

            states.push(data)
        }

        if(Gear !== GearOld || ShifterType !== ShifterTypeOld) {
            GearOld = Gear
            ShifterTypeOld = ShifterType

            Gear = await getGear(Gear, ShifterType)

            var data = {
                id: "Nybo.ETS2.Truck.Gear",
                value: `${Gear}`
            }

            states.push(data)
        }
    
        if(EngineOn !== EngineOnOld) {
            EngineOnOld = EngineOn

            var data = {
                    id: "Nybo.ETS2.Truck.EngineOn",
                    value: `${EngineOn}`
                }
            
            states.push(data)
        }
        
        if(ElectricOn !== ElectricOnOld) {
            ElectricOnOld = ElectricOn

            var data = {
                    id: "Nybo.ETS2.Truck.ElectricOn",
                    value: `${ElectricOn}`
                }
            states.push(data)
        }
        
        if(WipersOn !== WipersOnOld) {
            WipersOnOld = WipersOn

            var data = {
                    id: "Nybo.ETS2.Truck.WipersOn",
                    value: `${WipersOn}`
                }

            states.push(data)
        }

        if(ParkBrakeOn !== ParkBrakeOnOld) {
            ParkBrakeOnOld = ParkBrakeOn

            var data = {
                    id: "Nybo.ETS2.Truck.ParkBrakeOn",
                    value: `${ParkBrakeOn}`
                }

            states.push(data)
        }

        if(MotorBrakeOn !== MotorBrakeOnOld) {
            MotorBrakeOnOld = MotorBrakeOn

            var data = {
                id: "Nybo.ETS2.Truck.MotorBrakeOn",
                value: `${MotorBrakeOn}`
            }

            states.push(data)
        }

        if(Retarder !== RetarderOld) {
            RetarderOld = Retarder

            var data = {
                id: "Nybo.ETS2.Truck.Retarder",
                value: `${Retarder}`
            }

            states.push(data)
        }

        if(Fuel !== FuelOld || fluid !== fluidOld) {
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

        if(FuelConsumption !== FuelConsumptionOld || unit !== unitOld || fluidCon !== fluidConOld) {
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

        if(FuelCapacity !== FuelCapacityOld || fluid !== fluidOld) {
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

        if(AdBlue !== AdBlueOld) {
            AdBlueOld = AdBlue

            var data = {
                id: "Nybo.ETS2.Truck.AdBlue",
                value: `${AdBlue}`
            }

            states.push(data)
        }

        if(AirPressure !== AirPressureOld) {
            AirPressureOld = AirPressure

            var data = {
                id: "Nybo.ETS2.Truck.AirPressure",
                value: `${AirPressure}`
            }

            states.push(data)
        }

        if(OilTemp !== OilTempOld || temp !== tempOld) {
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

        if(WaterTemp !== WaterTempOld || temp !== tempOld) {
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

        if(BatteryVoltage !== BatteryVoltageOld) {
            BatteryVoltageOld = BatteryVoltage

            var data = {
                id: "Nybo.ETS2.Truck.BatteryVoltage",
                value: `${BatteryVoltage}`
            }

            states.push(data)
        }

        if(FuelWarningOn !== FuelWarningOnOld) {
            FuelWarningOnOld = FuelWarningOn

            var data = {
                    id: "Nybo.ETS2.Truck.FuelWarningOn",
                    value: `${FuelWarningOn}`
                }

            states.push(data)
        }
            
        if(AdBlueWarningOn !== AdBlueWarningOnOld) {
            AdBlueWarningOnOld = AdBlueWarningOn

            var data = {
                    id: "Nybo.ETS2.Truck.AdBlueWarningOn",
                    value: `${AdBlueWarningOn}`
                }             

            states.push(data)
        }
            
        if(AirPressureWarningOn !== AirPressureWarningOnOld) {
            AirPressureWarningOnOld = AirPressureWarningOn

            var data = {
                    id: "Nybo.ETS2.Truck.AirPressureWarningOn",
                    value: `${AirPressureWarningOn}`
                }         

            states.push(data)
        }
            
        if(AirPressureEmergencyOn !== AirPressureEmergencyOnOld) {
            AirPressureEmergencyOnOld = AirPressureEmergencyOn

            var data = {
                id: "Nybo.ETS2.Truck.AirPressureEmergencyOn",
                value: `${AirPressureEmergencyOn}`
            }

            states.push(data)
        }
            
        if(OilPressureWarningOn !== OilPressureWarningOnOld) {
            OilPressureWarningOnOld = OilPressureWarningOn

            var data = {
                    id: "Nybo.ETS2.Truck.OilPressureWarningOn",
                    value: `${OilPressureWarningOn}`
                }

            states.push(data)
        }
    
        if(WaterTempWarningOn !== WaterTempWarningOnOld) {
            WaterTempWarningOnOld = WaterTempWarningOn

            var data = {
                    id: "Nybo.ETS2.Truck.WaterTempWarningOn",
                    value: `${WaterTempWarningOn}`
                }

            states.push(data)
        }

        if(BatteryVoltageWarningOn !== BatteryVoltageWarningOnOld) {
            BatteryVoltageWarningOnOld = BatteryVoltageWarningOn

            var data = {
                id: "Nybo.ETS2.Truck.BatteryVoltageWarningOn",
                value: `${BatteryVoltageWarningOn}`
            }

            states.push(data)
        }


        // Indicator
        if(BlinkerLeftActive !== BlinkerLeftActiveOld) {
            BlinkerLeftActiveOld = BlinkerLeftActive

            var data = {
                    id: "Nybo.ETS2.Truck.BlinkerLeftActive",
                    value: `${BlinkerLeftActive}`
                }

            states.push(data)
        } 

        if(BlinkerRightActive !== BlinkerRightActiveOld) {
            BlinkerRightActiveOld = BlinkerRightActive

            var data = {
                    id: "Nybo.ETS2.Truck.BlinkerRightActive",
                    value: `${BlinkerRightActive}`
                }      

            states.push(data)
        } 

        if(BlinkerLeftOn !== BlinkerLeftOnOld) {
            BlinkerLeftOnOld = BlinkerLeftOn

            var data = {
                    id: "Nybo.ETS2.Truck.BlinkerLeftOn",
                    value: `${BlinkerLeftOn}`
                }

            states.push(data)
        }
        
        if(BlinkerRightOn !== BlinkerRightOnOld) {
            BlinkerRightOnOld = BlinkerRightOn

            var data = {
                    id: "Nybo.ETS2.Truck.BlinkerRightOn",
                    value: `${BlinkerRightOn}`
                }                

            states.push(data)
        }

        if (BlinkerLeftOn && BlinkerRightOn) {
            HazardLightsOn = true
            HazardLightsCounter = 0
        }

        if (HazardLightsCounter < 10) {
            HazardLightsCounter++ 
        } else {
            HazardLightsOn = false
        }

        if(HazardLightsOn !== HazardLightsOnOld) {
            HazardLightsOnOld = HazardLightsOn

            var data = {
                id: "Nybo.ETS2.Truck.HazardLightsOn",
                value: `${HazardLightsOn}`
            }

            states.push(data)
        }


        // Wears
        if(wearEngine !== wearEngineOld) {
            wearEngineOld = wearEngine

            wearEngine = Math.round(wearEngine*100)

            var data = {
                id: "Nybo.ETS2.Truck.wearEngine",
                value: `${wearEngine}%`
            }

            states.push(data)
        }

        if(wearTransmission !== wearTransmissionOld) {
            wearTransmissionOld = wearTransmission
            
            wearTransmission = Math.round(wearTransmission*100)

            var data = {
                id: "Nybo.ETS2.Truck.wearTransmission",
                value: `${wearTransmission}%`
            }

            states.push(data)
        }
        
        if(wearCabin !== wearCabinOld) {
            wearCabinOld = wearCabin
            
            wearCabin = Math.round(wearCabin*100)

            var data = {
                id: "Nybo.ETS2.Truck.wearCabin",
                value: `${wearCabin}%`
            }

            states.push(data)
        }
        
        if(wearChassis !== wearChassisOld) {
            wearChassisOld = wearChassis
            
            wearChassis = Math.round(wearChassis*100)

            var data = {
                id: "Nybo.ETS2.Truck.wearChassis",
                value: `${wearChassis}%`
            }

            states.push(data)
        }
        
        if(wearWheels !== wearWheelsOld) {
            wearWheelsOld = wearWheels

            wearWheels = Math.round(wearWheels*100)

            var data = {
                id: "Nybo.ETS2.Truck.wearWheels",
                value: `${wearWheels}%`
            }

            states.push(data)
        }
    

        // Lights
        if(LightsDashboardValue !== LightsDashboardValueOld) {
            LightsDashboardValueOld = LightsDashboardValue

            var data = {
                id: "Nybo.ETS2.Truck.LightsDashboardValue",
                value: `${LightsDashboardValue}`
            }

            states.push(data)
        }

        if(LightsDashboardOn !== LightsDashboardOnOld) {
            LightsDashboardOnOld = LightsDashboardOn 

            var data = {
                    id: "Nybo.ETS2.Truck.LightsDashboardOn",
                    value: `${LightsDashboardOn}`
                }     

            states.push(data)
        }

        if(LightsParkingOn !== LightsParkingOnOld) {
            LightsParkingOnOld = LightsParkingOn

            var data = {
                id: "Nybo.ETS2.Truck.LightsParkingOn",
                value: `${LightsParkingOn}`
            }

            states.push(data)
        }

        if(LightsBeamLowOn !== LightsBeamLowOnOld) {
            LightsBeamLowOnOld = LightsBeamLowOn

            var data = {
                id: "Nybo.ETS2.Truck.LightsBeamLowOn",
                value: `${LightsBeamLowOn}`
            }

            states.push(data)
        }

        if(LightsBeamHighOn !== LightsBeamHighOnOld) {
            LightsBeamHighOnOld = LightsBeamHighOn

            var data = {
                id: "Nybo.ETS2.Truck.LightsBeamHighOn",
                value: `${LightsBeamHighOn}`
            }

            states.push(data)
        }

        if(LightsAuxFrontOn !== LightsAuxFrontOnOld) {
            LightsAuxFrontOnOld = LightsAuxFrontOn

            var data = {
                id: "Nybo.ETS2.Truck.LightsAuxFrontOn",
                value: `${LightsAuxFrontOn}`
            }

            states.push(data)
        }

        if(LightsAuxRoofOn !== LightsAuxRoofOnOld) {
            LightsAuxRoofOnOld = LightsAuxRoofOn

            var data = {
                id: "Nybo.ETS2.Truck.LightsAuxRoofOn",
                value: `${LightsAuxRoofOn}`
            }

            states.push(data)
        }

        if(LightsBeaconOn !== LightsBeaconOnOld) {
            LightsBeaconOnOld = LightsBeaconOn

            var data = {
                id: "Nybo.ETS2.Truck.LightsBeaconOn",
                value: `${LightsBeaconOn}`
            }

            states.push(data)
        }

        if(LightsBrakeOn !== LightsBrakeOnOld) {
            LightsBrakeOnOld = LightsBrakeOn

            var data = {
                id: "Nybo.ETS2.Truck.LightsBrakeOn",
                value: `${LightsBrakeOn}`
            }

            states.push(data)
        }

        if(LightsReverseOn !== LightsReverseOnOld) {
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
				logger.debug(`Module '${moduleName} refreshed with ${states.length} values`)
			}
		} catch (error) {
			logger.error(`[MODULE] ${moduleName} Error: ${error}`)
		}
	})	
}
module.exports = truckStates