const gameStates = async (TPClient, telemetry, logIt, timeout, config, userconfig) => {

    // Loading Module
    var path = require('path')
    var moduleName = path.basename(__filename)

    // Module Stuff
    var states = [
        {
            id: "Nybo.ETS2.Dashboard.ConnectedStatus",
            value: `${telemetry.connected}`
        },
        {
            id: "Nybo.ETS2.Dashboard.GameType",
            value: `${telemetry.gameName}`
        },
        {
            id: "Nybo.ETS2.Dashboard.IsPaused",
            value: `${telemetry.paused}`
        }
    ]

    try {
        TPClient.stateUpdateMany(states);
    } catch (error) {
        logIt("ERROR", `${moduleName}States Error: ${error}`)
    }
}
    
module.exports = gameStates