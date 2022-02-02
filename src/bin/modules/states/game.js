const gameStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    // Loading Module
    const fs = require('fs')
    const sJSON = require('self-reload-json')
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    var game = ""

    // Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    let telemetry = new sJSON(`${telemetry_path}/tmp.json`)

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(500), configLoop++) {
            if(module.Modules.gameStates === false) {
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
            truckersmp = telemetry.game
            for (var moduleLoop = 0; moduleLoop < Infinity; await timeout(refreshInterval), moduleLoop++) {
    
            if(ModuleLoaded === false) { 
            } else 

            //Vars
            game = telemetry.game
            var connected = game.connected
            var gameName = game.gameName
            var paused = game.paused
        
            if(gameName === null) {
                gameName = "No Game found!"
            }

            // Module Stuff
            var states = [
                {
                    id: "Nybo.ETS2.Dashboard.ConnectedStatus",
                    value: `${connected}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.GameType",
                    value: `${gameName}`
                },
                {
                    id: "Nybo.ETS2.Dashboard.IsPaused",
                    value: `${paused}`
                }
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
    
module.exports = gameStates