const trailerStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    // Loading Module
    const fs = require('fs')
    const sJSON = require('self-reload-json') 
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    let trailer1 = ""

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
            } else 
            
            // Vars
            trailer1 = telemetry.trailer1
            let cargo = telemetry.cargo
        
            let Location = userconfig.Basics.location
            let TrailerAttached = trailer1.attached
            let TrailerName = trailer1.name
            let TrailerChainType = trailer1.chainType
        
            let CargoLoaded = cargo.cargoLoaded
            let CargoType = cargo.cargo
            let CargoDamage = Math.round(cargo.damage * 100)
            let CargoMass = ""
        
            if (Location === "mph") {
                CargoMass = Math.round(Math.floor(cargo.mass / 1000 * 1.102311))
            } else {
                CargoMass = Math.round(Math.floor(cargo.mass / 1000))
            }
        
            Weight = userconfig.Basics.Weight
        
            // Module Stuff
            var states = [
                {
                    id: "Nybo.ETS2.Dashboard.TrailerAttached",
                    value: `${TrailerAttached}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.TrailerName",
                    value: `${TrailerName}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.TrailerChainType",
                    value: `${TrailerChainType}`
                },
        
                {
                    id: "Nybo.ETS2.Dashboard.CargoLoaded",
                    value: `${CargoLoaded}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.CargoType",
                    value: `${CargoType}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.CargoDamage",
                    value: `${CargoDamage}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.CargoMass",
                    value: `${CargoMass} ${Weight}`
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
module.exports = trailerStates