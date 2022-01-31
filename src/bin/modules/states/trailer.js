const fs = require('fs')

const trailerStates = async (TPClient, telemetry_path, logIt, timeout, path) => {
    // Loading Module
    const fs = require('fs')
	const Jimp = require('jimp')
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    async function loop () {

        if(fs.readFileSync(`${path}/config/usercfg.json`).driverStates === false) {
            if(ModuleLoaded === true) { logIt("MODULE", `Module ${moduleName}States unloaded`) }
            ModuleLoaded = false
            return;
        } else if(ModuleLoaded === false) { 
            logIt("MODULE", `Module ${moduleName}States loaded`)
            ModuleLoaded = true 
        }

        // Vars
        var telemetry = fs.readFileSync(`${telemetry_path}/tmp.json`, 'utf8')
        var refreshInterval = fs.readFileSync(`${path}/config/cfg.json`).refreshInterval
    
    
        // Vars
        let trailer1 = telemetry.trailer1
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
            await timeout(refreshInterval)
            loop()
        } catch (error) {
            logIt("ERROR", `${moduleName}States Error: ${error}`)
            logIt("ERROR", `${moduleName}States Error. Retry in 3 Seconds`)
            await timeout(3000)
            loop()
        }
	}
}
module.exports = trailerStates