// Loading Module
const { logger } = require('../script/logger')
const pluginEvents = require('../script/emitter')

const gameStates = async (TPClient, path, configs) => {
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    
    var connectedOld
    var gameNameOld
    var pausedOld
    
    logger.info(`[MODULES] - [${moduleName}] Module loaded`)
    
    pluginEvents.on(`${moduleName}States`, (telemetry) => { 

        var game = telemetry.game
        var connected = game.connected
        var gameName = game.gameName
        var paused = game.paused
    
        var states = []
    
    
        if(gameName === null) {
            gameName = "No Game found!"
        }
    
        if(connected !== connectedOld) {
            connectedOld = connected
    
            var data = {
                id: "Nybo.ETS2.Game.ConnectedStatus",
                value: `${connected}`
            }
    
            states.push(data)
        }
    
        if(gameName !== gameNameOld) {
            gameNameOld = gameName
    
            var data = {
                id: "Nybo.ETS2.Game.GameType",
                value: `${gameName}`
            }
    
            states.push(data)
        }
    
        if(paused !== pausedOld) {
            pausedOld = paused
    
            var data = {
                id: "Nybo.ETS2.Game.IsPaused",
                value: `${paused}`
            }
    
            states.push(data)
        }

        try {
            if(states.length > 0) {
                TPClient.stateUpdateMany(states);
                logger.debug(`Module '${moduleName} refreshed with ${states.length} values`)
            }
        } catch (error) {
            logger.error(`[MODULE] ${moduleName} Error: ${error}`)
        }
    })

}
    
module.exports = gameStates