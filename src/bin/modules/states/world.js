const worldStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    // Loading Module
    const fs = require('fs')
    const sJSON = require('self-reload-json') 
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    let world = ""

    let time = ""
    let timeOld = ""

    let timeFormat = ""

    var YY = ""
    var MM = ""
    var DD = ""
    var hh = ""
    var mm = ""

    var states = []

    var offline = false

    // Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    var telemetry = new sJSON(`${telemetry_path}/tmp.json`)

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(500), configLoop++) {
            if(module.Modules.worldStates === false) {
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
                        id: "Nybo.ETS2.Dashboard.Time",
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

            //Vars
            world = telemetry.game
            time = world.time

            timeFormat = userconfig.Basics.timeFormat
            timeFormat = timeFormat.toUpperCase()

            if(time !== timeOld || offline === true) {
                timeOld = time
                
                time = time.replace('T', ' ').replace('Z', '').replace(':', ' ').replace(':', ' ').replace('-', ' ').replace('-', ' ')
                time = time.split(' ').slice(0, 5)
                
                YY = `20` + Math.round(time[0])
                MM = time[1]
                DD = time[2]

                hh = time[3]
                mm = time[4]
                
                if (timeFormat === "US") {
                    if(hh > 12) {
                        hh = hh-12
                        time = `${MM}.${DD}.${YY}, ${hh}:${mm} PM`
                    } else {
                        time = `${MM}.${DD}.${YY}, ${hh}:${mm} AM`
                    }
                } else {
                    time = `${hh}:${mm}, ${DD}.${MM}.${YY}`
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.Time",
                    value: `${time}`
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
module.exports = worldStates