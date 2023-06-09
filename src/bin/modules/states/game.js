// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json')

const gameStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig, plugin_settings) => {
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    var game = ""
    var connected = ""
    var connectedOld = ""
    var gameName = ""
    var gameNameOld = ""
    var paused = ""
    var pausedOld = ""

    var states = []

    var offline = false

    // Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    let telemetry = new sJSON(`${telemetry_path}/tmp.json`)

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(500), configLoop++) {
            if(module.Modules.gameStates === false) {
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
        truckersmp = telemetry.game
        for (var moduleLoop = 0; moduleLoop < Infinity; await timeout(refreshInterval), moduleLoop++) {
    
            if(ModuleLoaded === false) { 
                states = []
                if(offline === false) {
                    states = [
                        {
                            id: "Nybo.ETS2.Game.ConnectedStatus",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Game.GameType",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Game.IsPaused",
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
            game = telemetry.game
            connected = game.connected
            gameName = game.gameName
            paused = game.paused
        
            if(gameName === null) {
                gameName = "No Game found!"
            }

            if(connected !== connectedOld || offline === true) {
                connectedOld = connected

                var data = {
                    id: "Nybo.ETS2.Game.ConnectedStatus",
                    value: `${connected}`
                }

                states.push(data)
            }

            if(gameName !== gameNameOld || offline === true) {
                gameNameOld = gameName

                var data = {
                    id: "Nybo.ETS2.Game.GameType",
                    value: `${gameName}`
                }

                states.push(data)
            }

            if(paused !== pausedOld || offline === true) {
                pausedOld = paused

                var data = {
                    id: "Nybo.ETS2.Game.IsPaused",
                    value: `${paused}`
                }

                states.push(data)
            }
        
            offline = false

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
    
module.exports = gameStates