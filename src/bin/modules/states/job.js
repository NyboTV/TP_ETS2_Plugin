const jobStates = async (TPClient, telemetry_path, logIt, timeout, path) => {
    // Loading Module
    const fs = require('fs')
	const Jimp = require('jimp')
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    async function loop () {

        if(fs.readFileSync(`${path}/config/usercfg.json`).jobStates === false) {
            if(ModuleLoaded === true) { logIt("MODULE", `Module ${moduleName}States unloaded`) }
            ModuleLoaded = false
            return;
        } else if(ModuleLoaded === false) { 
            logIt("MODULE", `Module ${moduleName}States loaded`)
            ModuleLoaded = true 
        }
        // Vars
        var telemetry = fs.readFileSync(`${telemetry_path}/tmp.json`, 'utf8')
        var refreshInterval = fs.readFileSync(`${path}/config/cfg.json`).refreshInterval
    
    
        // Vars
        let JobIncome = telemetry.job.income
        let JobRemainingTime = new Date(telemetry.job.remainingTime)
        JobRemainingTime = `${JobRemainingTime.getUTCHours()}:${JobRemainingTime.getUTCMinutes()}`
        let JobSourceCity = telemetry.job.sourceCity
        let JobSourceCompany = telemetry.job.sourceCompany
        let JobDestinationCity = telemetry.job.destinationCity
        let JobDestinationCompany = telemetry.job.destinationCompany
        let JobEstimatedDistance = telemetry.navigation.estimatedDistance
        let Currency = userconfig.Basics.Money
    
        // Module Stuff
        var states = [
            {
                id: "Nybo.ETS2.Dashboard.JobIncome",
                value: `${JobIncome}${Currency}`
            },
            {
                id: "Nybo.ETS2.Dashboard.JobRemainingTime",
                value: `${JobRemainingTime}`
            },
            {
                id: "Nybo.ETS2.Dashboard.JobSourceCity",
                value: `${JobSourceCity}`
            },
            {
                id: "Nybo.ETS2.Dashboard.JobSourceCompany",
                value: `${JobSourceCompany}`
            },
            {
                id: "Nybo.ETS2.Dashboard.JobDestinationCity",
                value: `${JobDestinationCity}`
            },
            {
                id: "Nybo.ETS2.Dashboard.JobDestinationCompany",
                value: `${JobDestinationCompany}`
            },
            {
                id: "Nybo.ETS2.Dashboard.JobEstimatedDistance",
                value: `${JobEstimatedDistance}`
            },
        ]
    
        try {
            TPClient.stateUpdateMany(states);
            await timeout(refreshInterval)
            loop()
        } catch (error) {
            logIt("ERROR", `${moduleName}States Error: ${error}`)
            logIt("ERROR", `${moduleName}States Error. Retry in 3 Seconds`)
            await timeout(3000)
            loop()
        }
	}
}
module.exports = jobStates