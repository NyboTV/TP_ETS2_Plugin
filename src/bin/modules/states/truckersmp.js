const truckersmpStates = async (TPClient, telemetry, logIt, timeout, config, userconfig) => {

    // Loading Module
    var path = require('path')
    var moduleName = path.basename(__filename)

    // Module Stuff
    var states = [
        {
            id: "Nybo.ETS2.Dashboard.ConnectedStatus",
            value: `${telemetry.connected}`
        },
    ]

    try {
        TPClient.stateUpdateMany(states);
    } catch (error) {
        logIt("ERROR", `${moduleName}States Error: ${error}`)
    }
}
module.exports = truckersmpStates