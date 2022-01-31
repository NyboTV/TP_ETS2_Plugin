const jobStates = async (TPClient, telemetry, logIt, timeout, config, userconfig) => {

    // Loading Module
    var path = require('path')
    var moduleName = path.basename(__filename)

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
    } catch (error) {
        logIt("ERROR", `${moduleName}States Error: ${error}`)
    }
}
module.exports = jobStates