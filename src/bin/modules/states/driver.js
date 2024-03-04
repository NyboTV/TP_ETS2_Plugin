// Loading Module
const { logger } = require('../script/logger')
const pluginEvents = require('../script/emitter')

// Compare Value

const driverStates = async (TPClient, path, configs) => {  
    const { config, userconfig } = configs
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    
    let nextRestStopTimeOld
    
    logger.info(`[MODULES] - [${moduleName}] Module loaded`)
    
    pluginEvents.on(`${moduleName}States`, (telemetry) => {
    
        let nextRestStopTime = telemetry.nextRestStopTime
        
        let timeFormat = userconfig.Basics.timeFormat
        timeFormat = timeFormat.toUpperCase()
        var hh, mm
        var states = []     
    
        if(nextRestStopTimeOld !== nextRestStopTime) {
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
            
            hh = nextRestStopTime[3]
            mm = nextRestStopTime[4]
                
            nextRestStopTime = `${hh}:${mm}`
    
            var data = {
                id: "Nybo.ETS2.Driver.NextRestTime",
                value: `${nextRestStopTime}` 
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
    });
}
    
module.exports = driverStates