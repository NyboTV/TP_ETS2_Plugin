const truckStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    // Loading Module
    const fs = require('fs')
    const sJSON = require('self-reload-json') 
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    let location = ""

    let truck = ""

    let HazardLightsCounter = ""

    let Constructor = ""
    let ConstructorOld = ""

    let Model = ""
    let ModelOld = ""

    let	CruiseControlSpeed = ""
    let	CruiseControlSpeedOld = ""

    let	CruiseControlOn = ""
    let	CruiseControlOnOld = ""

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


    let	Fuel = ""
    let	FuelOld = ""
    
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

    // Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    var telemetry = new sJSON(`${telemetry_path}/tmp.json`)

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(500), configLoop++) {
            if(module.Modules.truckStates === false) {
                if(ModuleLoaded === true) { logIt("MODULE", `Module ${moduleName}States unloaded`) }
                ModuleLoaded = false
            } else if(ModuleLoaded === false) { 
                logIt("MODULE", `Module ${moduleName}States loaded`)
                ModuleLoaded = true 
            }
        }
    }

    //Module Loop
    async function moduleloop () {
        for (var moduleLoop = 0; moduleLoop < Infinity; await timeout(refreshInterval), moduleLoop++) {
    
            if(ModuleLoaded === false) { 
            } else 

            // States
            states = []
                    
            // Vars
            truck = telemetry.truck

            Constructor = truck.make
            Model = truck.model

            CruiseControlSpeed = truck.cruiseControlSpeed
            CruiseControlOn = truck.cruiseControlOn
            
            Speed = Math.round(truck.speed)
            EngineRPM = Math.round(truck.engineRpm)

            ShifterType = truck.shifterType
            Gear = truck.displayedGear
        
            EngineOn = truck.engineOn
            ElectricOn = truck.electricOn
            WipersOn = truck.wipersOn

            ParkBrakeOn = truck.parkBrakeOn
            MotorBrakeOn = truck.motorBrakeOn

            Fuel = Math.round(truck.fuel * 100) / 100
            FuelCapacity = truck.fuelCapacity
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
        
            BlinkerLeftActive = truck.blinkerLeftActive
            BlinkerRightActive = truck.blinkerRightActive
            BlinkerLeftOn = truck.blinkerLeftOn
            BlinkerRightOn = truck.blinkerRightOn
            HazardLightsOn = false
        
            LightsDashboardValue = truck.lightsDashboardValue
            LightsDashboardOn = truck.lightsDashboardOn
            LightsParkingOn = truck.lightsParkingOn
            LightsBeamLowOn = truck.lightsBeamLowOn
            LightsBeamHighOn = truck.lightsBeamHighOn
            LightsAuxFrontOn = truck.lightsAuxFrontOn
            LightsAuxRoofOn = truck.lightsAuxRoofOn
            LightsBeaconOn = truck.lightsBeaconOn
            LightsBrakeOn = truck.lightsBrakeOn
            LightsReverseOn = truck.lightsReverseOn

            location = userconfig.Basics.unit


            // Script
            
            if(Constructor !== ConstructorOld) {
                ConstructorOld = Constructor

                var data = {
                    id: "Nybo.ETS2.Dashboard.Truck_Make",
                    value: `${Constructor}`
                }

                states.push(data)
            }

            if(Model !== ModelOld) {
                ModelOld = Model

                var data = {
                    id: "Nybo.ETS2.Dashboard.Model",
                    value: `${Model}`
                }

                states.push(data)
            }

            if(CruiseControlSpeed !== CruiseControlSpeedOld) {
                CruiseControlSpeedOld = CruiseControlSpeed

                if(location === "imperial") {
                    CruiseControlSpeed = Math.floor(CruiseControlSpeed / 1.609344)
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.CruiseControlSpeed",
                    value: `${CruiseControlSpeed}`
                }

                states.push(data)
            }

            if(CruiseControlOn !== CruiseControlOnOld) {
                CruiseControlOnOld = CruiseControlOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.CruiseControlOn",
                    value: `${CruiseControlOn}`
                }

                states.push(data)
            }

            if(Speed !== SpeedOld) {
                SpeedOld = Speed

                if(location === "imperial") {
                    Speed = Math.floor(Speed / 1.609344)
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.Speed",
                    value: `${Speed}`
                }

                states.push(data)
            }

            if(EngineRPM !== EngineRPMOld) {
                EngineRPMOld = EngineRPM

                var data = {
                    id: "Nybo.ETS2.Dashboard.EngineRPM",
                    value: `${EngineRPM}`
                }

                states.push(data)
            }

            if(Gear !== GearOld || ShifterType !== ShifterTypeOld) {
                GearOld = Gear
                ShifterTypeOld = ShifterType

                Gear = await getGear(Gear, ShifterType)

                var data = {
                    id: "Nybo.ETS2.Dashboard.Gear",
                    value: `${Gear}`
                }

                states.push(data)
            }
        
            if(EngineOn !== EngineOnOld) {
                EngineOnOld = EngineOn

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.EngineOn",
                        value: `${EngineOn}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_EngineOn",
                        value: `${EngineOn}`
                    }
                ]
                
                states.push(data)
            }
            
            if(ElectricOn !== ElectricOnOld) {
                ElectricOnOld = ElectricOn

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.ElectricOn",
                        value: `${ElectricOn}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_ElectricOn",
                        value: `${ElectricOn}`
                    }
                ]
                    

                states.push(data)
            }
            
            if(WipersOn !== WipersOnOld) {
                WipersOnOld = WipersOn

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.WipersON",
                        value: `${WipersOn}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_WipersOn",
                        value: `${WipersOn}`
                    }
                ]

                states.push(data)
            }

            if(ParkBrakeOn !== ParkBrakeOnOld) {
                ParkBrakeOnOld = ParkBrakeOn

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.ParkBrakeOn",
                        value: `${ParkBrakeOn}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_ParkBrakeOn",
                        value: `${ParkBrakeOn}`
                    }
                ]                    

                states.push(data)
            }

            if(MotorBrakeOn !== MotorBrakeOnOld) {
                MotorBrakeOnOld = MotorBrakeOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.MotorBrakeOn",
                    value: `${MotorBrakeOn}`
                }

                states.push(data)
            }

            if(Fuel !== FuelOld) {
                FuelOld = Fuel

                var data = {
                    id: "Nybo.ETS2.Dashboard.Fuel",
                    value: `${Fuel}`
                }

                states.push(data)
            }

            if(FuelCapacity !== FuelCapacityOld) {
                FuelCapacityOld = FuelCapacity

                FuelCapacity = Math.round(FuelCapacity)

                var data = {
                    id: "Nybo.ETS2.Dashboard.FuelCapacity",
                    value: `${FuelCapacity}`
                }

                states.push(data)
            }

            if(AdBlue !== AdBlueOld) {
                AdBlueOld = AdBlue

                var data = {
                    id: "Nybo.ETS2.Dashboard.AdBlue",
                    value: `${AdBlue}`
                }

                states.push(data)
            }

            if(AirPressure !== AirPressureOld) {
                AirPressureOld = AirPressure

                var data = {
                    id: "Nybo.ETS2.Dashboard.AirPressure",
                    value: `${AirPressure}`
                }

                states.push(data)
            }

            if(OilTemp !== OilTempOld) {
                OilTempOld = OilTemp

                if(location === "imperial") {
                    OilTemp = Math.floor(OilTemp * 9/5) + 32
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.OilTemp",
                    value: `${OilTemp}`
                }

                states.push(data)
            }

            if(WaterTemp !== WaterTempOld) {
                WaterTempOld = WaterTemp

                if(location === "imperial") {
                    WaterTemp = Math.floor(WaterTemp * 9/5) + 32
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.WaterTemp",
                    value: `${WaterTemp}`
                }

                states.push(data)
            }

            if(BatteryVoltage !== BatteryVoltageOld) {
                BatteryVoltageOld = BatteryVoltage

                var data = {
                    id: "Nybo.ETS2.Dashboard.BatteryVoltage",
                    value: `${BatteryVoltage}`
                }

                states.push(data)
            }

            if(FuelWarningOn !== FuelWarningOnOld) {
                FuelWarningOnOld = FuelWarningOn

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.FuelWarningOn",
                        value: `${FuelWarningOn}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_FuelWarningOn",
                        value: `${FuelWarningOn}`
                    }
                ]
                    

                states.push(data)
            }
                
            if(AdBlueWarningOn !== AdBlueWarningOnOld) {
                AdBlueWarningOnOld = AdBlueWarningOn

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.AdBlueWarningOn",
                        value: `${AdBlueWarningOn}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_AdBlueWarningOn",
                        value: `${AdBlueWarningOn}`
                    }
                ]                    

                states.push(data)
            }
                
            if(AirPressureWarningOn !== AirPressureWarningOnOld) {
                AirPressureWarningOnOld = AirPressureWarningOn

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.AirPressureWarningOn",
                        value: `${AirPressureWarningOn}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_AirPressureWarningOn",
                        value: `${AirPressureWarningOn}`
                    }
                ]                    

                states.push(data)
            }
                
            if(AirPressureEmergencyOn !== AirPressureEmergencyOnOld) {
                AirPressureEmergencyOnOld = AirPressureEmergencyOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.AirPressureEmergencyOn",
                    value: `${AirPressureEmergencyOn}`
                }

                states.push(data)
            }
                
            if(OilPressureWarningOn !== OilPressureWarningOnOld) {
                OilPressureWarningOnOld = OilPressureWarningOn

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.OilPressureWarningOn",
                        value: `${OilPressureWarningOn}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_OilPressureWarningOn",
                        value: `${OilPressureWarningOn}`
                    }
                ]
                    

                states.push(data)
            }
        
            if(WaterTempWarningOn !== WaterTempWarningOnOld) {
                WaterTempWarningOnOld = WaterTempWarningOn

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.WaterTempWarningOn",
                        value: `${WaterTempWarningOn}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_WaterTempWarningOn",
                        value: `${WaterTempWarningOn}`
                    }
                ]
                    

                states.push(data)
            }

            if(BatteryVoltageWarningOn !== BatteryVoltageWarningOnOld) {
                BatteryVoltageWarningOnOld = BatteryVoltageWarningOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.BatteryVoltageWarningOn",
                    value: `${BatteryVoltageWarningOn}`
                }

                states.push(data)
            }


            // Indicator
            if(BlinkerLeftActive !== BlinkerLeftActiveOld) {
                BlinkerLeftActiveOld = BlinkerLeftActive

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.BlinkerLeftActive",
                        value: `${BlinkerLeftActive}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_BlinkerLeftActive",
                        value: `${BlinkerLeftActive}`
                    }
                ]

                states.push(data)
            } 

            if(BlinkerRightActive !== BlinkerRightActiveOld) {
                BlinkerRightActiveOld = BlinkerRightActive

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.BlinkerRightActive",
                        value: `${BlinkerRightActive}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_BlinkerRightActive",
                        value: `${BlinkerRightActive}`
                    }
                ]                    

                states.push(data)
            } 

            if(BlinkerLeftOn !== BlinkerLeftOnOld) {
                BlinkerLeftOnOld = BlinkerLeftOn

                var data ={
                        id: "Nybo.ETS2.Dashboard.BlinkerLeftOn",
                        value: `${BlinkerLeftOn}`
                    }

                states.push(data)
            }
            
            if(BlinkerRightOn !== BlinkerRightOnOld) {
                BlinkerRightOnOld = BlinkerRightOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.BlinkerRightOn",
                        value: `${BlinkerRightOn}`
                    }                

                states.push(data)
            }

            if (BlinkerLeftOn && BlinkerRightOn) {
                HazardLightsOn = true
                HazardLightsCounter = 1
            }
            if (HazardLightsCounter < 5) {
                HazardLightsCounter = Math.floor(HazardLightsCounter + 1)
            } else {
                HazardLightsOn = false
            }

            if(HazardLightsOn !== HazardLightsOnOld) {
                HazardLightsOnOld = HazardLightsOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.event_HazardLightsOn",
                    value: `${HazardLightsOn}`
                }

                states.push(data)
            }
        

            // Lights
            if(LightsDashboardValue !== LightsDashboardValueOld) {
                LightsDashboardValueOld = LightsDashboardValue

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsDashboardValue",
                    value: `${LightsDashboardValue}`
                }

                states.push(data)
            }

            if(LightsDashboardOn !== LightsDashboardOnOld) {
                LightsDashboardOnOld = LightsDashboardOn 

                var data = [
                    {
                        id: "Nybo.ETS2.Dashboard.LightsDashboardOn",
                        value: `${LightsDashboardOn}`
                    },
                    {
                        id: "Nybo.ETS2.Dashboard.event_LightsDashboardOn",
                        value: `${LightsDashboardOn}`
                    }
                ]                   

                states.push(data)
            }

            if(LightsParkingOn !== LightsParkingOnOld) {
                LightsParkingOnOld = LightsParkingOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsParkingOn",
                    value: `${LightsParkingOn}`
                }

                states.push(data)
            }

            if(LightsBeamLowOn !== LightsBeamLowOnOld) {
                LightsBeamLowOnOld = LightsBeamLowOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsBeamLowOn",
                    value: `${LightsBeamLowOn}`
                }

                states.push(data)
            }

            if(LightsBeamHighOn !== LightsBeamHighOnOld) {
                LightsBeamHighOnOld = LightsBeamHighOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsBeamHighOn",
                    value: `${LightsBeamHighOn}`
                }

                states.push(data)
            }

            if(LightsAuxFrontOn !== LightsAuxFrontOnOld) {
                LightsAuxFrontOnOld = LightsAuxFrontOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsAuxFrontOn",
                    value: `${LightsAuxFrontOn}`
                }

                states.push(data)
            }

            if(LightsAuxRoofOn !== LightsAuxRoofOnOld) {
                LightsAuxRoofOnOld = LightsAuxRoofOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsAuxRoofOn",
                    value: `${LightsAuxRoofOn}`
                }

                states.push(data)
            }

            if(LightsBeaconOn !== LightsBeaconOnOld) {
                LightsBeaconOnOld = LightsBeaconOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsBeaconOn",
                    value: `${LightsBeaconOn}`
                }

                states.push(data)
            }

            if(LightsBrakeOn !== LightsBrakeOnOld) {
                LightsBrakeOnOld = LightsBrakeOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsBrakeOn",
                    value: `${LightsBrakeOn}`
                }

                states.push(data)
            }

            if(LightsReverseOn !== LightsReverseOnOld) {
                LightsReverseOnOld = LightsReverseOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsReverseOn",
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
    
            try {
                if(states.length > 0) {
                    TPClient.stateUpdateMany(states);
                }
            } catch (error) {
                logIt("ERROR", `${moduleName}States Error: ${error}`)
                logIt("ERROR", `${moduleName}States Error. Retry in 3 Seconds`)
            }
		}
	}

	configloop()
	moduleloop()	
}
module.exports = truckStates