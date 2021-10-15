const TouchPortalAPI = require('touchportal-api');
const TPClient = new TouchPortalAPI.Client();
const pluginId = 'TP_ETS2_Plugin';
const http = require('request');
const https = require('https')
const fs = require('fs')
const Jimp = require('jimp')
const exec = require('child_process').exec
const execute = require('child_process').execFile;
const replaceJSON = require('replace-json-property')

const debugMode = process.argv.includes("--debug");


let RefreshInterval = 200

// Global Vars
let config = JSON.parse(fs.readFileSync('./config.json'))
let userConfig = JSON.parse(fs.readFileSync('./userSettings.json'))

if (debugMode) {
	server_path = "./src/server"
} else {
	server_path = "./server"
}

TPClient.on("Action", (data, hold) => {

	changeLocation = config.location

	if (data.actionId === "changeLocation") {
		if (changeLocation === "kmh") {
			replaceJSON.replace('./config.json', "location", "mph")
			changeLocation = "mph"
		} else if (changeLocation === "mph") {
			replaceJSON.replace('./config.json', "location", "kmh")
			changeLocation = "kmh"
		}
	}

});

TPClient.on("Info", (data) => {
	if (debugMode) logIt("DEBUG", "We received info from Touch-Portal");
	logIt('INFO', `Starting process watcher for Windows`);

	// Game States
	let Connected = false
	let GameType = ""
	let Paused = false
	let TelemetryPluginVersion = 0

	// World States
	let Time = ""

	// Driver States
	let NextRestStopTime = ""

	// Gauge States
	let SpeedGauge = ""
	let RPMGauge = ""
	let FuelGauge = ""

	// Truck States
	let Constructor = ""
	let Model = ""

	let CruiseControlSpeed = ""
	let CruiseControlOn = false

	let Speed = ""
	let EngineRPM = ""
	let Gear = ""

	let EngineOn = false
	let ElectricOn = false
	let WipersON = false
	let ParkBrakeOn = false
	let MotorBrakeOn = false

	let Fuel
	let AdBlue = ""
	let AirPressure = ""
	let OilTemp = ""
	let WaterTemp = ""
	let BatteryVoltage = ""

	let FuelWarningOn = false
	let AdBlueWarningOn = false
	let AirPressureWarningOn = false
	let AirPressureEmergencyOn = false
	let OilPressureWarningOn = false
	let WaterTempWarningOn = false
	let BatteryVoltageWarningOn = false

	let BlinkerLeftActive = false
	let BlinkerRightActive = false
	let BlinkerLeftOn = false
	let BlinkerRightOn = false
	let HazardLightsOn = false

	let LightsDashboardValue = ""
	let LightsDashboardOn = false
	let LightsParkingOn = false
	let LightsBeamLowOn = false
	let LightsBeamHighOn = false
	let LightsAuxFrontOn = false
	let LightsAuxRoofOn = false
	let LightsBeaconOn = false
	let LightsBrakeOn = false
	let LightsReverseOn = false

	// Trailer States
	let TrailerAttached = false
	let TrailerName = ""
	let TrailerChainType = ""
	//CARGO
	var CargoLoaded = false
	var CargoType = ""
	var CargoDamage = ""
	var CargoMass = ""


	// Job States
	let JobIncome = ""
	let JobRemainingTime = ""
	let JobSourceCity = ""
	let JobSourceCompany = ""
	let JobDestinationCity = ""
	let JobDestinationCompany = ""
	let JobEstimatedDistance = 0

	// Navigation States
	let Speedlimit = 0
	let SpeedLimitSign

	//TruckersMP States
	let Servers = ""
	let Server = ""
	let ServerName = ""
	let ServerPlayers = ""
	let ServerPlayerQueue = ""
	let APIOnline = ""



	// Script States
	let ShifterType = ""
	let EngineRPMmax = ""

	let FuelCapacity = ""

	let game = ""
	let truck = ""
	let trailer1 = ""
	let job = ""
	let cargo = ""
	let navigation = ""
	let finedEvent = ""
	let jobEvent = ""
	let tollgateEvent = ""
	let ferryEvent = ""
	let trainEvent = ""

	let HazardLightsCounter = ""

	let image_arrow = ""
	let image2_Speed = ""
	let image2_RPM = ""
	let image2_Fuel = ""
	let image_SpeedLimit = ""

	let TruckersMPInterval = 8999
	let TruckersMPServer = ""

	let changeLocation = ""

	let Currency = ""

	let Retry = 1
	let running = false

  	let test = 0


	// Script Settings:

	if (debugMode) {
		images_path = `./src/images`
	} else {
		images_path = `images`
	}

	const Telemetry_Request = async () => {
    http.get('http://localhost:25555/api/ets2/telemetry', function(err, resp, body) {
      
      var data = '';
      data = body
      
      if (err) {
		const telemetry_error = async() => {
			logIt("WARN", `Telemetry Request Error! -> ${err}`)
			running = false
			await timeout(2000)
		} 
		telemetry_error()
      }
      
      try {
        data = JSON.parse(data)
        
        game = data.game
        truck = data.truck
        trailer1 = data.trailer1
        job = data.job
        cargo = data.cargo
        navigation = data.navigation
        finedEvent = data.finedEvent
        jobEvent = data.jobEvent
        tollgateEvent = data.tollgateEvent
        ferryEvent = data.ferryEvent
        trainEvent = data.trainEvent
        
      } catch (error) {
        logIt("WARN", `Telemetry Data Request Error! -> ${error}`)
        running = false
      }
    })
	}
  

	const Game_States = async () => {

		Connected = game.connected
		GameType = game.gameName
		Paused = game.paused
		TelemetryPluginVersion = game.telemetryPluginVersion


		var states = [{
				id: "Nybo.ETS2.Dashboard.ConnectedStatus",
				value: `${Connected}`
			},
			{
				id: "Nybo.ETS2.Dashboard.GameType",
				value: `${GameType}`
			},
			{
				id: "Nybo.ETS2.Dashboard.IsPaused",
				value: `${Paused}`
			},
			//{ id: "Nybo.ETS2.Dashboard.", value: `${}`},
		]

		TPClient.stateUpdateMany(states);
	}

	const World_States = async () => {

		Time = new Date(game.time)
		Time = `${Time.getUTCHours()}:${Time.getUTCMinutes()}`

		var states = [{
			id: "Nybo.ETS2.Dashboard.Time",
			value: `${Time}`
		}, ]

		TPClient.stateUpdateMany(states);

	}

	const Driver_States = async () => {

		NextRestStopTime = new Date(game.nextRestStopTime)
		NextRestStopTime = `${NextRestStopTime.getUTCHours()}:${NextRestStopTime.getUTCMinutes()}`

		var states = [{
			id: "Nybo.ETS2.Dashboard.NextRestTime",
			value: `${NextRestStopTime}`
		}, ]

		TPClient.stateUpdateMany(states);
	}

	const Gauge_States = async () => {

		if (changeLocation === "mph") {
			Speed = Math.round(truck.speed / 2 + (truck.speed / 100 * 10))
			EngineRPM = Math.round(truck.engineRpm)
			Fuel = Math.round(truck.fuel)
			FuelCapacity = Math.round(truck.fuelCapacity)
		} else {
			Speed = Math.round(truck.speed)
			EngineRPM = Math.round(truck.engineRpm)
			Fuel = Math.round(truck.fuel)
			FuelCapacity = Math.round(truck.fuelCapacity)
		}

		SpeedGauge = await getSpeedGauge(Speed)
		RPMGauge = await getRPMGauge(EngineRPM)
		FuelGauge = await getFuelGauge(Fuel, FuelCapacity)

		var states = [{
				id: "Nybo.ETS2.Dashboard.SpeedGauge",
				value: `${SpeedGauge}`
			},
			{
				id: "Nybo.ETS2.Dashboard.RPMGauge",
				value: `${RPMGauge}`
			},
			{
				id: "Nybo.ETS2.Dashboard.FuelGauge",
				value: `${FuelGauge}`
			}
			//{ id: "Nybo.ETS2.Dashboard.", value: `${}`},
		]

		TPClient.stateUpdateMany(states);

	}

	const Truck_States = async () => {

		Constructor = truck.make
		Model = truck.model

		CruiseControlSpeed = truck.cruiseControlSpeed
		CruiseControlOn = truck.cruiseControlOn

		ShifterType = truck.shifterType
		Gear = truck.displayedGear

		Speed = Math.round(truck.speed)
		EngineRPM = Math.round(truck.engineRpm)
		Gear = await getGear(Gear, ShifterType)

		EngineOn = truck.engineOn
		ElectricOn = truck.electricOn
		WipersOn = truck.wipersOn
		ParkBrakeOn = truck.parkBrakeOn
		MotorBrakeOn = truck.motorBrakeOn

		Fuel = Math.round(truck.fuel)
		AdBlue = Math.round(truck.adblue)
		AirPressure = Math.round(truck.airPressure)
		OilTemp = Math.round(truck.oilTemperature)
		WaterTemp = Math.round(truck.waterTemperature)
		BatteryVoltage = Math.round(truck.batteryVoltage)

		FuelCapacity = Math.round(truck.fuelCapacity)

		FuelWarningOn = truck.fuelWarningOn
		AdBlueWarningOn = truck.adblueWarningOn
		AirPressureWarningOn = truck.airPressureWarningOn
		AirPressureEmergencyOn = truck.airPressureEmergencyOn
		OilPressureWarningOn = truck.oilPressureWarningOn
		WaterTempWarningOn = truck.waterTemperatureWarningOn
		BatteryVoltageWarningOn = truck.batteryVoltageWarningOn

		BlinkerLeftActive = truck.blinkerLeftActive
		BlinkerRightActive = truck.blinkerRightActive
		BlinkerLeftOn = truck.blinkerLeftOn
		BlinkerRightOn = truck.blinkerRightOn

		LightsDashboardValue = truck.lightsDashboardValue
		LightsDashboardOn = truck.lightsDashboardOn
		LightsParkingOn = truck.lightsParkingOn
		LightsBeamLowOn = truck.lightsBeamLowOn
		LightsBeamHighOn = truck.lightsBeamHighOn
		LightsAuxFrontOn = truck.lightsAuxFrontOn
		LightsAuxRoofOn = truck.lightsAuxRoofOn
		LightsBeaconOn = truck.lightsBeaconOn
		LightsBrakeOn = truck.lightsBrakeOn
		LightsReverseOn = truck.lightsReverseOn

		if (BlinkerLeftOn && BlinkerRightOn) {
			HazardLightsOn = true
			HazardLightsCounter = 1
		}

		if (HazardLightsCounter < 5) {
			HazardLightsCounter = Math.floor(HazardLightsCounter + 1)
		} else {
			HazardLightsOn = false
		}

		var states = [{
				id: "Nybo.ETS2.Dashboard.Truck_Make",
				value: `${Constructor}`
			},
			{
				id: "Nybo.ETS2.Dashboard.Model",
				value: `${Model}`
			},

			{
				id: "Nybo.ETS2.Dashboard.CruiseControlSpeed",
				value: `${CruiseControlSpeed}`
			},
			{
				id: "Nybo.ETS2.Dashboard.CruiseControlOn",
				value: `${CruiseControlOn}`
			},

			{
				id: "Nybo.ETS2.Dashboard.Speed",
				value: `${Speed}`
			},
			{
				id: "Nybo.ETS2.Dashboard.EngineRPM",
				value: `${EngineRPM}`
			},
			{
				id: "Nybo.ETS2.Dashboard.Gear",
				value: `${Gear}`
			},

			{
				id: "Nybo.ETS2.Dashboard.EngineOn",
				value: `${EngineOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.ElectricOn",
				value: `${ElectricOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.WipersON",
				value: `${WipersON}`
			},
			{
				id: "Nybo.ETS2.Dashboard.ParkBrakeOn",
				value: `${ParkBrakeOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.MotorBrakeOn",
				value: `${MotorBrakeOn}`
			},

			{
				id: "Nybo.ETS2.Dashboard.Fuel",
				value: `${Fuel}`
			},
			{
				id: "Nybo.ETS2.Dashboard.AdBlue",
				value: `${AdBlue}`
			},
			{
				id: "Nybo.ETS2.Dashboard.AirPressure",
				value: `${AirPressure}`
			},
			{
				id: "Nybo.ETS2.Dashboard.OilTemp",
				value: `${OilTemp}`
			},
			{
				id: "Nybo.ETS2.Dashboard.WaterTemp",
				value: `${WaterTemp}`
			},
			{
				id: "Nybo.ETS2.Dashboard.BatteryVoltage",
				value: `${BatteryVoltage}`
			},

			{
				id: "Nybo.ETS2.Dashboard.FuelCapacity",
				value: `${FuelCapacity}`
			},

			{
				id: "Nybo.ETS2.Dashboard.FuelWarningOn",
				value: `${FuelWarningOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.AdBlueWarningOn",
				value: `${AdBlueWarningOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.AirPressureWarningOn",
				value: `${AirPressureWarningOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.AirPressureEmergencyOn",
				value: `${AirPressureEmergencyOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.OilPressureWarningOn",
				value: `${OilPressureWarningOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.WaterTempWarningOn",
				value: `${WaterTempWarningOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.BatteryVoltageWarningOn",
				value: `${BatteryVoltageWarningOn}`
			},

			{
				id: "Nybo.ETS2.Dashboard.BlinkerLeftActive",
				value: `${BlinkerLeftActive}`
			},
			{
				id: "Nybo.ETS2.Dashboard.BlinkerRightActive",
				value: `${BlinkerRightActive}`
			},
			{
				id: "Nybo.ETS2.Dashboard.BlinkerLeftOn",
				value: `${BlinkerLeftOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.BlinkerRightOn",
				value: `${BlinkerRightOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.HazardLightsOn",
				value: `${HazardLightsOn}`
			},

			{
				id: "Nybo.ETS2.Dashboard.LightsDashboardValue",
				value: `${LightsDashboardValue}`
			},
			{
				id: "Nybo.ETS2.Dashboard.LightsDashboardOn",
				value: `${LightsDashboardOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.LightsParkingOn",
				value: `${LightsParkingOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.LightsBeamLowOn",
				value: `${LightsBeamLowOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.LightsBeamHighOn",
				value: `${LightsBeamHighOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.LightsAuxFrontOn",
				value: `${LightsAuxFrontOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.LightsAuxRoofOn",
				value: `${LightsAuxRoofOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.LightsBeaconOn",
				value: `${LightsBeaconOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.LightsBrakeOn",
				value: `${LightsBrakeOn}`
			},
			{
				id: "Nybo.ETS2.Dashboard.LightsReverseOn",
				value: `${LightsReverseOn}`
			},

			//{ id: "Nybo.ETS2.Dashboard.", value: `${}`},
		]

		TPClient.stateUpdateMany(states);
	}

	const Trailer_States = async () => {

		if (changeLocation === "mph") {
			TrailerAttached = trailer1.attached
			TrailerName = trailer1.name
			TrailerChainType = trailer1.chainType

			CargoLoaded = cargo.cargoLoaded
			CargoType = cargo.cargo
			CargoDamage = Math.round(cargo.damage * 100)
			CargoMass = Math.round(Math.floor(cargo.mass / 1000 * 1.102311))
		} else {
			TrailerAttached = trailer1.attached
			TrailerName = trailer1.name
			TrailerChainType = trailer1.chainType

			CargoLoaded = cargo.cargoLoaded
			CargoType = cargo.cargo
			CargoDamage = Math.round(cargo.damage * 100)
			CargoMass = Math.round(Math.floor(cargo.mass / 1000))
		}

		Weight = userConfig.Basics.Weight

		var states = [{
				id: "Nybo.ETS2.Dashboard.TrailerAttached",
				value: `${TrailerAttached}`
			},
			{
				id: "Nybo.ETS2.Dashboard.TrailerName",
				value: `${TrailerName}`
			},
			{
				id: "Nybo.ETS2.Dashboard.TrailerChainType",
				value: `${TrailerChainType}`
			},

			{
				id: "Nybo.ETS2.Dashboard.CargoLoaded",
				value: `${CargoLoaded}`
			},
			{
				id: "Nybo.ETS2.Dashboard.CargoType",
				value: `${CargoType}`
			},
			{
				id: "Nybo.ETS2.Dashboard.CargoDamage",
				value: `${CargoDamage}`
			},
			{
				id: "Nybo.ETS2.Dashboard.CargoMass",
				value: `${CargoMass} ${Weight}`
			},
		]

		TPClient.stateUpdateMany(states);

	}

	const Job_States = async () => {

		JobIncome = job.income
		JobRemainingTime = new Date(job.remainingTime)
		JobRemainingTime = `${JobRemainingTime.getUTCHours()}:${JobRemainingTime.getUTCMinutes()}`
		JobSourceCity = job.sourceCity
		JobSourceCompany = job.sourceCompany
		JobDestinationCity = job.destinationCity
		JobDestinationCompany = job.destinationCompany
		JobEstimatedDistance = navigation.estimatedDistance

		Currency = userConfig.Basics.Money

		var states = [{
				id: "Nybo.ETS2.Dashboard.JobIncome",
				value: `${JobIncome}${Currency}`
			},
			{
				id: "Nybo.ETS2.Dashboard.JobRemainingTime",
				value: `${JobRemainingTime}`
			},
			{
				id: "Nybo.ETS2.Dashboard.JobSourceCity",
				value: `${JobSourceCity}`
			},
			{
				id: "Nybo.ETS2.Dashboard.JobSourceCompany",
				value: `${JobSourceCompany}`
			},
			{
				id: "Nybo.ETS2.Dashboard.JobDestinationCity",
				value: `${JobDestinationCity}`
			},
			{
				id: "Nybo.ETS2.Dashboard.JobDestinationCompany",
				value: `${JobDestinationCompany}`
			},
			{
				id: "Nybo.ETS2.Dashboard.JobEstimatedDistance",
				value: `${JobEstimatedDistance}`
			},
		]

		TPClient.stateUpdateMany(states);

	}

	const Navigation_States = async () => {

		Speedlimit = navigation.speedLimit

		SpeedLimitSign = await getSpeedLimitSign(Speedlimit)

		var states = [{
				id: "Nybo.ETS2.Dashboard.SpeedLimit",
				value: `${Speedlimit}`
			},
			{
				id: "Nybo.ETS2.Dashboard.SpeedLimitSign",
				value: `${SpeedLimitSign}`
			},
		]

		TPClient.stateUpdateMany(states);
	}

	const TruckersMPAPI = async () => {
		try {
			
			TruckersMPServer = Number(config.TruckersMPServer)

			function IsJsonString(str) {
				try {
					JSON.parse(str);
				} catch (e) {
					return false;
				}
				return true;
			}

			https.get('https://api.truckersmp.com/v2/servers', (resp) => {
				var data = '';

				resp.on('data', (chunk) => {
					data += chunk;
				})

				resp.on('end', () => {

					if (IsJsonString(data) === true) {
						data = JSON.parse(data)

						Servers = data.response.length
						Server = data.response[TruckersMPServer]

						ServerName = Server.name
						ServerPlayers = Server.players
						ServerPlayerQueue = Server.queue
						APIOnline = true
					} else {

						Servers = "TruckersMP API Error!"
						Server = "TruckersMP API Error!"

						ServerName = "TruckersMP API Error!"
						ServerPlayers = "TruckersMP API Error!"
						ServerPlayerQueue = "TruckersMP API Error!"
						APIOnline = false

					}

					var states = [{
							id: "Nybo.ETS2.Dashboard.Servers",
							value: `${Servers}`
						},
						{
							id: "Nybo.ETS2.Dashboard.ServerName",
							value: `${ServerName}`
						},
						{
							id: "Nybo.ETS2.Dashboard.ServerPlayers",
							value: `${ServerPlayers}`
						},
						{
							id: "Nybo.ETS2.Dashboard.ServerPlayerQueue",
							value: `${ServerPlayerQueue}`
						},
						{
							id: "Nybo.ETS2.Dashboard.APIOnline",
							value: `${APIOnline}`
						},
					]

					TPClient.stateUpdateMany(states);
				})
			})
		} catch (error) {
			logIt("WARN", `${error}`)
		}
	}

	const Load_Modules = async () => {
    
    connected = false
		
    if (running) {
      Telemetry_Request()
    }
  
    Game_States()
    World_States()
    Driver_States()
    Gauge_States()
    Truck_States()
    Trailer_States()
    Job_States()
    Navigation_States()
    
	console.log(TruckersMPInterval)
	TruckersMPInterval = TruckersMPInterval + 1
	if (TruckersMPInterval > 9000) {
		TruckersMPAPI()
		TruckersMPInterval = 0
	}

    
    if(running) {
      await timeout(RefreshInterval)
      Load_Modules()
    }
	}
  

	const Module_Setup = async () => {
		image_arrow = await Jimp.read(`${images_path}/Gauge.png`);

		image2_Speed = await Jimp.read(`${images_path}/SpeedGauge.png`);

		image2_RPM = await Jimp.read(`${images_path}/RPMGauge.png`);

		image2_Fuel = await Jimp.read(`${images_path}/FuelGauge.png`);

		image_SpeedLimit = await Jimp.read(`${images_path}/speedlimit.png`);
	}

	Module_Setup()

	const Telemetry_Server = async () => {
		var server_path = "./server"
		if (debugMode) {
			server_path = "./src/server"
		}

		if (fs.existsSync(`${server_path}`)) {
			if (Retry === 5) {
				logIt("WARN", "Telemetry Server not Found! Plugin closed after 5 Retrys!");
				process.exit()
			}

			const isRunning = (query, cb) => {
				var platform = process.platform;
				var cmd = '';
				switch (platform) {
					case 'win32':
						cmd = `tasklist`;
						break;
					case 'darwin':
						cmd = `ps -ax | grep ${query}`;
						break;
					case 'linux':
						cmd = `ps -A`;
						break;
					default:
						break;
				}
				exec(cmd, (err, stdout, stderr) => {
					cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
				});
			}

			isRunning('Ets2Telemetry.exe', async (status) => {
        Telemetry_Server()
        if (status) {
					if (!running) {
						logIt("INFO", "Server loaded up! Script is starting!")
            Retry = 1
            running = true
            await timeout(1000)
            Load_Modules()
					}
        } else {
          running = false
					execute(`${server_path}/Ets2Telemetry.exe`, function(err, data) {
						if (err) {
							logIt("WARN", "Telemetry Server could not be Started!");
						}
					})

					if (Retry === 1) {
            logIt("INFO ", "Telemetry Server is starting...");
          } else {
						logIt("WARN", "Telemetry Server not Found! Retry in 5 Seconds!");
					}
					Retry = Math.floor(Retry+1)

        }
			})

		} else {
			logIt("ERROR", "Server folder not Found!")
			process.exit()
		}
	}

	Telemetry_Server()

	//Modules Functions
	async function getGear(Gears, Shifter) {
		return new Promise(async (resolve, reject) => {
			if (Shifter === "automatic") {
				if (Gears === 0) {
					resolve("N")
				} else if (Gears === 1) {
					resolve("D1")
				} else if (Gears === 2) {
					resolve("D2")
				} else if (Gears === 3) {
					resolve("D3")
				} else if (Gears === 4) {
					resolve("D4")
				} else if (Gears === 5) {
					resolve("D5")
				} else if (Gears === 6) {
					resolve("D6")
				} else if (Gears === 7) {
					resolve("D7")
				} else if (Gears === 8) {
					resolve("D8")
				} else if (Gears === 9) {
					resolve("D9")
				} else if (Gears === 10) {
					resolve("D10")
				} else if (Gears === 11) {
					resolve("D11")
				} else if (Gears === 12) {
					resolve("D12")
				} else if (Gears === -1) {
					resolve("R1")
				} else if (Gears === -2) {
					resolve("R2")
				} else if (Gears === -3) {
					resolve("R3")
				}
			} else if (Shifter === "manual") {
				if (Gears === 0) {
					resolve("N")
				} else if (Gears === 1) {
					resolve("1")
				} else if (Gears === 2) {
					resolve("2")
				} else if (Gears === 3) {
					resolve("3")
				} else if (Gears === 4) {
					resolve("4")
				} else if (Gears === 5) {
					resolve("5")
				} else if (Gears === 6) {
					resolve("6")
				} else if (Gears === 7) {
					resolve("7")
				} else if (Gears === 8) {
					resolve("8")
				} else if (Gears === 9) {
					resolve("9")
				} else if (Gears === 10) {
					resolve("10")
				} else if (Gears === 11) {
					resolve("11")
				} else if (Gears === 12) {
					resolve("12")
				} else if (Gears === -1) {
					resolve("-1")
				} else if (Gears === -2) {
					resolve("-2")
				} else if (Gears === -3) {
					resolve("-3")
				}
			}
		})
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

});

TPClient.on("Settings", (data) => {

});

TPClient.on("Update", (curVersion, remoteVersion) => {
	logIt("DEBUG", curVersion, remoteVersion);
});

TPClient.on("Close", (data) => {
	logIt("WARN", "Closing due to TouchPortal sending closePlugin message");

	/*
	logIt("INFO", "Packing latest Log Files...")

	let zipUpdater = new AdmZip()
	let zipIndex = new AdmZip()

	zipUpdater.addLocalFile("./logs/updater/latest.log")
	zipIndex.addLocalFile("./logs/index/latest.log")

	zipUpdater.writeZip(`./logs/updater/${date_time}.zip`)
	zipIndex.writeZip(`./logs/index/${date_time}.zip`)
	*/
});

TPClient.connect({
	pluginId
});

function timeout(ms) {
	return new Promise(async (resolve, reject) => {
		ms = Number(ms)
		setTimeout(() => {
			resolve();
		}, ms);
	})
}

function logIt() {

	let curTime = new Date().toISOString().
	replace(/T/, ' ').
	replace(/\..+/, '')
	let message = [...arguments];
	let type = message.shift();
	console.log(curTime, ":", pluginId, ":" + type + ":", message.join(" "));
	fs.appendFileSync('./logs/latest.log', `\n${curTime}:${pluginId}:${type}:${message.join(" ")}`)
}