const navigationStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
	// Loading Module
	const fs = require('fs')
    const sJSON = require('self-reload-json')
	const Jimp = require('jimp')
	
	var path2 = require('path')
	var moduleName = path2.basename(__filename).replace('.js','')
	let ModuleLoaded = false

	let navigation = ""

	let image_SpeedLimit = await Jimp.read(`${path}/images/speedlimit.png`);

	// Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
    var telemetry = new sJSON(`${telemetry_path}/tmp.json`)

	// Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(500), configLoop++) {
            if(module.Modules.navigationStates === false) {
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
            } else 
			// Vars		
            navigation = telemetry.navigation
			let Speedlimit = navigation.speedLimit
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
				
			} catch (error) {
				logIt("ERROR", `${moduleName}States Error: ${error}`)
				logIt("ERROR", `${moduleName}States Error. Retry in 3 Seconds`)
				await timeout(3000)
				
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