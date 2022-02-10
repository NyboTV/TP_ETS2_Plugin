const truckStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    // Loading Module
    const fs = require('fs')
    const sJSON = require('self-reload-json') 
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

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

    let	BlinkerLeftActive = ""
    let	BlinkerRightActive = ""
    let	BlinkerLeftOn = ""
    let	BlinkerRightOn = ""
    let HazardLightsOn = ""

    let	LightsDashboardValue = ""
    let	LightsDashboardOn = ""
    let	LightsParkingOn = ""
    let	LightsBeamLowOn = ""
    let	LightsBeamHighOn = ""
    let	LightsAuxFrontOn = ""
    let	LightsAuxRoofOn = ""
    let	LightsBeaconOn = ""
    let	LightsBrakeOn = ""
    let	LightsReverseOn = ""

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
            
            Speed = truck.speed
            EngineRPM = truck.engineRpm

            ShifterType = truck.shifterType
            Gear = truck.displayedGear
        
            EngineOn = truck.engineOn
            ElectricOn = truck.electricOn
            WipersOn = truck.wipersOn

            ParkBrakeOn = truck.parkBrakeOn
            MotorBrakeOn = truck.motorBrakeOn

            Fuel = truck.fuel
            FuelCapacity = truck.fuelCapacity
            AdBlue = truck.adblue

            AirPressure = truck.airPressure
            OilTemp = truck.oilTemperature
            WaterTemp = truck.waterTemperature
            BatteryVoltage = truck.batteryVoltage

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
            HazardLightsOn = ""
        
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

                Speed = Math.round(Speed)

                var data = {
                    id: "Nybo.ETS2.Dashboard.Speed",
                    value: `${Speed}`
                }

                states.push(data)
            }

            if(EngineRPM !== EngineRPMOld) {
                EngineRPMOld = EngineRPM

                EngineRPM = Math.round(EngineRPM)

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

                var data = {
                    id: "Nybo.ETS2.Dashboard.EngineOn",
                    value: `${EngineOn}`
                }

                states.push(data)
            }
            
            if(ElectricOn !== ElectricOnOld) {
                ElectricOnOld = ElectricOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.ElectricOn",
                    value: `${ElectricOn}`
                }

                states.push(data)
            }
            
            if(WipersOn !== WipersOnOld) {
                WipersOnOld = WipersOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.WipersON",
                    value: `${WipersOn}`
                }

                states.push(data)
            }

            if(ParkBrakeOn !== ParkBrakeOnOld) {
                ParkBrakeOnOld = ParkBrakeOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.ParkBrakeOn",
                    value: `${ParkBrakeOn}`
                }

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

                Fuel = Math.round(Fuel * 100) / 100

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

                AdBlue = Math.round(AdBlue)

                var data = {
                    id: "Nybo.ETS2.Dashboard.AdBlue",
                    value: `${AdBlue}`
                }

                states.push(data)
            }

            if(AirPressure !== AirPressureOld) {
                AirPressureOld = AirPressure
                
                AirPressure = Math.round(AirPressure)

                var data = {
                    id: "Nybo.ETS2.Dashboard.AirPressure",
                    value: `${AirPressure}`
                }

                states.push(data)
            }

            if(OilTemp !== OilTempOld) {
                OilTempOld = OilTemp

                OilTemp = Math.round(OilTemp)

                var data = {
                    id: "Nybo.ETS2.Dashboard.OilTemp",
                    value: `${OilTemp}`
                }

                states.push(data)
            }

            if(WaterTemp !== WaterTempOld) {
                WaterTempOld = WaterTemp

                WaterTemp = Math.round(WaterTemp)

                var data = {
                    id: "Nybo.ETS2.Dashboard.WaterTemp",
                    value: `${WaterTemp}`
                }

                states.push(data)
            }

            if(BatteryVoltage !== BatteryVoltageOld) {
                BatteryVoltageOld = BatteryVoltage

                BatteryVoltage = Math.round(BatteryVoltage)

                var data = {
                    id: "Nybo.ETS2.Dashboard.BatteryVoltage",
                    value: `${BatteryVoltage}`
                }

                states.push(data)
            }

            if(FuelWarningOn !== FuelWarningOnOld) {
                FuelWarningOnOld = FuelWarningOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.FuelWarningOn",
                    value: `${FuelWarningOn}`
                }

                states.push(data)
            }
                
            if(AdBlueWarningOn !== AdBlueWarningOnOld) {
                AdBlueWarningOnOld = AdBlueWarningOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.AdBlueWarningOn",
                    value: `${AdBlueWarningOn}`
                }

                states.push(data)
            }
                
            if(AirPressureWarningOn !== AirPressureWarningOnOld) {
                AirPressureWarningOnOld = AirPressureWarningOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.AirPressureWarningOn",
                    value: `${AirPressureWarningOn}`
                }

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

                var data = {
                    id: "Nybo.ETS2.Dashboard.OilPressureWarningOn",
                    value: `${OilPressureWarningOn}`
                }

                states.push(data)
            }
        
            if(WaterTempWarningOn !== WaterTempWarningOnOld) {
                WaterTempWarningOnOld = WaterTempWarningOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.WaterTempWarningOn",
                    value: `${WaterTempWarningOn}`
                }

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


            /* 
            STUCK ON BLINKER!!

            Testen ob die Blinker bei Aktivierung "Active" oder "on" zeigen. Danach weiter die abfrage bauen ob sich was geändert hat.

            Danach TESTEN!!
            */

        
            BlinkerLeftActive = truck.blinkerLeftActive
            BlinkerRightActive = truck.blinkerRightActive
            BlinkerLeftOn = truck.blinkerLeftOn
            BlinkerRightOn = truck.blinkerRightOn
            HazardLightsOn = ""

            console.log("ACTIVE               ON")
            console.log([
                BlinkerLeftActive,
                BlinkerRightActive,
                "",
                BlinkerLeftOn,
                BlinkerRightOn
            ])
        
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
        
        
            if (BlinkerLeftOn && BlinkerRightOn) {
                HazardLightsOn = true
                HazardLightsCounter = 1
            }
            
            if (HazardLightsCounter < 5) {
                HazardLightsCounter = Math.floor(HazardLightsCounter + 1)
            } else {
                HazardLightsOn = false
            }
        


            if(AirPressureWarningOn === true) {
                AirPressureWarningOn = "low"
            } else if(AirPressureEmergencyOn === true) {
                AirPressureWarningOn = "emergency"
            } else {
                AirPressureWarningOn = "high"
            }
            
            /*
                ,
        
                {
                    id: "Nybo.ETS2.Dashboard.BlinkerLeftActive",
                    value: `${BlinkerLeftActive}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.BlinkerRightActive",
                    value: `${BlinkerRightActive}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.BlinkerLeftOn",
                    value: `${BlinkerLeftOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.BlinkerRightOn",
                    value: `${BlinkerRightOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.HazardLightsOn",
                    value: `${HazardLightsOn}`
                },
        
                {
                    id: "Nybo.ETS2.Dashboard.LightsDashboardValue",
                    value: `${LightsDashboardValue}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.LightsDashboardOn",
                    value: `${LightsDashboardOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.LightsParkingOn",
                    value: `${LightsParkingOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.LightsBeamLowOn",
                    value: `${LightsBeamLowOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.LightsBeamHighOn",
                    value: `${LightsBeamHighOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.LightsAuxFrontOn",
                    value: `${LightsAuxFrontOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.LightsAuxRoofOn",
                    value: `${LightsAuxRoofOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.LightsBeaconOn",
                    value: `${LightsBeaconOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.LightsBrakeOn",
                    value: `${LightsBrakeOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.LightsReverseOn",
                    value: `${LightsReverseOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_EngineOn",
                    value: `${EngineOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_ElectricOn",
                    value: `${ElectricOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_WipersOn",
                    value: `${WipersOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_ParkBrakeOn",
                    value: `${ParkBrakeOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_FuelWarningOn",
                    value: `${FuelWarningOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_AdBlueWarningOn",
                    value: `${AdBlueWarningOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_AirPressureWarningOn",
                    value: `${AirPressureWarningOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_OilPressureWarningOn",
                    value: `${OilPressureWarningOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_WaterTempWarningOn",
                    value: `${WaterTempWarningOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_BlinkerLeftOn",
                    value: `${BlinkerLeftOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_BlinkerRightOn",
                    value: `${BlinkerRightOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_HazardLightsOn",
                    value: `${HazardLightsOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_LightsDashboardOn",
                    value: `${LightsDashboardOn}`
                },
                */
            
    
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