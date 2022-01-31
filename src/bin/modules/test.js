const test = async (TPClient, telemetry, logIt, timeout, config, userconfig) => {

    // Loading Module
    var path = require('path')
    var moduleName = path.basename(__filename).replace('.js','')
    if(ModulesLoaded === 1) return logIt("MODULE", `Module ${moduleName}States loaded`)

    // Vars
    var telemetry = fs.readFileSync(`${telemetry_path}/tmp.json`, 'utf8')
        var refreshInterval = fs.readFileSync(`${path}/config/cfg.json`).refreshInterval


    /*
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

    //*/
}
    
//module.exports = test
