const driverStates = async (TPClient, telemetry, logIt, timeout, config, userconfig) => {

    // Loading Module
    var path = require('path')
    var moduleName = path.basename(__filename)

    // Vars
	let NextRestStopTime = new Date(game.nextRestStopTime)
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
    } catch (error) {
        logIt("ERROR", `${moduleName}States Error: ${error}`)
    }
} 
module.exports = driverStates