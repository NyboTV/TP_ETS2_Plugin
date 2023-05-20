// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json') 

const mainStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig, plugin_settings) => {
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')

    var units = ""

    var currencyUnit = ""
    var currencyUnitOld = ""

    var speedUnit = ""
    var speedUnitOld = ""
    
    var fluidUnit = ""
    var fluidUnitOld = ""

    var weightUnit = ""
    var weightUnitOld = ""

    var tempUnit = ""
    var tempUnitOld = ""

    var states = []

    logIt("MODULE", `Module ${moduleName}States loaded`)

    //Module Loop
    async function moduleloop () {
        for (var moduleLoop = 0; moduleLoop < Infinity; await timeout(refreshInterval), moduleLoop++) {   
                     
            // States
            states = []

            //Vars
            units = new sJSON(`${path}/config/usercfg.json`).Basics
            currencyUnit = units.currency
            speedUnit = units.unit
            fluidUnit = units.fluid
            weightUnit = units.weight
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

	moduleloop()    
}
module.exports = mainStates