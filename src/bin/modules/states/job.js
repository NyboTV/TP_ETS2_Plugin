const jobStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    // Loading Module
    const fs = require('fs')
    const sJSON = require('self-reload-json')
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    var job = ""
    var navigation = ""

    // Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    var telemetry = new sJSON(`${telemetry_path}/tmp.json`)

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(500), configLoop++) {
            if(module.Modules.jobStates === false) {
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
        for (var moduleLoop = 0; moduleLoop < Infinity; await timeout(refreshInterval), moduleLoop++) {
    
            if(ModuleLoaded === false) { 
            } else 
            
            // Vars
            job = telemetry.job
            navigation = telemetry.navigation
            let JobIncome = job.income
            let JobRemainingTime = new Date(job.remainingTime)
            JobRemainingTime = `${JobRemainingTime.getUTCHours()}:${JobRemainingTime.getUTCMinutes()}`
            let JobSourceCity = job.sourceCity
            let JobSourceCompany = job.sourceCompany
            let JobDestinationCity = job.destinationCity
            let JobDestinationCompany = job.destinationCompany
            let JobEstimatedDistance = navigation.estimatedDistance
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
                
            } catch (error) {
                logIt("ERROR", `${moduleName}States Error: ${error}`)
                logIt("ERROR", `${moduleName}States Error. Retry in 3 Seconds`)
                
            }
		}
	}
    
	configloop()
	moduleloop()
}
module.exports = jobStates