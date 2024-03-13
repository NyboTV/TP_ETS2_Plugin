// Loading Module
const fs = require('fs')
const Jimp = require('jimp')
const { logger } = require('../script/logger')
const pluginEvents = require('../script/emitter')

const navigationStates = async (TPClient, path, configs) => {
    const { config, userconfig } = configs

	var path2 = require('path')
	var moduleName = path2.basename(__filename).replace('.js','')

	let navigation
	let unit, unitOld
	let Speedlimit, SpeedlimitOld, SpeedlimitSign
	let estimatedDistance, estimatedDistanceOld
	let estimatedTime, estimatedTimeOld
	let timeFormat

    var DD, hh, mm
	
	var states = []
	
	// PNG Vars
	let image_SpeedLimit = await Jimp.read(`${path}/images/speedlimit.png`);

	logger.info(`[MODULES] - [${moduleName}] Module loaded`)
	
	pluginEvents.on(`${moduleName}States`, async (telemetry) => {
		// States
		states = []

		// Vars
		navigation = telemetry
		Speedlimit = navigation.speedLimit
		estimatedDistance = navigation.estimatedDistance
		estimatedTime = navigation.estimatedTime

		SpeedlimitSign
		
		timeFormat = userconfig.Basics.timeFormat
		timeFormat = timeFormat.toUpperCase()

		unit = userconfig.Basics.unit
		unit = unit.toLowerCase()


		if(Speedlimit !== SpeedlimitOld || unit !== unitOld) {
			SpeedlimitOld = Speedlimit		
			if(unit === "miles") {
				Speedlimit = Math.round(Speedlimit/1.609)
			}
			
			var data1 = {
				id: "Nybo.ETS2.Navigation.SpeedLimit",
				value: `${Speedlimit}`
			}
						
			SpeedlimitSign = await getSpeedLimitSign(Speedlimit)
			var data2 = {
				id: "Nybo.ETS2.Navigation.SpeedLimitSign",
				value: `${SpeedlimitSign}`
			}

			states.push(data1)
			states.push(data2)
		}		


		if(estimatedDistance !== estimatedDistanceOld || unitOld !== unit) {
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

		if(estimatedTime !== estimatedTimeOld) {
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
		
		unitOld = unit
		
		try {
			if(states.length > 0) {
				TPClient.stateUpdateMany(states);
				logger.debug(`Module '${moduleName} refreshed with ${states.length} values`)
			}
		} catch (error) {
			logger.error(`[MODULE] ${moduleName} Error: ${error}`)
		}
	})

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
module.exports = navigationStates