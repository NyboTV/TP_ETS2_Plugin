// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json')
const { convert, addSymbol } = require('current-currency')
const https = require('https')


const jobStates = async (TPClient, telemetry_path, logIt, timeout, path, cfg_path, OfflineMode) => {
    
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
    
    let Currency = ""
    let CurrencyOld = ""

    let timeFormat = ""

    var YY = ""
    var MM = ""
    var DD = ""
    var hh = ""
    var mm = ""

    let Symbol = ""

    var states = []

    var offline = false

    // Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    var telemetry = new sJSON(`${telemetry_path}/tmp.json`)
    let config = new sJSON(`${cfg_path}/cfg.json`)
    let userconfig = new sJSON(`${cfg_path}/usercfg.json`)

    // Setting Values First Time to refresh
    refreshInterval = config.refreshInterval

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(refreshInterval), configLoop++) {
            if(module.Modules.jobStates === false) {
                if(ModuleLoaded === true) { logIt("MODULE", `${moduleName}States`, `Module unloaded`) }
                ModuleLoaded = false
            } else if(ModuleLoaded === false) { 
                logIt("MODULE", `${moduleName}States`, `Module loaded`)
                ModuleLoaded = true 
            }
        }
    }

    //Module Loop
    async function moduleloop () {
        for (var moduleLoop = 0; moduleLoop < Infinity; await timeout(refreshInterval), moduleLoop++) {
            refreshInterval = config.refreshInterval
    
            if(ModuleLoaded === false) { 
                states = []
                if(offline === false) {
                    states = [
                        {
                            id: "Nybo.ETS2.Job.JobIncome",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Job.JobRemainingTime",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Job.JobSourceCity",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Job.JobSourceCompany",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Job.JobDestinationCity",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Job.JobDestinationCompany",
                            value: `MODULE OFFLINE` 
                        },
                        {
                            id: "Nybo.ETS2.Job.JobEstimatedDistance",
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
            
            timeFormat = userconfig.Basics.timeFormat
            timeFormat = timeFormat.toUpperCase()


            if(JobIncome !== JobIncomeOld || Currency !== CurrencyOld || offline === true) {
                JobIncomeOld = JobIncome
                JobRemainingTimeOld = JobRemainingTime
                CurrencyOld = Currency
                
                if(game === "ATS") {
                    if(Currency !== "USD" && OfflineMode === false) {
                        try {
                            convert("USD", JobIncome, `${Currency}`).then(async (res) => {

                                JobIncome = Math.round(res.amount)    
                                Symbol = await getSymbol(res.currency, userconfig)
                                JobIncome = JobIncome.toLocaleString()
                                
                                if(Symbol === "€") {
                                    TPClient.stateUpdate("Nybo.ETS2.Job.JobIncome", `${JobIncome} ${Symbol}`);
                                } else if(Symbol === false) {
                                    TPClient.stateUpdate("Nybo.ETS2.Job.JobIncome", `${JobIncome} €`);
                                } else {
                                    TPClient.stateUpdate("Nybo.ETS2.Job.JobIncome", `${Symbol} ${JobIncome}`);
                                }
                            })
                            
                        } catch (e) {
                            logIt("MODULE", `${moduleName}States`, `Error during Currency Convert! ` + e)
                        }
                    } else {
    
                        JobIncome = JobIncome.toLocaleString()
                        
                        var data = {
                            id: "Nybo.ETS2.Job.JobIncome",
                            value: `$ ${JobIncome}`
                        }
                        
                        states.push(data)
                    }
                } else if (game === "ETS2") {
                    if(Currency !== "EUR" && OfflineMode === false) {
                        try {
                            convert("EUR", JobIncome, `${Currency}`).then(async (res) => {
                                JobIncome = Math.round(res.amount)
                                Symbol = await getSymbol(res.currency, userconfig)
                                JobIncome = JobIncome.toLocaleString()
                                if(Symbol === false) {
                                    TPClient.stateUpdate("Nybo.ETS2.Job.JobIncome", `Error while getting Symbole`);
                                } else {
                                    TPClient.stateUpdate("Nybo.ETS2.Job.JobIncome", `${Symbol} ${JobIncome}`);
                                }
                            })
                            
                        } catch (e) {
                            logIt("MODULE", `${moduleName}States`, `ModuleError during Currency Convert! ` + e)
                        }
                    } else {
    
                        JobIncome = JobIncome.toLocaleString()
                        
                        var data = {
                            id: "Nybo.ETS2.Job.JobIncome",
                            value: `${JobIncome}€`
                        }
                        
                        states.push(data)
                    }
                } else {
                    logIt("MODULE", `${moduleName}States`, "ERROR WHILE GETTING GAME NAME. USING DEFAULT CURRENCY")

                    JobIncome = JobIncome.toLocaleString()
                        
                        var data = {
                            id: "Nybo.ETS2.Job.JobIncome",
                            value: `${JobIncome}€`
                        }
                        
                        states.push(data)
                }
            }
       
            if(JobRemainingTime !== JobRemainingTimeOld || offline === true) {
                JobRemainingTimeOld = JobRemainingTime
                
                JobRemainingTime = JobRemainingTime
                .split("-")
                .join(",")
                .split("T")
                .join(",")
                .split("Z")
                .join(",")
                .split(":")
                .join(",")
                .split(",");

                YY = JobRemainingTime[0]-1
                MM = JobRemainingTime[1]-1
                DD = JobRemainingTime[2]-1

                hh = JobRemainingTime[3]
                mm = JobRemainingTime[4]
            
                JobRemainingTime = `${DD}D, ${hh}:${mm}`
                
                var data = {
                    id: "Nybo.ETS2.Job.JobRemainingTime",
                    value: `${JobRemainingTime}`
                }

                states.push(data)
                
            }


            if(JobSourceCity !== JobSourceCityOld || offline === true) {
                JobSourceCityOld = JobSourceCity

                var data = {
                    id: "Nybo.ETS2.Job.JobSourceCity",
                    value: `${JobSourceCity}`
                }

                states.push(data)
            }

            if(JobSourceCompany !== JobSourceCompanyOld || offline === true) {
                JobSourceCompanyOld = JobSourceCompany

                var data = {
                    id: "Nybo.ETS2.Job.JobSourceCompany",
                    value: `${JobSourceCompany}`
                }

                states.push(data)
            }

            if(JobDestinationCity !== JobDestinationCityOld || offline === true) {
                JobDestinationCityOld = JobDestinationCity

                var data = {
                    id: "Nybo.ETS2.Job.JobDestinationCity",
                    value: `${JobDestinationCity}`
                }

                states.push(data)
            }

            if(JobDestinationCompany !== JobDestinationCompanyOld || offline === true) {
                JobDestinationCompanyOld = JobDestinationCompany

                var data ={
                    id: "Nybo.ETS2.Job.JobDestinationCompany",
                    value: `${JobDestinationCompany}`
                }

                states.push(data)
            }
            
            offline = false
            
            unitOld = unit

            try {
                if(states.length > 0) {
                    TPClient.stateUpdateMany(states);
                }
            } catch (error) {
                logIt("MODULE", `${moduleName}States`, `Error: ${error}`)
            }
		}
	}
    
	configloop()
	moduleloop()

    
    
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
            let data = fs.readFileSync(`${path}/config/currency.json`)
            data = JSON.parse(data)
            data = data.currency
            data = data[`${currency}`]
                    
            resolve(data)
        })
    }
    
    
    
}


module.exports = jobStates