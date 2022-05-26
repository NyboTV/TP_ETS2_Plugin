// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json')
const { convert, addSymbol } = require('current-currency')
const https = require('https')


const jobStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    let game = ""

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

    var offline = false

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
                if(offline === false) {
                    states = [
                        {
                            id: "Nybo.ETS2.Dashboard.JobIncome",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Dashboard.JobRemainingTime",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Dashboard.JobSourceCity",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Dashboard.JobSourceCompany",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Dashboard.JobDestinationCity",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Dashboard.JobDestinationCompany",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Dashboard.JobEstimatedDistance",
                            value: `MODULE OFFLINE` 
                        }
                    ]
                    
                    TPClient.stateUpdateMany(states);
    
                    offline = true
                }
                continue
            } else 
            
            // States
            states = []

            // Vars
            game = telemetry.game.gameName

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

            if(JobIncome !== JobIncomeOld || Currency !== CurrencyOld || offline === true) {
                JobIncomeOld = JobIncome
                JobRemainingTimeOld = JobRemainingTime
                CurrencyOld = Currency

                if(game === "ATS") {
                    if(Currency !== "USD") {
                        try {
                            convert("USD", JobIncome, `${Currency}`).then(async (res) => {
                                JobIncome = Math.round(res.amount)    
                                Symbol = await getSymbol(res.currency, userconfig)
                                JobIncome = JobIncome.toLocaleString()
                                
                                if(Symbol === "€") {
                                    TPClient.stateUpdate("Nybo.ETS2.Dashboard.JobIncome", `${JobIncome} ${Symbol}`);
                                } else {
                                    TPClient.stateUpdate("Nybo.ETS2.Dashboard.JobIncome", `${Symbol} ${JobIncome}`);
                                }
                            })
                            
                        } catch (e) {
                            logIt("ERROR", "Error during Currency Convert! " + e)
                        }
                    } else {
    
                        JobIncome = JobIncome.toLocaleString()
                        
                        var data = {
                            id: "Nybo.ETS2.Dashboard.JobIncome",
                            value: `$ ${JobIncome}`
                        }
                        
                        states.push(data)
                    }
                } else {
                    if(Currency !== "EUR") {
                        try {
                            convert("EUR", JobIncome, `${Currency}`).then(async (res) => {
                                JobIncome = Math.round(res.amount)
                                Symbol = await getSymbol(res.currency, userconfig)
                                JobIncome = JobIncome.toLocaleString()
                                
                                TPClient.stateUpdate("Nybo.ETS2.Dashboard.JobIncome", `${Symbol} ${JobIncome}`);
                            })
                            
                        } catch (e) {
                            logIt("ERROR", "Error during Currency Convert! " + e)
                        }
                    } else {
    
                        JobIncome = JobIncome.toLocaleString()
                        
                        var data = {
                            id: "Nybo.ETS2.Dashboard.JobIncome",
                            value: `${JobIncome}€`
                        }
                        
                        states.push(data)
                    }
                }                
            }
            

            if(JobRemainingTime !== JobRemainingTimeOld || offline === true) {
                JobRemainingTimeOld = JobRemainingTime
                
                JobRemainingTime = new Date(JobRemainingTime)
                JobRemainingTime = `${JobRemainingTime.getDay()-1}d ${JobRemainingTime.getUTCHours()}:${JobRemainingTime.getUTCMinutes()}`

                var data = {
                    id: "Nybo.ETS2.Dashboard.JobRemainingTime",
                    value: `${JobRemainingTime}`
                }

                states.push(data)
            }


            if(JobSourceCity !== JobSourceCityOld || offline === true) {
                JobSourceCityOld = JobSourceCity

                var data = {
                    id: "Nybo.ETS2.Dashboard.JobSourceCity",
                    value: `${JobSourceCity}`
                }

                states.push(data)
            }

            if(JobSourceCompany !== JobSourceCompanyOld || offline === true) {
                JobSourceCompanyOld = JobSourceCompany

                var data = {
                    id: "Nybo.ETS2.Dashboard.JobSourceCompany",
                    value: `${JobSourceCompany}`
                }

                states.push(data)
            }

            if(JobDestinationCity !== JobDestinationCityOld || offline === true) {
                JobDestinationCityOld = JobDestinationCity

                var data = {
                    id: "Nybo.ETS2.Dashboard.JobDestinationCity",
                    value: `${JobDestinationCity}`
                }

                states.push(data)
            }

            if(JobDestinationCompany !== JobDestinationCompanyOld || offline === true) {
                JobDestinationCompanyOld = JobDestinationCompany

                var data ={
                    id: "Nybo.ETS2.Dashboard.JobDestinationCompany",
                    value: `${JobDestinationCompany}`
                }

                states.push(data)
            }

            if(JobEstimatedDistance !== JobEstimatedDistanceOld || unitOld !== unit || offline === true) {
                JobEstimatedDistanceOld = JobEstimatedDistance
                unitOld = unit

                if(unit === "imperial") {
                    JobEstimatedDistance = Math.round(Math.floor(JobEstimatedDistance/1.609344) * 100) / 100
                    
                    JobEstimatedDistance = `${JobEstimatedDistance/1000} Miles`
                } else {
                    JobEstimatedDistance = `${JobEstimatedDistance/1000} KM`
                }


                var data = {
                    id: "Nybo.ETS2.Dashboard.JobEstimatedDistance",
                    value: `${JobEstimatedDistance}`
                }

                states.push(data)
            }
        
            offline = false

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


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getSymbol(currency, uConfig) {
    return new Promise(async (resolve, reject) => {
        try {

            https.get('https://raw.githubusercontent.com/NyboTV/TP_ETS2_Plugin/master/src/data/currency.json', (resp) => {
                var data = ''
                
                resp.on('data', (chunk) => {
                    data += chunk
                })
                
                resp.on('end', () => {
                    
                    if(IsJsonString(data) === true) {
                        data = JSON.parse(data)
                        data = data.currency
                        data = data[`${currency}`]
                        
                        resolve(data)
                        
                    }
                })
            })
        } catch (e) {
            logIt("WARNING", "Currency List is getting Updated or doesent Exists!!")
        }
        
    })
}






module.exports = jobStates