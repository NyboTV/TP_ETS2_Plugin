const gaugeStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig) => {
    // Loading Module
    const fs = require('fs')
    const sJSON = require('self-reload-json')
	const Jimp = require('jimp')
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

	var gauge = ""

	var unit = ""
	var unitOld = ""

	let Speed = ""
	let SpeedOld = ""
	let SpeedGauge = ""

	let EngineRPM = ""
	let EngineRPMOld = ""
	let RPMGauge = ""

	let Fuel = ""
	let FuelOld = ""

	let FuelCapacity = ""
	let FuelCapacityOld = ""
	let FuelGauge = ""

	var states = []

	// Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)
	let telemetry = new sJSON(`${telemetry_path}/tmp.json`)

	// PNG Vars
	let image_arrow = await Jimp.read(`${path}/images/Gauge.png`);
	let image2_Speed = await Jimp.read(`${path}/images/SpeedGauge.png`);
	let image2_RPM = await Jimp.read(`${path}/images/RPMGauge.png`);
	let image2_Fuel = await Jimp.read(`${path}/images/FuelGauge.png`);

	// Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(500), configLoop++) {
            if(module.Modules.gaugeStates === false) {
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
            } else 

			// States
			states = []

			//Vars
			gauge = telemetry.truck
			unit = userconfig.Basics.unit
            unit = unit.toLowerCase()

			Speed = gauge.speed			
			EngineRPM = gauge.engineRpm
			Fuel = gauge.fuel
			FuelCapacity = gauge.fuelCapacity

			if(Speed !== SpeedOld || unit !== unitOld) {
				SpeedOld = Speed
				unitOld = unit

				if (unit === "imperial") {
					Speed = Math.floor(Speed / 1.609344)
				} else {
					Speed = Math.round(Speed)
				}
				
				SpeedGauge = await getSpeedGauge(Speed)

				var data = {
					id: "Nybo.ETS2.Dashboard.SpeedGauge",
					value: `${SpeedGauge}`
				}

				states.push(data)
			}


			if(EngineRPM !== EngineRPMOld) {
				EngineRPMOld = EngineRPM

				EngineRPM = Math.round(gauge.engineRpm)
				RPMGauge = await getRPMGauge(EngineRPM)

				var data = {
					id: "Nybo.ETS2.Dashboard.RPMGauge",
					value: `${RPMGauge}`
				}

				states.push(data)
			}

			if(Fuel !== FuelOld || FuelCapacity !== FuelCapacityOld) {
				FuelOld = Fuel
				FuelCapacityOld = FuelCapacity
				
				Fuel = Math.round(gauge.fuel)
				FuelCapacity = Math.round(gauge.fuelCapacity)
				
				FuelGauge = await getFuelGauge(Fuel, FuelCapacity)

				var data = {
					id: "Nybo.ETS2.Dashboard.FuelGauge",
					value: `${FuelGauge}`
				}

				states.push(data)
			}
						
			// Module Stuff
	
			try {
				if(states.length > 0) {
					TPClient.stateUpdateMany(states);
				}
			} catch (error) {
				logIt("ERROR", `${moduleName}States Error: ${error}`)
				logIt("ERROR", `${moduleName}States Error. Retry...`)
			}
			
			function isBetween(n, a, b) {
				return (n - a) * (n - b) <= 0
			}
			
			async function getSpeedGauge(Speed) {
				return new Promise(async (resolve, reject) => {
					
					async function getSpeedGauge(rotate) {
						var getSpeedGaugeRotate = -2
						
						let image_Speed_clone = image_arrow.clone()
						let image2_Speed_clone = image2_Speed.clone()
						
						image_Speed_clone.rotate(Math.floor(getSpeedGaugeRotate - rotate))
						image_Speed_clone.resize(400, 400)
						image2_Speed_clone.composite(image_Speed_clone, 0, 0)
						image2_Speed_clone.getBase64Async(Jimp.AUTO)
						.then(base64 => {
							resolve(base64.slice(22))
						})
					}
					
					switch (true) {
						case isBetween(Speed, -35, -38):
							await getSpeedGauge(25)
							break;
						case isBetween(Speed, -33, -35):
							await getSpeedGauge(22)
							break;
						case isBetween(Speed, -30, -33):
							await getSpeedGauge(19)
							break;
						case isBetween(Speed, -28, -30):
							await getSpeedGauge(16)
							break;
						case isBetween(Speed, -25, -28):
							await getSpeedGauge(13)
							break;
						case isBetween(Speed, -23, -25):
							await getSpeedGauge(10)
							break;
						case isBetween(Speed, -20, -23):
							await getSpeedGauge(7)
							break;
						case isBetween(Speed, -18, -20):
							await getSpeedGauge(4)
							break;
						case isBetween(Speed, -15, -18):
							await getSpeedGauge(1)
							break;
						case isBetween(Speed, -13, -15):
							await getSpeedGauge(-2)
							break;
						case isBetween(Speed, -10, -13):
							await getSpeedGauge(-5)
							break;
						case isBetween(Speed, -8, -10):
							await getSpeedGauge(-8)
							break;
						case isBetween(Speed, -5, -8):
							await getSpeedGauge(-12)
							break;
						case isBetween(Speed, -3, -5):
							await getSpeedGauge(-17)
							break;
						case isBetween(Speed, 0, -3):
							await getSpeedGauge(-20)
							break;
						case isBetween(Speed, 0, 3):
							await getSpeedGauge(-20)
							break;
						case isBetween(Speed, 3, 5):
							await getSpeedGauge(-17)
							break;
						case isBetween(Speed, 5, 8):
							await getSpeedGauge(-12)
							break;
						case isBetween(Speed, 8, 10):
							await getSpeedGauge(-8)
							break;
						case isBetween(Speed, 10, 13):
							await getSpeedGauge(-5)
							break;
						case isBetween(Speed, 13, 15):
							await getSpeedGauge(-2)
							break;
						case isBetween(Speed, 15, 18):
							await getSpeedGauge(1)
							break;
						case isBetween(Speed, 18, 20):
							await getSpeedGauge(4)
							break;
						case isBetween(Speed, 20, 23):
							await getSpeedGauge(7)
							break;
						case isBetween(Speed, 23, 25):
							await getSpeedGauge(10)
							break;
						case isBetween(Speed, 25, 28):
							await getSpeedGauge(13)
							break;
						case isBetween(Speed, 28, 30):
							await getSpeedGauge(16)
							break;
						case isBetween(Speed, 30, 33):
							await getSpeedGauge(19)
							break;
						case isBetween(Speed, 33, 35):
							await getSpeedGauge(22)
							break;
						case isBetween(Speed, 35, 38):
							await getSpeedGauge(25)
							break;
						case isBetween(Speed, 38, 40):
							await getSpeedGauge(28)
							break;
						case isBetween(Speed, 40, 43):
							await getSpeedGauge(32)
							break;
						case isBetween(Speed, 43, 45):
							await getSpeedGauge(35)
							break;
						case isBetween(Speed, 45, 48):
							await getSpeedGauge(39)
							break;
						case isBetween(Speed, 48, 50):
							await getSpeedGauge(43)
							break;
						case isBetween(Speed, 50, 53):
							await getSpeedGauge(46)
							break;
						case isBetween(Speed, 53, 55):
							await getSpeedGauge(50)
							break;
						case isBetween(Speed, 55, 58):
							await getSpeedGauge(57)
							break;
						case isBetween(Speed, 58, 60):
							await getSpeedGauge(60)
							break;
						case isBetween(Speed, 60, 63):
							await getSpeedGauge(63)
							break;
						case isBetween(Speed, 63, 65):
							await getSpeedGauge(66)
							break;
						case isBetween(Speed, 65, 68):
							await getSpeedGauge(69)
							break;
						case isBetween(Speed, 68, 70):
							await getSpeedGauge(72)
							break;
						case isBetween(Speed, 70, 73):
							await getSpeedGauge(75)
							break;
						case isBetween(Speed, 73, 75):
							await getSpeedGauge(78)
							break;
						case isBetween(Speed, 75, 78):
							await getSpeedGauge(81)
							break;
						case isBetween(Speed, 78, 80):
							await getSpeedGauge(84)
							break;
						case isBetween(Speed, 80, 83):
							await getSpeedGauge(87)
							break;
						case isBetween(Speed, 83, 85):
							await getSpeedGauge(90)
							break;
						case isBetween(Speed, 85, 88):
							await getSpeedGauge(93)
							break;
						case isBetween(Speed, 88, 90):
							await getSpeedGauge(95)
							break;
						case isBetween(Speed, 90, 93):
							await getSpeedGauge(100)
							break;
						case isBetween(Speed, 93, 95):
							await getSpeedGauge(103)
							break;
						case isBetween(Speed, 98, 100):
							await getSpeedGauge(105)
							break;
						case isBetween(Speed, 100, 103):
							await getSpeedGauge(110)
							break;
						case isBetween(Speed, 103, 105):
							await getSpeedGauge(113)
							break;
						case isBetween(Speed, 105, 108):
							await getSpeedGauge(117)
							break;
						case isBetween(Speed, 108, 110):
							await getSpeedGauge(120)
							break;
						case isBetween(Speed, 110, 113):
							await getSpeedGauge(123)
							break;
						case isBetween(Speed, 113, 115):
							await getSpeedGauge(125)
							break;
						case isBetween(Speed, 116, 118):
							await getSpeedGauge(130)
							break;
						case isBetween(Speed, 118, 120):
							await getSpeedGauge(135)
							break;
		
					}
		
		
		
				})
			}
		
			async function getRPMGauge(RPM) {
				return new Promise(async (resolve, reject) => {
					async function getRPMGauge(rotate) {
						var getRPMGaugeRotate = -2
		
						let image_RPM_clone = image_arrow.clone()
						let image2_RPM_clone = image2_RPM.clone()
		
						image_RPM_clone.rotate(Math.floor(getRPMGaugeRotate - rotate))
						image_RPM_clone.resize(400, 400)
						image2_RPM_clone.composite(image_RPM_clone, 0, 0)
						image2_RPM_clone.getBase64Async(Jimp.AUTO)
							.then(base64 => {
								resolve(base64.slice(22))
							})
					}
		
					var RPM2 = 0
		
					switch (true) {
						case isBetween(RPM, 0, 100):
							RPM2 = 0
							break;
						case isBetween(RPM, 100, 300):
							RPM2 = 1
							break;
						case isBetween(RPM, 300, 400):
							RPM2 = 2
							break;
						case isBetween(RPM, 400, 700):
							RPM2 = 3
							break;
						case isBetween(RPM, 700, 850):
							RPM2 = 4
							break;
						case isBetween(RPM, 850, 1000):
							RPM2 = 5
							break;
						case isBetween(RPM, 1000, 1200):
							RPM2 = 6
							break;
						case isBetween(RPM, 1200, 1300):
							RPM2 = 7
							break;
						case isBetween(RPM, 1300, 1500):
							RPM2 = 8
							break;
						case isBetween(RPM, 1500, 1800):
							RPM2 = 9
							break;
						case isBetween(RPM, 1800, 2000):
							RPM2 = 10
							break;
						case isBetween(RPM, 2000, 2300):
							RPM2 = 11
							break;
						case isBetween(RPM, 2300, 2400):
							RPM2 = 12
							break;
						case isBetween(RPM, 2400, 2600):
							RPM2 = 13
							break;
						case isBetween(RPM, 2600, 2800):
							RPM2 = 14
							break;
						case isBetween(RPM, 2800, 3000):
							RPM2 = 15
							break;
						case isBetween(RPM, 3000, 3200):
							RPM2 = 16
							break;
						case isBetween(RPM, 3200, 3400):
							RPM2 = 17
							break;
						case isBetween(RPM, 3400, 3600):
							RPM2 = 18
							break;
						case isBetween(RPM, 3600, 3800):
							RPM2 = 19
							break;
						case isBetween(RPM, 4000, 4200):
							RPM2 = 20
							break;
						case isBetween(RPM, 4200, 4400):
							RPM2 = 21
							break;
						case isBetween(RPM, 4600, 4800):
							RPM2 = 22
							break;
						case isBetween(RPM, 5000, 5200):
							RPM2 = 23
							break;
					}
		
					if (RPM > 5000) {
						RPM2 = 24
					}
		
					var Rotate = [
						0,
						10,
						20,
						30,
						40,
						50,
						60,
						70,
						80,
						90,
						100,
						110,
						120,
						130,
						140,
						150,
						160,
						170,
						180,
						190,
						200,
						210,
						220,
						230,
						240
					]
		
					getRPMGauge(Rotate[RPM2])
				})
			}
		
			async function getFuelGauge(Fuel, FuelCapacity) {
				return new Promise(async (resolve, reject) => {
					async function getFuelGauge(rotate) {
						var getRPMGaugeRotate = -2
		
						let image_Fuel_clone = image_arrow.clone()
						let image2_Fuel_clone = image2_Fuel.clone()
		
						image_Fuel_clone.rotate(Math.floor(getRPMGaugeRotate - rotate))
						image_Fuel_clone.resize(400, 400)
						if (rotate > 170) {
							image2_Fuel_clone.resize(350, 350)
							image2_Fuel_clone.composite(image_Fuel_clone, -30, 0)
						} else if (isBetween(rotate, 84, 96) === true) {
							image2_Fuel_clone.resize(400, 400)
							image2_Fuel_clone.composite(image_Fuel_clone, 0, 40)
						} else {
							image2_Fuel_clone.resize(300, 300)
							image2_Fuel_clone.composite(image_Fuel_clone, -55, -20)
						}
						image2_Fuel_clone.getBase64Async(Jimp.AUTO)
							.then(base64 => {
								resolve(base64.slice(22))
							})
					}
		
					for (var i = 0; FuelCapacity > 20; i++) {
						FuelCapacity = Math.round(Math.floor(FuelCapacity / 1.1))
						Fuel = Math.round(Math.floor(Fuel / 1.1))
					}
		
					var Rotate = [
						57,
						60,
						66,
						72,
						84,
						90,
						96,
						102,
						108,
						114,
						117,
						126,
						132,
						138,
						144,
						150,
						156,
						162,
						168,
						174,
						180
					]
		
					getFuelGauge(Rotate[Fuel])
				})
			}
		}
	}

	configloop()
	moduleloop()
}

module.exports = gaugeStates