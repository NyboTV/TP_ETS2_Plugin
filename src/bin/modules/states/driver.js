const driverStates = async (TPClient, telemetry_path, logIt, timeout, path) => {

    // Loading Module
    const fs = require('fs')
    
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
        
        let NextRestStopTime = new Date(telemetry.nextRestStopTime)
        NextRestStopTime = `${NextRestStopTime.getUTCHours()}:${NextRestStopTime.getUTCMinutes()}`
        
        // Module Stuff
        var states = [
            {
                id: "Nybo.ETS2.Dashboard.NextRestTime",
                value: `${NextRestStopTime}`
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
    loop()
}
    
module.exports = driverStates