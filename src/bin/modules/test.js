const driverStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    // Loading Module
    const fs = require('fs')
    const sJSON = require('self-reload-json')
    
    // Vars
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false
    
    let driver = ""
    let nextRestStopTime = ""
    let NextRestStopTime = ""

    // Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    var telemetry = new sJSON(`${telemetry_path}/tmp.json`)

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(500), configLoop++) {
            if(module.Modules.driverStates === false) {
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
            driver = telemetry.game
            nextRestStopTime = driver.nextRestStopTime

            if(driver.NextRestStopTime === NextRestStopTime) {
            } else

            NextRestStopTime = new Date(nextRestStopTime)
            NextRestStopTime = `${NextRestStopTime.getUTCHours()}:${NextRestStopTime.getUTCMinutes()}`
            
            // Module Stuff 
            var states = [
                {
                    id: "Nybo.ETS2.",
                    value: `${NextRestStopTime}`
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

    moduleloop()
    configloop()
}
    
module.exports = driverStates