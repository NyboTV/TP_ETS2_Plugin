const navigationStates = async (TPClient, telemetry, logIt, timeout, config, userconfig) => {
    const Jimp = require('jimp')

    // Loading Module
    var path = require('path')
    var moduleName = path.basename(__filename)

    // Vars
	let Speedlimit = telemetry.speedLimit
    let SpeedLimitSign = await getSpeedLimitSign(Speedlimit)
    let image_SpeedLimit = await Jimp.read(`${images_path}/speedlimit.png`);

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
    } catch (error) {
        logIt("ERROR", `${moduleName}States Error: ${error}`)
    }

    async function getSpeedLimitSign(Speedlimit) {
		return new Promise(async (resolve, reject) => {

			let image_SpeedLimit_clone = image_SpeedLimit.clone()

			if (Speedlimit === 0) {
				resolve(fs.readFileSync(`${images_path}/noSpeedlimit.png`, `base64`))
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