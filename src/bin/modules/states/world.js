// Loading Module
const { logger } = require('../script/logger')
const pluginEvents = require('../script/emitter')

const worldStates = async (TPClient, path, configs) => {
    const { config, userconfig } = configs

    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')

    let world
    let time, timeOld
    let timeFormat

    var YY, MM, DD, hh, mm

    var states = []
    
	logger.info(`[MODULES] - [${moduleName}] Module loaded`)

	pluginEvents.on(`${moduleName}States`, (telemetry) => {
		// States
        states = []

        //Vars
        world = telemetry
        time = world.time

        timeFormat = userconfig.Basics.timeFormat
        timeFormat = timeFormat.toUpperCase()

        if(time !== timeOld) {
            timeOld = time

            time = time
            .split("-")
            .join(",")
            .split("T")
            .join(",")
            .split("Z")
            .join(",")
            .split(":")
            .join(",")
            .split(",");

            YY = Math.round(time[0]-1+2000)
            MM = time[1]-1
            DD = time[2]-1
            
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
                id: "Nybo.ETS2.World.Time",
                value: `${time}`
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
module.exports = worldStates