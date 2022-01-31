const navigationStates = async (TPClient, telemetry_path, logIt, timeout, images_path) => {
	// Loading Module
	const fs = require('fs')
	const Jimp = require('jimp')
	
	var path2 = require('path')
	var moduleName = path2.basename(__filename).replace('.js','')
	let ModuleLoaded = false
	
	async function loop () {
		
		if(fs.readFileSync(`${path}/config/usercfg.json`).navigationStates === false) {
			if(ModuleLoaded === true) { logIt("MODULE", `Module ${moduleName}States unloaded`) }
			ModuleLoaded = false
			return;
		} else if(ModuleLoaded === false) { 
			logIt("MODULE", `Module ${moduleName}States loaded`)
			ModuleLoaded = true 
		}

		// Vars
		var telemetry = fs.readFileSync(`${telemetry_path}/tmp.json`, 'utf8')
        var refreshInterval = fs.readFileSync(`${path}/config/cfg.json`).refreshInterval
	
	
		// Vars
		let Speedlimit = telemetry.speedLimit
		let image_SpeedLimit = await Jimp.read(`${images_path}/images/speedlimit.png`);
		let SpeedLimitSign = await getSpeedLimitSign(Speedlimit)
	
		// Module Stuff
		var states = [
			{
				id: "Nybo.ETS2.Dashboard.SpeedLimit",
				value: `${Speedlimit}`
			},
			{
				id: "Nybo.ETS2.Dashboard.SpeedLimitSign",
				value: `${SpeedLimitSign}`
			},
		]
	
		try {
            TPClient.stateUpdateMany(states);
            await timeout(refreshInterval)
            loop()
        } catch (error) {
            logIt("ERROR", `${moduleName}States Error: ${error}`)
            logIt("ERROR", `${moduleName}States Error. Retry in 3 Seconds`)
            await timeout(3000)
            loop()
        }
	
		async function getSpeedLimitSign(Speedlimit) {
			return new Promise(async (resolve, reject) => {
	
				let image_SpeedLimit_clone = image_SpeedLimit.clone()
	
				if (Speedlimit === 0) {
					resolve(fs.readFileSync(`${images_path}/images/noSpeedlimit.png`, `base64`))
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
module.exports = navigationStates