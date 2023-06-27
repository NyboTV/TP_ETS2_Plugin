// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json') 

const trailerStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig, plugin_settings) => {
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    let trailer = ""
    let cargo = ""

    let TrailerAttached = ""
    let TrailerAttachedOld = ""

    let TrailerName = ""
    let TrailerNameOld = ""

    let TrailerChainType = ""
    let TrailerChainTypeOld = ""

    let Cargo = ""
    let CargoOld = ""

    let CargoID = ""
    let CargoIDOld = ""
    
    let CargoLoaded = ""
    let CargoLoadedOld = ""

    let CargoType = ""
    let CargoTypeOld = ""

    let CargoDamage = ""
    let CargoDamageOld = ""

    let CargoMass = ""
    let CargoMassOld = ""

    let wear = ""
    let wearOld = ""
    
    let wearWheels = ""
    let wearWheelsOld = ""

    let wearChassis = ""
    let wearChassisOld = ""

    let unit = ""

    let weight = ""
    let weightOld = ""

    var states = []

    var offline = false

    // Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    var telemetry = new sJSON(`${telemetry_path}/tmp.json`)

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(500), configLoop++) {
            if(module.Modules.trailerStates === false) {
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
    
            if(ModuleLoaded === false) { 
                states = []
                if(offline === false) {
                    states = [
                        {
                        id: "Nybo.ETS2.Trailer.TrailerAttached",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Trailer.TrailerName",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Trailer.TrailerChainType",
                        value: `MODULE OFFLINE` 
                        },
                        
                        {
                        id: "Nybo.ETS2.Trailer.Cargo",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Trailer.CargoID",
                        value: `MODULE OFFLINE` 
                        },

                        {
                        id: "Nybo.ETS2.Trailer.CargoLoaded",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Trailer.CargoType",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Trailer.CargoDamage",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Trailer.CargoMass",
                        value: `MODULE OFFLINE` 
                        },

                        {
                        id: "Nybo.ETS2.Trailer.Wear",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Trailer.wearWheels",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Trailer.wearChassis",
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
            trailer = telemetry.trailer
            cargo = telemetry.cargo

            unit = userconfig.Basics.unit
            unit = unit.toLowerCase()

            weight = userconfig.Basics.weight

            TrailerAttached = trailer.attached
            TrailerName = trailer.name
            TrailerChainType = trailer.chainType

            Cargo = cargo.cargo
            CargoID = cargo.cargoId
        
            CargoType = trailer.cargo
            CargoLoaded = cargo.cargoLoaded
            CargoDamage = cargo.damage
            CargoMass = cargo.mass

            wear = trailer.wear
            wearWheels = trailer.wearWheels
            wearChassis = trailer.wearChassis

        
            if(TrailerAttached !== TrailerAttachedOld || offline === true) {
                TrailerAttachedOld = TrailerAttached

                var data = {
                    id: "Nybo.ETS2.Trailer.TrailerAttached",
                    value: `${TrailerAttached}`
                }

                states.push(data)
            }

            if(TrailerName !== TrailerNameOld || offline === true) {
                TrailerNameOld = TrailerName

                var data ={
                    id: "Nybo.ETS2.Trailer.TrailerName",
                    value: `${TrailerName}`
                }

                states.push(data)
            }

            if(TrailerChainType !== TrailerChainTypeOld || offline === true) {
                TrailerChainTypeOld = TrailerChainType

                var data = {
                    id: "Nybo.ETS2.Trailer.TrailerChainType",
                    value: `${TrailerChainType}`
                }
                
                states.push(data)
            }

            if(Cargo !== CargoOld || offline === true) {
                CargoOld = Cargo

                var data = {
                    id: "Nybo.ETS2.Trailer.Cargo",
                    value: `${Cargo}`
                }

                states.push(data)
            }

            if(CargoID !== CargoIDOld || offline === true) {
                CargoIDOld = CargoID

                var data = {
                    id: "Nybo.ETS2.Trailer.CargoID",
                    value: `${CargoID}`
                }

                states.push(data)
            }

            if(CargoLoaded !== CargoLoadedOld || offline === true) {
                CargoLoadedOld = CargoLoaded

                var data = {
                    id: "Nybo.ETS2.Trailer.CargoLoaded",
                    value: `${CargoLoaded}`
                }

                states.push(data)
            }

            if(CargoType !== CargoTypeOld || offline === true) {
                CargoTypeOld = CargoType

                var data = {
                    id: "Nybo.ETS2.Trailer.CargoType",
                    value: `${CargoType}`
                }

                states.push(data)
            }

            if(CargoDamage !== CargoDamageOld || offline === true) {
                CargoDamageOld = CargoDamage

                CargoDamage = Math.round(CargoDamage*100)

                var data = {
                    id: "Nybo.ETS2.Trailer.CargoDamage",
                    value: `${CargoDamage}%`
                }

                states.push(data)
            }
        
            if(CargoMass !== CargoMassOld || weight !== weightOld || offline === true) {

                CargoMassOld = CargoMass

                switch (weight) {
                    case 0:
                        CargoMass = Math.round(Math.floor(cargo.mass / 1000))
                        weight = "Tons"
                    break

                    case 1:
                        CargoMass = Math.round(Math.floor(cargo.mass / 1000 * 1.102311))
                        weight = "US Tons"
                    break

                    case 2:
                        CargoMass = Math.round(Math.floor(cargo.mass / 1000 * 0.9843065))
                        weight = "UK Tons"
                    break

                    case 3: 
                        CargoMass = Math.round(Math.floor(cargo.mass / 1000 * 2204.6226))
                        weight = "Pounds"
                    break

                    default:
                        CargoMass = "ERROR"
                    break
                }

                var data = {
                    id: "Nybo.ETS2.Trailer.CargoMass",
                    value: `${CargoMass} ${weight}`
                }

                states.push(data)
            }

            if(wear !== wearOld || offline === true) {
                wearOld = wear

                wear = Math.round(wear*100)

                var data = {
                    id: "Nybo.ETS2.Trailer.Wear",
                    value: `${wear}%`
                }

                states.push(data)
            }

            if(wearChassis !== wearChassisOld || offline === true) {
                wearChassisOld = wearChassis

                wearChassis = Math.round(wearChassis*100)

                var data = {
                    id: "Nybo.ETS2.Trailer.wearChassis",
                    value: `${wearChassis}%`
                }

                states.push(data)
            }

            if(wearWheels !== wearWheelsOld || offline === true) {
                wearWheelsOld = wearWheels

                wearWheels = Math.round(wearWheels*100)

                var data = {
                    id: "Nybo.ETS2.Trailer.wearWheels",
                    value: `${wearWheels}%`
                }

                states.push(data)
            }
        
            offline = false

            weightOld = weight


                    
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
module.exports = trailerStates