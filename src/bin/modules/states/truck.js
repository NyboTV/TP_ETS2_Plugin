const truckStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    // Loading Module
    const fs = require('fs')
    const sJSON = require('self-reload-json') 
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    let truck = ""

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
                    
            // Vars
            truck = telemetry.truck
        
            let HazardLightsCounter = ""
            let CargoLoaded = ""
            let TrailerAttached = ""
        
            let Constructor = truck.make
            let Model = truck.model
        
            let	CruiseControlSpeed = truck.cruiseControlSpeed
            let	CruiseControlOn = truck.cruiseControlOn
        
            let	ShifterType = truck.shifterType
            let	Gear = truck.displayedGear
        
            let	Speed = Math.round(truck.speed)
            let	EngineRPM = Math.round(truck.engineRpm)
            Gear = await getGear(Gear, ShifterType)
        
            let	EngineOn = truck.engineOn
            let	ElectricOn = truck.electricOn
            let	WipersOn = truck.wipersOn
            let	ParkBrakeOn = truck.parkBrakeOn
            let	MotorBrakeOn = truck.motorBrakeOn
        
            let	Fuel = Math.round(truck.fuel)
            let	AdBlue = Math.round(truck.adblue)
            let	AirPressure = Math.round(truck.airPressure)
            let	OilTemp = Math.round(truck.oilTemperature)
            let	WaterTemp = Math.round(truck.waterTemperature)
            let	BatteryVoltage = Math.round(truck.batteryVoltage)
        
            let	FuelCapacity = Math.round(truck.fuelCapacity)
        
            let	FuelWarningOn = truck.fuelWarningOn
            let	AdBlueWarningOn = truck.adblueWarningOn
            let	AirPressureWarningOn = truck.airPressureWarningOn
            let	AirPressureEmergencyOn = truck.airPressureEmergencyOn
            let	OilPressureWarningOn = truck.oilPressureWarningOn
            let	WaterTempWarningOn = truck.waterTemperatureWarningOn
            let	BatteryVoltageWarningOn = truck.batteryVoltageWarningOn
        
            let	BlinkerLeftActive = truck.blinkerLeftActive
            let	BlinkerRightActive = truck.blinkerRightActive
            let	BlinkerLeftOn = truck.blinkerLeftOn
            let	BlinkerRightOn = truck.blinkerRightOn
            let HazardLightsOn = ""
        
            let	LightsDashboardValue = truck.lightsDashboardValue
            let	LightsDashboardOn = truck.lightsDashboardOn
            let	LightsParkingOn = truck.lightsParkingOn
            let	LightsBeamLowOn = truck.lightsBeamLowOn
            let	LightsBeamHighOn = truck.lightsBeamHighOn
            let	LightsAuxFrontOn = truck.lightsAuxFrontOn
            let	LightsAuxRoofOn = truck.lightsAuxRoofOn
            let	LightsBeaconOn = truck.lightsBeaconOn
            let	LightsBrakeOn = truck.lightsBrakeOn
            let	LightsReverseOn = truck.lightsReverseOn

            
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
        
            // Event Area
            
            if(EngineOn === true) {
                EngineOn = "on"
            } else {
                EngineOn = "off"
            } 
            if(ElectricOn === true) {
                ElectricOn = "on"
            } else {
                ElectricOn = "off"
            }
            if(WipersOn === true) {
                WipersOn = "on"
            } else {
                WipersOn = "off"
            }
            
            if(ParkBrakeOn === true) {
                ParkBrakeOn = "on"
            } else {
                ParkBrakeOn = "off"
            }
            
            if(FuelWarningOn === true) {
                FuelWarningOn = "on"
            } else {
                FuelWarningOn = "off"
            }
            if(AdBlueWarningOn === true) {
                AdBlueWarningOn = "on"
            } else {
                AdBlueWarningOn = "off" 
            }
            
            if(AirPressureWarningOn === true) {
                AirPressureWarningOn = "low"
            } else if(AirPressureEmergencyOn === true) {
                AirPressureWarningOn = "emergency"
            } else {
                AirPressureWarningOn = "high"
            }
            if(OilPressureWarningOn === true) {
                OilPressureWarningOn = "low"
            } else {
                OilPressureWarningOn = "high"
            }
            if(WaterTempWarningOn === true) {
                WaterTempWarningOn = "high"
            } else {
                WaterTempWarningOn = "low"
            }
            if(BatteryVoltageWarningOn === true) {
                BatteryVoltageWarningOn = "low"
            } else {
                BatteryVoltageWarningOn = "high"
            }
            
            if(BlinkerLeftOn === true) {
                BlinkerLeftOn = "on"
            } else {
                BlinkerLeftOn = "off"
            }
            if(BlinkerRightOn === true) {
                BlinkerRightOn = "on"
            } else {
                BlinkerRightOn = "off"
            }
            if(HazardLightsOn === true) {
                HazardLightsOn = "on"
            } else {
                HazardLightsOn = "off"
            }
            
            if(LightsDashboardOn === true) {
                LightsDashboardOn = "on"
            } else {
                LightsDashboardOn = "off"
            }
            
            if(TrailerAttached === true) {
                TrailerAttached = "attached"
            } else {
                TrailerAttached = "off"
            }
            
            if(CargoLoaded === true) {
                CargoLoaded = "loaded" 
            } else {
                CargoLoaded = "off"
            }
            
            // Module Stuff
            var states = [
                {
                    id: "Nybo.ETS2.Dashboard.Truck_Make",
                    value: `${Constructor}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.Model",
                    value: `${Model}`
                },
        
                {
                    id: "Nybo.ETS2.Dashboard.CruiseControlSpeed",
                    value: `${CruiseControlSpeed}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.CruiseControlOn",
                    value: `${CruiseControlOn}`
                },
        
                {
                    id: "Nybo.ETS2.Dashboard.Speed",
                    value: `${Speed}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.EngineRPM",
                    value: `${EngineRPM}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.Gear",
                    value: `${Gear}`
                },
        
                {
                    id: "Nybo.ETS2.Dashboard.EngineOn",
                    value: `${EngineOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.ElectricOn",
                    value: `${ElectricOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.WipersON",
                    value: `${WipersOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.ParkBrakeOn",
                    value: `${ParkBrakeOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.MotorBrakeOn",
                    value: `${MotorBrakeOn}`
                },
        
                {
                    id: "Nybo.ETS2.Dashboard.Fuel",
                    value: `${Fuel}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.AdBlue",
                    value: `${AdBlue}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.AirPressure",
                    value: `${AirPressure}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.OilTemp",
                    value: `${OilTemp}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.WaterTemp",
                    value: `${WaterTemp}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.BatteryVoltage",
                    value: `${BatteryVoltage}`
                },
        
                {
                    id: "Nybo.ETS2.Dashboard.FuelCapacity",
                    value: `${FuelCapacity}`
                },
        
                {
                    id: "Nybo.ETS2.Dashboard.FuelWarningOn",
                    value: `${FuelWarningOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.AdBlueWarningOn",
                    value: `${AdBlueWarningOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.AirPressureWarningOn",
                    value: `${AirPressureWarningOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.AirPressureEmergencyOn",
                    value: `${AirPressureEmergencyOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.OilPressureWarningOn",
                    value: `${OilPressureWarningOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.WaterTempWarningOn",
                    value: `${WaterTempWarningOn}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.BatteryVoltageWarningOn",
                    value: `${BatteryVoltageWarningOn}`
                },
        
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
                {
                    id: "Nybo.ETS2.Dashboard.event_TrailerAttached",
                    value: `${TrailerAttached}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.event_CargoLoaded",
                    value: `${CargoLoaded}`
                },
            ]
        
            try {
                TPClient.stateUpdateMany(states);
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