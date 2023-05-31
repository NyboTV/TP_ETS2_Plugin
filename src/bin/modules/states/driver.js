// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json')

const driverStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig, plugin_settings) => {
    
    // Vars
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false
    
    let driver = ""
    let nextRestStopTime = ""
    let nextRestStopTimeOld = ""

    let timeFormat = ""

    var YY = ""
    var MM = ""
    var DD = ""
    var hh = ""
    var mm = ""
    
    var states = []

    let offline = false

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
                states = []
                if(offline === false) {
                    states = [
                        {
                        id: "Nybo.ETS2.Drivers.NextRestTime",
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
            driver = telemetry.game
            nextRestStopTime = driver.nextRestStopTime

            timeFormat = userconfig.Basics.timeFormat
            timeFormat = timeFormat.toUpperCase()

            
            if(nextRestStopTimeOld !== nextRestStopTime || offline === true) {
                nextRestStopTimeOld = nextRestStopTime

                nextRestStopTime = nextRestStopTime
                .split("-")
                .join(",")
                .split("T")
                .join(",")
                .split("Z")
                .join(",")
                .split(":")
                .join(",")
                .split(",");
                
                YY = nextRestStopTime[0]-1
                MM = nextRestStopTime[1]-1
                DD = nextRestStopTime[2]-1
                
                hh = nextRestStopTime[3]
                mm = nextRestStopTime[4]
                    
                nextRestStopTime = `${hh}:${mm}`

                var data = {
                            id: "Nybo.ETS2.Driver.NextRestTime",
                            value: `${nextRestStopTime}` 
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

    moduleloop()
    configloop()
}
    
module.exports = driverStates