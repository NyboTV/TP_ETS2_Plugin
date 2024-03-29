// Loading Module
const { logger } = require('../script/logger')
const pluginEvents = require('../script/emitter')
const Jimp = require('jimp')

const gaugeStates = async (TPClient, path, configs) => {
    const { config, userconfig } = configs
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')

	var gauge
	var unit, unitOld
	let Speed, SpeedOld, SpeedGauge
	let EngineRPM, EngineRPMOld, EngineRPMMax, RPMGauge
	let Fuel, FuelOld
	let FuelCapacity, FuelCapacityOld, FuelGauge

	var states = []

	// PNG Vars
	let image_arrow_speed = await Jimp.read(`${path}/images/SpeedNeedle.png`);
	let image_arrow_rpm = await Jimp.read(`${path}/images/RPMNeedle.png`);
	let image_arrow_fuel = await Jimp.read(`${path}/images/FuelNeedle.png`);

	let image2_Speed
	let image2_Speed_KMH = await Jimp.read(`${path}/images/SpeedGauge_kmh.png`);
	let image2_Speed_MPH = await Jimp.read(`${path}/images/SpeedGauge_mph.png`);

	let image2_RPM = await Jimp.read(`${path}/images/RPMGauge.png`);
	let image2_Fuel = await Jimp.read(`${path}/images/FuelGauge.png`);

    logger.info(`[MODULES] - [${moduleName}] Module loaded`)

	pluginEvents.on(`${moduleName}States`, async (telemetry) => {
		// States
		states = []
	
		//Vars
		gauge = telemetry
		unit = userconfig.Basics.unit
		unit = unit.toLowerCase()
		Speed = gauge.speed			
		EngineRPM = gauge.engineRpm
		EngineRPMMax = 3000
		Fuel = gauge.fuel
		FuelCapacity = gauge.fuelCapacity
	
		if(Speed !== SpeedOld || unit !== unitOld) {
			SpeedOld = Speed
	
			if (unit === "miles") {
				Speed = Math.floor(Speed / 1.609344)
			} else {
				Speed = Math.round(Speed)
			}
	
			if(Speed < 0) {
				Speed = Math.abs(Speed)
			}
			
			SpeedGauge = await getSpeedGauge(Speed, unit)
	
			var data = {
				id: "Nybo.ETS2.Gauges.SpeedGauge",
				value: `${SpeedGauge}`
			}
	
			states.push(data)
		}
	
	
		if(EngineRPM !== EngineRPMOld) {
			EngineRPMOld = EngineRPM
	
			EngineRPM = Math.round(gauge.engineRpm)
			RPMGauge = await getRPMGauge(EngineRPM)
	
			var data = {
				id: "Nybo.ETS2.Gauges.RPMGauge",
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
				id: "Nybo.ETS2.Gauges.FuelGauge",
				value: `${FuelGauge}`
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
	
	function isBetween(n, a, b) {
		return (n - a) * (n - b) <= 0
	}
	
	async function getSpeedGauge(Speed, unit) {
	return new Promise(async (resolve, reject) => {
		if(unit === "miles") {
			image2_Speed = image2_Speed_MPH
		} else {
			image2_Speed = image2_Speed_KMH
		}
		
		async function getSpeedGauge(rotate) {
			var getSpeedGaugeRotate = -2
			
			let image_Speed_clone = image_arrow_speed.clone()
			let image2_Speed_clone = image2_Speed.clone()
			
			image_Speed_clone.rotate(Math.floor(rotate))
			image_Speed_clone.resize(400, 400)
			image2_Speed_clone.resize(400, 400)
			image2_Speed_clone.composite(image_Speed_clone, 0, 0)
			image2_Speed_clone.getBase64Async(Jimp.AUTO)
	
			.then(base64 => {
				resolve(base64.slice(22))
			})
		}
	
		if(unit === "miles") {
			// -288
			Speed = Math.floor(Speed/0.382)
		} else {
			// -261
			Speed = Math.floor(Speed/0.765)
		}
		
		Speed = -Speed 
		await getSpeedGauge(Speed)
		
	})
	}
	
	async function getRPMGauge(RPM) {
	return new Promise(async (resolve, reject) => {
		async function getRPMGauge(rotate) {
			var getRPMGaugeRotate = -10
	
			let image_RPM_clone = image_arrow_rpm.clone()
			let image2_RPM_clone = image2_RPM.clone()
	
			image_RPM_clone.rotate(Math.floor(getRPMGaugeRotate - rotate))
			image_RPM_clone.resize(400, 400)
			image2_RPM_clone.resize(400, 400)
			image2_RPM_clone.composite(image_RPM_clone, 0, 0)
			image2_RPM_clone.getBase64Async(Jimp.AUTO)
				.then(base64 => {
					resolve(base64.slice(22))
				})
		}
	
		for (var i = 0; EngineRPMMax >= 230; i++) {
			EngineRPMMax = Math.round(Math.floor(EngineRPMMax * 0.95))
			EngineRPM = Math.round(Math.floor(EngineRPM * 0.95))
		}
		// 230
	
		if(EngineRPM === 0) {
			getRPMGauge(-9)
		} else {
			getRPMGauge(EngineRPM)
		}
	})
	}
	
	async function getFuelGauge(Fuel, FuelCapacity) {
	return new Promise(async (resolve, reject) => {
		async function getFuelGauge(rotate) {
			var getFuelGaugeRotate = -2
	
			let image_Fuel_clone = image_arrow_fuel.clone()
			let image2_Fuel_clone = image2_Fuel.clone()
	
			image_Fuel_clone.rotate(Math.floor(getFuelGaugeRotate - rotate))
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
	
		for (var i = 0; FuelCapacity > 118; i++) {
			FuelCapacity = Math.round(Math.floor(FuelCapacity / 1.1))
			Fuel = Math.round(Math.floor(Fuel / 1.1))
		}
	
		getFuelGauge(Fuel)
	})
	}
}

module.exports = gaugeStates

