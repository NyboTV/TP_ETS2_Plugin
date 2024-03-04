// Loading Module
const fs = require('fs')
const { convert, addSymbol } = require('current-currency')
const { logger } = require('../script/logger')
const pluginEvents = require('../script/emitter')


const jobStates = async (TPClient, path, configs) => {
    const { config, userconfig } = configs

    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')

    let game

    var job
    var navigation

    var unit 

    let JobIncome, JobIncomeOld
    let JobRemainingTime, JobRemainingTimeOld
    let JobSourceCity, JobSourceCityOld
    let JobSourceCompany, JobSourceCompanyOld
    let JobDestinationCity, JobDestinationCityOld
    let JobDestinationCompany, JobDestinationCompanyOld
    let Currency,  CurrencyOld

    let timeFormat

    var DD, hh, mm

    let Symbol
    var states = []

    logger.info(`[MODULES] - [${moduleName}] Module loaded`)

    pluginEvents.on(`${moduleName}States`, (telemetry) => {
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


        if(JobIncome !== JobIncomeOld || Currency !== CurrencyOld) {
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
                        logger.error(`[MODULE] - [${moduleName}] Error during Currency Convert! ` + e)
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
                logger.error(`[MODULE] - [${moduleName}] ERROR WHILE GETTING GAME NAME. USING DEFAULT CURRENCY`)

                JobIncome = JobIncome.toLocaleString()
                    
                    var data = {
                        id: "Nybo.ETS2.Job.JobIncome",
                        value: `${JobIncome}€`
                    }
                    
                    states.push(data)
            }
        }
   
        if(JobRemainingTime !== JobRemainingTimeOld) {
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


        if(JobSourceCity !== JobSourceCityOld) {
            JobSourceCityOld = JobSourceCity

            var data = {
                id: "Nybo.ETS2.Job.JobSourceCity",
                value: `${JobSourceCity}`
            }

            states.push(data)
        }

        if(JobSourceCompany !== JobSourceCompanyOld) {
            JobSourceCompanyOld = JobSourceCompany

            var data = {
                id: "Nybo.ETS2.Job.JobSourceCompany",
                value: `${JobSourceCompany}`
            }

            states.push(data)
        }

        if(JobDestinationCity !== JobDestinationCityOld) {
            JobDestinationCityOld = JobDestinationCity

            var data = {
                id: "Nybo.ETS2.Job.JobDestinationCity",
                value: `${JobDestinationCity}`
            }

            states.push(data)
        }

        if(JobDestinationCompany !== JobDestinationCompanyOld) {
            JobDestinationCompanyOld = JobDestinationCompany

            var data ={
                id: "Nybo.ETS2.Job.JobDestinationCompany",
                value: `${JobDestinationCompany}`
            }

            states.push(data)
        }
		
        try {
            if(states.length > 0) {
                TPClient.stateUpdateMany(states);
                logger.debug(`Module '${moduleName} refreshed with ${states.length} values`)
            }
        } catch (error) {
            logger.error(`[MODULE] ${moduleName} Error: ${error}`)
        }
    })
    
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