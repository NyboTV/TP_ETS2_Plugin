// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json') 

const trailerStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    let trailer1 = ""
    let cargo = ""

    let TrailerAttached = ""
    let TrailerAttachedOld = ""

    let TrailerName = ""
    let TrailerNameOld = ""

    let TrailerChainType = ""
    let TrailerChainTypeOld = ""
    
    let CargoLoaded = ""
    let CargoLoadedOld = ""

    let CargoType = ""
    let CargoTypeOld = ""

    let CargoDamage = ""
    let CargoDamageOld = ""

    let CargoMass = ""
    let CargoMassOld = ""

    let Weight = ""
    let WeightOld = ""

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
                        id: "Nybo.ETS2.Dashboard.TrailerAttached",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.TrailerName",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.TrailerChainType",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.CargoLoaded",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.CargoType",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.CargoDamage",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.Dashboard.CargoMass",
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
            trailer1 = telemetry.trailer1
            cargo = telemetry.cargo

            unit = userconfig.Basics.unit
            unit = unit.toLowerCase()

            weight = userconfig.Basics.weight
            weight = weight.toLowerCase()

            TrailerAttached = trailer1.attached
            TrailerName = trailer1.name
            TrailerChainType = trailer1.chainType
        
            CargoLoaded = cargo.cargoLoaded
            CargoType = cargo.cargo
            CargoDamage = cargo.damage
            CargoMass = cargo.mass

            if(weight === "tons") {
                Weight = "Pounds"
            } else {
                Weight = "Tons"
            }
        
            if(TrailerAttached !== TrailerAttachedOld || offline === true) {
                TrailerAttachedOld = TrailerAttached

                var data = {
                    id: "Nybo.ETS2.Dashboard.TrailerAttached",
                    value: `${TrailerAttached}`
                }

                states.push(data)
            }

            if(TrailerName !== TrailerNameOld || offline === true) {
                TrailerNameOld = TrailerName

                var data ={
                    id: "Nybo.ETS2.Dashboard.TrailerName",
                    value: `${TrailerName}`
                }

                states.push(data)
            }

            if(TrailerChainType !== TrailerChainTypeOld || offline === true) {
                TrailerChainTypeOld = TrailerChainType

                var data = {
                    id: "Nybo.ETS2.Dashboard.TrailerChainType",
                    value: `${TrailerChainType}`
                }
                
                states.push(data)
            }

            if(CargoLoaded !== CargoLoadedOld || offline === true) {
                CargoLoadedOld = CargoLoaded

                var data = {
                    id: "Nybo.ETS2.Dashboard.CargoLoaded",
                    value: `${CargoLoaded}`
                }

                states.push(data)
            }

            if(CargoType !== CargoTypeOld || offline === true) {
                CargoTypeOld = CargoType

                var data = {
                    id: "Nybo.ETS2.Dashboard.CargoType",
                    value: `${CargoType}`
                }

                states.push(data)
            }

            if(CargoDamage !== CargoDamageOld || offline === true) {
                CargoDamageOld = CargoDamage

                CargoDamage = Math.round(CargoDamage * 100)

                var data = {
                    id: "Nybo.ETS2.Dashboard.CargoDamage",
                    value: `${CargoDamage}`
                }

                states.push(data)
            }
        
            if(CargoMass !== CargoMassOld || Weight !== WeightOld || offline === true) {

                CargoMassOld = CargoMass
                WeightOld = Weight

                if (weight === "tons") {
                    CargoMass = Math.round(Math.floor(cargo.mass / 1000 * 1.102311))
                } else {
                    CargoMass = Math.round(Math.floor(cargo.mass / 1000))
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.CargoMass",
                    value: `${CargoMass} ${Weight}`
                }

                states.push(data)
            }
        
            offline = false
        
            try {
                if(states.length > 0) {
                    TPClient.stateUpdateMany(states);
                }
            } catch (error) {
                logIt("ERROR", `${moduleName}States Error: ${error}`)
                logIt("ERROR", `${moduleName}States Error. Retry...`)
            }
		}
	}
    
	configloop()
	moduleloop()	
}
module.exports = trailerStates