// Loading Module
const { logger } = require('../script/logger')
const timeout = require('../script/timeout')

const mainStates = async (TPClient, path, configs) => {    
    const { config, userconfig } = configs
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')

    var currencyUnit, currencyUnitOld
    var speedUnit, speedUnitOld
    var fluidUnit, fluidUnitOld
    var fluidConUnit, fluidConUnitOld
    var weightUnit, weightUnitOld
    var tempUnit, tempUnitOld

    var states = []

    logger.info(`[MODULES] - [${moduleName}] Module loaded`)
    

    // Setting Values First Time to refresh
    let refreshInterval = config.refreshInterval

    //Module Loop
    async function moduleloop () {
        for (var moduleLoop = 0; moduleLoop < Infinity; await timeout(refreshInterval), moduleLoop++) {   
            refreshInterval = config.refreshInterval
                     
            // States
            states = []

            //Vars
            let units = userconfig.Basics
            currencyUnit = units.currency
            speedUnit = units.unit
            switch(units.fluid) {
                case 0:
                    fluidUnit = "Liters"
                break

                case 1:
                    fluidUnit = "US Galons"
                break

                case 2:
                    fluidUnit = "UK Galons"
                break
            }
            switch(units.fluidCon) {
                case 0:
                    fluidConUnit = `Liters / ${speedUnit}`
                break

                case 1:
                    fluidConUnit = `US Galons / ${speedUnit}`
                break

                case 2:
                    fluidConUnit = `Uk Galons / ${speedUnit}`
                break
            }            

            switch(units.weight) {
                case 0:
                    weightUnit = "Tons"
                break

                case 1:
                    weightUnit = "US Tons"
                break

                case 2:
                    weightUnit = "UK Tons"
                break

                case 3:
                    weightUnit = "Pounds"
                break
            }
            tempUnit = units.temp


            if(currencyUnit !== currencyUnitOld) {
                var data = {
                    id: "Nybo.ETS2.Setting.currencyUnit",
                    value: `${currencyUnit}`
                }
                currencyUnitOld = currencyUnit
                
                states.push(data)
            }

            if(speedUnit !== speedUnitOld) {
                var data = {
                    id: "Nybo.ETS2.Setting.speedUnit",
                    value: `${speedUnit}`
                }
                speedUnitOld = speedUnit
                
                states.push(data)
            }

            if(fluidUnit !== fluidUnitOld) {
                var data = {
                    id: "Nybo.ETS2.Setting.fluidUnit",
                    value: `${fluidUnit}`
                }
                fluidUnitOld = fluidUnit
                
                states.push(data)
            }

            if(fluidConUnit !== fluidConUnitOld) {
                var data = {
                    id: "Nybo.ETS2.Setting.fluidConUnit",
                    value: `${fluidConUnit}`
                }
                fluidConUnitOld = fluidConUnit
                
                states.push(data)
            }

            if(weightUnit !== weightUnitOld) {
                var data = {
                    id: "Nybo.ETS2.Setting.weightUnit",
                    value: `${weightUnit}`
                }
                weightUnitOld = weightUnit
                
                states.push(data)
            }

            if(tempUnit !== tempUnitOld) {
                var data = {
                    id: "Nybo.ETS2.Setting.tempUnit",
                    value: `${tempUnit}`
                }
                tempUnitOld = tempUnit
                
                states.push(data)
            }

            try {
                if(states.length > 0) {
                    TPClient.stateUpdateMany(states);
                }
            } catch (error) {
                logIt("MODULE", `${moduleName}States`, `Error: ${error}`)
            }
		}
	}

	moduleloop()    
}
module.exports = mainStates