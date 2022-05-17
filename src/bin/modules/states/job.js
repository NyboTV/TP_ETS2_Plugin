const jobStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    // Loading Module
    const fs = require('fs')
    const sJSON = require('self-reload-json')
    const { convert, addSymbol } = require('current-currency')
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    var job = ""
    var navigation = ""

    var unit = ""
    var unitOld = ""

    let JobIncome = ""
    let JobIncomeOld = ""
    let JobRemainingTime = ""
    let JobRemainingTimeOld = ""

    let JobSourceCity = ""
    let JobSourceCityOld = ""
    
    let JobSourceCompany = ""
    let JobSourceCompanyOld = ""

    let JobDestinationCity = ""
    let JobDestinationCityOld = ""

    let JobDestinationCompany = ""
    let JobDestinationCompanyOld = ""

    let JobEstimatedDistance = ""
    let JobEstimatedDistanceOld = ""
    
    let Currency = ""
    let CurrencyOld = ""

    let Symbol = ""

    var states = []

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
                states = []
            } else 
            
            // States
            states = []

            // Vars
            job = telemetry.job
            navigation = telemetry.navigation

            JobIncome = job.income
            JobRemainingTime = job.remainingTime            
            JobSourceCity = job.sourceCity
            JobSourceCompany = job.sourceCompany
            JobDestinationCity = job.destinationCity
            JobDestinationCompany = job.destinationCompany
            JobEstimatedDistance = navigation.estimatedDistance
            Currency = userconfig.Basics.currency
            unit = userconfig.Basics.unit
            unit = unit.toLowerCase()

            if(JobIncome !== JobIncomeOld || Currency !== CurrencyOld) {
                JobIncomeOld = JobIncome
                JobRemainingTimeOld = JobRemainingTime
                CurrencyOld = Currency

                if(Currency !== "EUR") {
                    try {
                        convert("EUR", JobIncome, `${Currency}`).then(async (res) => {
                            JobIncome = Math.round(res.amount)

                            Symbol = await getSymbol(res.currency)            
                            
                            TPClient.stateUpdate("Nybo.ETS2.Dashboard.JobIncome", `${Symbol} ${JobIncome}`);
                        })
                        
                    } catch (e) {
                        logIt("ERROR", "Error during Currency Convert!")
                    }
                } else {
                    
                    var data = {
                        id: "Nybo.ETS2.Dashboard.JobIncome",
                        value: `${JobIncome}€`
                    }
                    
                    states.push(data)
                }
            }
            

            if(JobRemainingTime !== JobRemainingTimeOld) {
                JobRemainingTimeOld = JobRemainingTime
                
                JobRemainingTime = new Date(JobRemainingTime)
                JobRemainingTime = `${JobRemainingTime.getUTCHours()}:${JobRemainingTime.getUTCMinutes()}`

                var data = {
                    id: "Nybo.ETS2.Dashboard.JobRemainingTime",
                    value: `${JobRemainingTime}`
                }

                states.push(data)
            }


            if(JobSourceCity !== JobSourceCityOld) {
                JobSourceCityOld = JobSourceCity

                var data = {
                    id: "Nybo.ETS2.Dashboard.JobSourceCity",
                    value: `${JobSourceCity}`
                }

                states.push(data)
            }

            if(JobSourceCompany !== JobSourceCompanyOld) {
                JobSourceCompanyOld = JobSourceCompany

                var data = {
                    id: "Nybo.ETS2.Dashboard.JobSourceCompany",
                    value: `${JobSourceCompany}`
                }

                states.push(data)
            }

            if(JobDestinationCity !== JobDestinationCityOld) {
                JobDestinationCityOld = JobDestinationCity

                var data = {
                    id: "Nybo.ETS2.Dashboard.JobDestinationCity",
                    value: `${JobDestinationCity}`
                }

                states.push(data)
            }

            if(JobDestinationCompany !== JobDestinationCompanyOld) {
                JobDestinationCompanyOld = JobDestinationCompany

                var data ={
                    id: "Nybo.ETS2.Dashboard.JobDestinationCompany",
                    value: `${JobDestinationCompany}`
                }

                states.push(data)
            }

            if(JobEstimatedDistance !== JobEstimatedDistanceOld || unitOld !== unit) {
                JobEstimatedDistanceOld = JobEstimatedDistance
                unitOld = unit

                if(unit === "imperial") {
                    JobEstimatedDistance = Math.round(Math.floor(JobEstimatedDistance/1.609344) * 100) / 100
                }

                var data = {
                    id: "Nybo.ETS2.Dashboard.JobEstimatedDistance",
                    value: `${JobEstimatedDistance}`
                }

                states.push(data)
            }
        
            try {
                if(states.length > 0) {
                    TPClient.stateUpdateMany(states);
                }
            } catch (error) {
                logIt("ERROR", `${moduleName}States Error: ${error}`)
                logIt("ERROR", `${moduleName}States Error. Retry...`)
            }
		}
	}
    
	configloop()
	moduleloop()
}

function getSymbol(currency) {
    return new Promise(async (resolve, reject) => {
        switch(currency) {
            case "USD":
                resolve("$")
            break;

            case "CAD":
                resolve("C$")
            break;

            case "GBP":
                resolve("£")
            break;

            case "DDK":
                resolve("kr.")
            break;

            case "HKD":
                resolve("HK$")
            break;

            case "ISK":
                resolve("Kr")
            break;

            case "PHP":
                resolve("₱")
            break;

            case "HUF":
                resolve("Ft")
            break;

            case "CZK":
                resolve("Kč")
            break;

            case "SEK":
                resolve("kr")
            break;

            case "PLN":
                resolve("zł")
            break;

            case "KRW":
                resolve("₩")
            break;

            default:
                resolve("")
            break;
        }
    })
}




module.exports = jobStates