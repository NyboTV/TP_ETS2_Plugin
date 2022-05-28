// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json') 

const truckStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    let unit = ""
    let unitOld = ""

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

    var offline = false

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
                states = []
                if(offline === false) {
                    states = [
                        {
                        id: "Nybo.ETS2.Dashboard.Truck_Make",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.Model",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.CruiseControlSpeed",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.CruiseControlOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.Speed",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.EngineRPM",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.Gear",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.EngineOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.ElectricOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.WipersOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.ParkBrakeOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.MotorBrakeOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.Fuel",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.AdBlue",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.AirPressure",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.OilTemp",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.WaterTemp",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.BatteryVoltage",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.FuelCapacity",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.FuelWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.AdBlueWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.AirPressureWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.AirPressureEmergencyOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.OilPressureWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.WaterTempWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.BatteryVoltageWarningOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.BlinkerLeftActive",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.BlinkerRightActive",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.BlinkerLeftOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.BlinkerRightOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.HazardLightsOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.LightsDashboardValue",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.LightsDashboardOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.LightsParkingOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.LightsBeamLowOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.LightsBeamHighOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.LightsAuxFrontOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.LightsAuxRoofOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.LightsBeaconOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.LightsBrakeOn",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.LightsReverseOn",
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
            
            Speed = Math.round(truck.speed)
            EngineRPM = Math.round(truck.engineRpm)

            ShifterType = truck.shifterType
            Gear = truck.displayedGear
        
            EngineOn = truck.engineOn
            ElectricOn = truck.electricOn
            WipersOn = truck.wipersOn

            ParkBrakeOn = truck.parkBrakeOn
            MotorBrakeOn = truck.motorBrakeOn

            Fuel = Math.round(truck.fuel)
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

            temp = userconfig.Basics.temp
            temp = temp.toLowerCase()


            // Script
            
            if(Constructor !== ConstructorOld || offline === true) {
                ConstructorOld = Constructor

                var data = {
                    id: "Nybo.ETS2.Dashboard.Truck_Make",
                    value: `${Constructor}`
                }

                states.push(data)
            }

            if(Model !== ModelOld || offline === true) {
                ModelOld = Model

                var data = {
                    id: "Nybo.ETS2.Dashboard.Model",
                    value: `${Model}`
                }

                states.push(data)
            }

            if(CruiseControlSpeed !== CruiseControlSpeedOld || unit !== unitOld || offline === true) {
                CruiseControlSpeedOld = CruiseControlSpeed
                unitOld = unit

                if(unit === "miles") {
                    CruiseControlSpeed = Math.floor(CruiseControlSpeed / 1.609344)
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.CruiseControlSpeed",
                    value: `${CruiseControlSpeed}`
                }

                states.push(data)
            }

            if(CruiseControlOn !== CruiseControlOnOld || offline === true) {
                CruiseControlOnOld = CruiseControlOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.CruiseControlOn",
                    value: `${CruiseControlOn}`
                }

                states.push(data)
            }

            if(Speed !== SpeedOld || offline === true) {
                SpeedOld = Speed

                if(unit === "miles") {
                    Speed = Math.floor(Speed / 1.609344)
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.Speed",
                    value: `${Speed}`
                }

                states.push(data)
            }

            if(EngineRPM !== EngineRPMOld || offline === true) {
                EngineRPMOld = EngineRPM

                var data = {
                    id: "Nybo.ETS2.Dashboard.EngineRPM",
                    value: `${EngineRPM}`
                }

                states.push(data)
            }

            if(Gear !== GearOld || ShifterType !== ShifterTypeOld || offline === true) {
                GearOld = Gear
                ShifterTypeOld = ShifterType

                Gear = await getGear(Gear, ShifterType)

                var data = {
                    id: "Nybo.ETS2.Dashboard.Gear",
                    value: `${Gear}`
                }

                states.push(data)
            }
        
            if(EngineOn !== EngineOnOld || offline === true) {
                EngineOnOld = EngineOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.EngineOn",
                        value: `${EngineOn}`
                    }

                var data_event =  {
                        id: "Nybo.ETS2.Dashboard.event_EngineOn",
                        value: `${EngineOn}`
                    }
                
                states.push(data)
                states.push(data_event)
            }
            
            if(ElectricOn !== ElectricOnOld || offline === true) {
                ElectricOnOld = ElectricOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.ElectricOn",
                        value: `${ElectricOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_ElectricOn",
                        value: `${ElectricOn}`
                    }

                states.push(data)
                states.push(data_event)
            }
            
            if(WipersOn !== WipersOnOld || offline === true) {
                WipersOnOld = WipersOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.WipersOn",
                        value: `${WipersOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_WipersOn",
                        value: `${WipersOn}`
                    }

                states.push(data)
                states.push(data_event)
            }

            if(ParkBrakeOn !== ParkBrakeOnOld || offline === true) {
                ParkBrakeOnOld = ParkBrakeOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.ParkBrakeOn",
                        value: `${ParkBrakeOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_ParkBrakeOn",
                        value: `${ParkBrakeOn}`
                    }               

                states.push(data)
                states.push(data_event)
            }

            if(MotorBrakeOn !== MotorBrakeOnOld || offline === true) {
                MotorBrakeOnOld = MotorBrakeOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.MotorBrakeOn",
                    value: `${MotorBrakeOn}`
                }

                states.push(data)
            }

            if(Fuel !== FuelOld || offline === true) {
                FuelOld = Fuel

                var data = {
                    id: "Nybo.ETS2.Dashboard.Fuel",
                    value: `${Fuel}`
                }

                states.push(data)
            }

            if(FuelCapacity !== FuelCapacityOld || offline === true) {
                FuelCapacityOld = FuelCapacity

                FuelCapacity = Math.round(FuelCapacity)

                var data = {
                    id: "Nybo.ETS2.Dashboard.FuelCapacity",
                    value: `${FuelCapacity}`
                }

                states.push(data)
            }

            if(AdBlue !== AdBlueOld || offline === true) {
                AdBlueOld = AdBlue

                var data = {
                    id: "Nybo.ETS2.Dashboard.AdBlue",
                    value: `${AdBlue}`
                }

                states.push(data)
            }

            if(AirPressure !== AirPressureOld || offline === true) {
                AirPressureOld = AirPressure

                var data = {
                    id: "Nybo.ETS2.Dashboard.AirPressure",
                    value: `${AirPressure}`
                }

                states.push(data)
            }

            if(OilTemp !== OilTempOld || offline === true) {
                OilTempOld = OilTemp

                if(unit === "miles") {
                    OilTemp = Math.floor(OilTemp * 9/5) + 32
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.OilTemp",
                    value: `${OilTemp}`
                }

                states.push(data)
            }

            if(WaterTemp !== WaterTempOld || offline === true) {
                WaterTempOld = WaterTemp

                if(temp === "f") {
                    WaterTemp = Math.floor(WaterTemp * 9/5) + 32
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.WaterTemp",
                    value: `${WaterTemp}`
                }

                states.push(data)
            }

            if(BatteryVoltage !== BatteryVoltageOld || offline === true) {
                BatteryVoltageOld = BatteryVoltage

                var data = {
                    id: "Nybo.ETS2.Dashboard.BatteryVoltage",
                    value: `${BatteryVoltage}`
                }

                states.push(data)
            }

            if(FuelWarningOn !== FuelWarningOnOld || offline === true) {
                FuelWarningOnOld = FuelWarningOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.FuelWarningOn",
                        value: `${FuelWarningOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_FuelWarningOn",
                        value: `${FuelWarningOn}`
                    }

                states.push(data)
                states.push(data_event)
            }
                
            if(AdBlueWarningOn !== AdBlueWarningOnOld || offline === true) {
                AdBlueWarningOnOld = AdBlueWarningOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.AdBlueWarningOn",
                        value: `${AdBlueWarningOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_AdBlueWarningOn",
                        value: `${AdBlueWarningOn}`
                    }                 

                states.push(data)
                states.push(data_event)
            }
                
            if(AirPressureWarningOn !== AirPressureWarningOnOld || offline === true) {
                AirPressureWarningOnOld = AirPressureWarningOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.AirPressureWarningOn",
                        value: `${AirPressureWarningOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_AirPressureWarningOn",
                        value: `${AirPressureWarningOn}`
                    }                 

                states.push(data)
                states.push(data_event)
            }
                
            if(AirPressureEmergencyOn !== AirPressureEmergencyOnOld || offline === true) {
                AirPressureEmergencyOnOld = AirPressureEmergencyOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.AirPressureEmergencyOn",
                    value: `${AirPressureEmergencyOn}`
                }

                states.push(data)
            }
                
            if(OilPressureWarningOn !== OilPressureWarningOnOld || offline === true) {
                OilPressureWarningOnOld = OilPressureWarningOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.OilPressureWarningOn",
                        value: `${OilPressureWarningOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_OilPressureWarningOn",
                        value: `${OilPressureWarningOn}`
                    }

                states.push(data)
                states.push(data_event)
            }
        
            if(WaterTempWarningOn !== WaterTempWarningOnOld || offline === true) {
                WaterTempWarningOnOld = WaterTempWarningOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.WaterTempWarningOn",
                        value: `${WaterTempWarningOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_WaterTempWarningOn",
                        value: `${WaterTempWarningOn}`
                    }

                states.push(data)
                states.push(data_event)
            }

            if(BatteryVoltageWarningOn !== BatteryVoltageWarningOnOld || offline === true) {
                BatteryVoltageWarningOnOld = BatteryVoltageWarningOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.BatteryVoltageWarningOn",
                    value: `${BatteryVoltageWarningOn}`
                }

                states.push(data)
            }


            // Indicator
            if(BlinkerLeftActive !== BlinkerLeftActiveOld || offline === true) {
                BlinkerLeftActiveOld = BlinkerLeftActive

                var data = {
                        id: "Nybo.ETS2.Dashboard.BlinkerLeftActive",
                        value: `${BlinkerLeftActive}`
                    }
                
                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_BlinkerLeftActive",
                        value: `${BlinkerLeftActive}`
                    }

                states.push(data)
                states.push(data_event)
            } 

            if(BlinkerRightActive !== BlinkerRightActiveOld || offline === true) {
                BlinkerRightActiveOld = BlinkerRightActive

                var data = {
                        id: "Nybo.ETS2.Dashboard.BlinkerRightActive",
                        value: `${BlinkerRightActive}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_BlinkerRightActive",
                        value: `${BlinkerRightActive}`
                    }               

                states.push(data)
                states.push(data_event)
            } 

            if(BlinkerLeftOn !== BlinkerLeftOnOld || offline === true) {
                BlinkerLeftOnOld = BlinkerLeftOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.BlinkerLeftOn",
                        value: `${BlinkerLeftOn}`
                    }

                states.push(data)
            }
            
            if(BlinkerRightOn !== BlinkerRightOnOld || offline === true) {
                BlinkerRightOnOld = BlinkerRightOn

                var data = {
                        id: "Nybo.ETS2.Dashboard.BlinkerRightOn",
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
                    id: "Nybo.ETS2.Dashboard.HazardLightsOn",
                    value: `${HazardLightsOn}`
                }

                var data_event = {
                    id: "Nybo.ETS2.Dashboard.event_HazardLightsOn",
                    value: `${HazardLightsOn}`
                }

                states.push(data)
                states.push(data_event)
            }
        

            // Lights
            if(LightsDashboardValue !== LightsDashboardValueOld || offline === true) {
                LightsDashboardValueOld = LightsDashboardValue

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsDashboardValue",
                    value: `${LightsDashboardValue}`
                }

                states.push(data)
            }

            if(LightsDashboardOn !== LightsDashboardOnOld || offline === true) {
                LightsDashboardOnOld = LightsDashboardOn 

                var data = {
                        id: "Nybo.ETS2.Dashboard.LightsDashboardOn",
                        value: `${LightsDashboardOn}`
                    }

                var data_event = {
                        id: "Nybo.ETS2.Dashboard.event_LightsDashboardOn",
                        value: `${LightsDashboardOn}`
                    }             

                states.push(data)
                states.push(data_event)
            }

            if(LightsParkingOn !== LightsParkingOnOld || offline === true) {
                LightsParkingOnOld = LightsParkingOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsParkingOn",
                    value: `${LightsParkingOn}`
                }

                states.push(data)
            }

            if(LightsBeamLowOn !== LightsBeamLowOnOld || offline === true) {
                LightsBeamLowOnOld = LightsBeamLowOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsBeamLowOn",
                    value: `${LightsBeamLowOn}`
                }

                states.push(data)
            }

            if(LightsBeamHighOn !== LightsBeamHighOnOld || offline === true) {
                LightsBeamHighOnOld = LightsBeamHighOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsBeamHighOn",
                    value: `${LightsBeamHighOn}`
                }

                states.push(data)
            }

            if(LightsAuxFrontOn !== LightsAuxFrontOnOld || offline === true) {
                LightsAuxFrontOnOld = LightsAuxFrontOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsAuxFrontOn",
                    value: `${LightsAuxFrontOn}`
                }

                states.push(data)
            }

            if(LightsAuxRoofOn !== LightsAuxRoofOnOld || offline === true) {
                LightsAuxRoofOnOld = LightsAuxRoofOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsAuxRoofOn",
                    value: `${LightsAuxRoofOn}`
                }

                states.push(data)
            }

            if(LightsBeaconOn !== LightsBeaconOnOld || offline === true) {
                LightsBeaconOnOld = LightsBeaconOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsBeaconOn",
                    value: `${LightsBeaconOn}`
                }

                states.push(data)
            }

            if(LightsBrakeOn !== LightsBrakeOnOld || offline === true) {
                LightsBrakeOnOld = LightsBrakeOn

                var data = {
                    id: "Nybo.ETS2.Dashboard.LightsBrakeOn",
                    value: `${LightsBrakeOn}`
                }

                states.push(data)
            }

            if(LightsReverseOn !== LightsReverseOnOld || offline === true) {
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
            
            offline = false
    
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