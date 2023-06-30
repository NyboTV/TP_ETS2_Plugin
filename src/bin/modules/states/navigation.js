// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json')
const Jimp = require('jimp')

const navigationStates = async (TPClient, telemetry_path, logIt, timeout, path, cfg_path) => {
	
	var path2 = require('path')
	var moduleName = path2.basename(__filename).replace('.js','')
	let ModuleLoaded = false

	let navigation = ""

	let unit = ""
	let unitOld = ""

	let Speedlimit = ""
	let SpeedlimitOld = ""
	let SpeedlimitSign = ""

	let estimatedDistance = ""
	let estimatedDistanceOld = ""

	let estimatedTime = ""
	let estimatedTimeOld = ""

	let timeFormat = ""

    var YY = ""
    var MM = ""
    var DD = ""
    var hh = ""
    var mm = ""
	
	var states = []

	var offline = false
	
	// Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    var telemetry = new sJSON(`${telemetry_path}/tmp.json`)
    let config = new sJSON(`${cfg_path}/cfg.json`)
    let userconfig = new sJSON(`${cfg_path}/usercfg.json`)

    // Setting Values First Time to refresh
    refreshInterval = config.refreshInterval
	
	// PNG Vars
	let image_SpeedLimit = await Jimp.read(`${path}/images/speedlimit.png`);

	// Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(refreshInterval), configLoop++) {
            if(module.Modules.navigationStates === false) {
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
                        id: "Nybo.ETS2.Navigation.SpeedLimit",
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
            navigation = telemetry.navigation
			Speedlimit = navigation.speedLimit
			estimatedDistance = navigation.estimatedDistance
			estimatedTime = navigation.estimatedTime

			SpeedlimitSign = ""
			
            timeFormat = userconfig.Basics.timeFormat
            timeFormat = timeFormat.toUpperCase()

			unit = userconfig.Basics.unit
            unit = unit.toLowerCase()


			if(Speedlimit !== SpeedlimitOld || unit !== unitOld || offline === true) {
				SpeedlimitOld = Speedlimit				

				if(unit === "miles") {
					Speedlimit = Math.round(Speedlimit/1.609)
				}

				SpeedlimitSign = await getSpeedLimitSign(Speedlimit)

				var data1 = {
					id: "Nybo.ETS2.Navigation.SpeedLimit",
					value: `${Speedlimit}`
				}

				var data2 = {
					id: "Nybo.ETS2.Navigation.SpeedLimitSign",
					value: `${SpeedlimitSign}`
				}

				states.push(data1)
				states.push(data2)
			}		


            if(estimatedDistance !== estimatedDistanceOld || unitOld !== unit || offline === true) {
                estimatedDistanceOld = estimatedDistance

                if(unit === "miles") {
                    estimatedDistance = Math.round(Math.floor(estimatedDistance/1.609344) * 100) / 100
                    
                    estimatedDistance = `${(estimatedDistance/1000).toFixed(2)} Miles`
                } else {
                    estimatedDistance = `${(estimatedDistance/1000).toFixed(2)} KM`
                }


                var data = {
                    id: "Nybo.ETS2.Navigation.estimatedDistance",
                    value: `${estimatedDistance}`
                }

                states.push(data)
            }

			if(estimatedTime !== estimatedTimeOld || offline === true) {
                estimatedTimeOld = estimatedTime
                
				estimatedTime = estimatedTime
				.split("-")
				.join(",")
				.split("T")
				.join(",")
				.split("Z")
				.join(",")
				.split(":")
				.join(",")
				.split(",")
				
                YY = estimatedTime[0]-1
                MM = estimatedTime[1]-1
                DD = estimatedTime[2]-1

                hh = estimatedTime[3]
                mm = estimatedTime[4]
                
                estimatedTime = `${DD}D, ${hh}:${mm}`
                
                var data = {
                    id: "Nybo.ETS2.Navigation.estimatedTime",
                    value: `${estimatedTime}`
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
		
			async function getSpeedLimitSign(Speedlimit) {
				return new Promise(async (resolve, reject) => {
		
					let image_SpeedLimit_clone = image_SpeedLimit.clone()
		
					if (Speedlimit === 0) {
						resolve(fs.readFileSync(`${path}/images/noSpeedlimit.png`, `base64`))
					} else {
						image_SpeedLimit_clone.resize(300, 300)
						Jimp.loadFont(Jimp.FONT_SANS_128_BLACK).then(font => {
							image_SpeedLimit_clone.print(
								font,
								0,
								0, {
									text: `${Speedlimit}`,
									alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
									alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
								},
								300,
								300,
							)
							image_SpeedLimit_clone.getBase64Async(Jimp.AUTO)
								.then(base64 => {
									resolve(base64.slice(22))
								})
						})
					}
				})
			}	
		}
	}
	
	configloop()
	moduleloop()	
}
module.exports = navigationStates