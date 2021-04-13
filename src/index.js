const TouchPortalAPI = require('touchportal-api');
const TPClient = new TouchPortalAPI.Client();
const pluginId = 'TP_ETS2_Plugin';
const http = require('http');
const https = require('https')
const fs = require('fs')
const Jimp = require('jimp')
const exec = require('child_process').exec
const execute = require('child_process').execFile

TPClient.on("Info", (data) => {
  logIt("DEBUG","Info : We received info from Touch-Portal");
  logIt('INFO',`Starting process watcher for Windows`);

  var Retry = 0
  
  
  // MAIN STATES
  let Status_Connected = "Disconnected"
  let Game = "Nothing Found!"

  let SleepTime = ""
  
  //Truck
  let Speed = "0"
  let RPM = "0"
  
  let Gear = "N"
  
  let Fuel = "0"
  let FuelCap = "0"
  
  let CruiseControlSpeed = "0"
  let CruiseControlOn = "false"
  let Speedlimit = "0"
  let SpeedLimitSign = ""
  
  let Electric = "Off"
  let Engine = "Off"
  let Wipers = "Off"
  
  let BlinkerRightOn = "false"
  let BlinkerLeftOn = "false"
  let HazardLightsOn = "false"
  
  let LightsParkingOn = "Off"
  let LightsBeamLowOn = "Off"
  let LightsBeamHighOn = "Off"
  let LightsBeaconOn = "Off"
  let LightsBrakeOn = "Off"
  let LightsDashboardOn = "Off"
  
  //TRAILER
  let TrailerAttached = "Not Attached"
  let TrailerMass = ""
  
  //JOB
  let Jobincome = ""
  let JobSourceCity = ""
  let JobSourceCompany = ""
  let JobDestinationCity = ""
  let JobDestinationCompany = ""

  //ICON
  let RPMGauge = ""
  let SpeedGauge = ""
  let FuelGauge = ""
  

  //TruckersMP STATES
  let TruckersMP_Status = ""
  let ServerName = ""
  let ServerPlayers = ""
  let ServerPlayerQueue = ""
  



  // SCRIPT STATES ONLY
  //MAIN
  let connection = false
  let gameName = "" 
  
  let SleepTimer = ""

  let cruiseControlOn = false
  
  let engineOn = false
  let electric = false
  let wipersOn = false
  
  let blinkerLeftActive = false
  let blinkerRightActive = false
  let blinkerLeftOn = false
  let blinkerRightOn = false 
  
  let attached = false
  
  let lightsParkingOn = false
  let lightsBeamLowOn = false
  let lightsBeamHighOn = false
  let lightsBeaconOn = false
  let lightsBrakeOn = false
  let lightsDashboardOn = false
  
  let Shifter = ""
  let Gears = 0
  
  //TruckersMP
  let Servers = ""


  // SETTINGS
  let TruckersMPServer = 0
  let RefreshInterval = 800
  
  const main = async (TruckersMPinterval) => {
  
    const DashboardAPI = async () => {
      try {
        http.get('http://localhost:25555/api/ets2/telemetry', (resp) => {
          let data = '';  
          
          resp.on('data', (chunk) => {
            data += chunk;
          })
          
          resp.on('end', () => {
            data = JSON.parse(data)
  
            game = data.game
            truck = data.truck
            trailer = data.trailer
            job = data.job
            navigation = data.navigation
  
            //Main
            SleepTime = game.nextRestStopTime

            //Game
            connection = game.connected
            gameName = game.gameName
  
            //Truck
            cruiseControlOn = truck.cruiseControlOn
  
            engineOn = truck.engineOn
            electric = truck.electric
            wipersOn = truck.wipersOn
  
            blinkerLeftActive = truck.blinkerLeftActive
            blinkerRightActive = truck.blinkerRightActive
            blinkerLeftOn = truck.blinkerLeftOn
            blinkerRightOn = truck.blinkerRightOn
  
            lightsParkingOn = truck.lightsParkingOn
            lightsBeamLowOn = truck.lightsBeamLowOn
            lightsBeamHighOn = truck.lightsBeamHighOn
            lightsBeaconOn = truck.lightsBeaconOn
            lightsBrakeOn = truck.lightsBrakeOn
            lightsDashboardOn = truck.lightsDashboardOn
            
            //TRAILER
            attached = trailer.attached
            TrailerMass = trailer.mass

            //JOB
            Jobincome = job.income
            JobSourceCity = job.sourceCity
            JobSourceCompany = job.sourceCompany
            JobDestinationCity = job.destinationCity
            JobDestinationCompany = job.destinationCompany

            //SCRIPT
            Shifter = truck.shifterType
  
            Gears = truck.displayedGear
            Speed = Math.round(truck.speed)
            RPM = Math.round(truck.engineRpm)
            RPMMax = Math.round(truck.engineRpmMax)
            CruiseControlSpeed = Math.round(truck.cruiseControlSpeed)
            Fuel = Math.round(truck.fuel)
            FuelCap = Math.round(truck.fuelCapacity)
            Speedlimit = navigation.speedLimit
    
          })
        })
      } catch (error) {
        logIt("WARN", `${error}`)
      }
    }

    const TruckersMPAPI = async () => {
      try {
        https.get('https://api.truckersmp.com/v2/servers', (resp) => {
          let data = '';  
          
          resp.on('data', (chunk) => {
            data += chunk;
          })
          
          resp.on('end', () => {
            data = JSON.parse(data)
  
            Servers = data.response.length
            Server = data.response[TruckersMPServer]
  
            ServerName = Server.name
            ServerPlayers = Server.players
            ServerPlayerQueue = Server.queue
  
  
          })
        })
      } catch (error) {
        logIt("WARN", `${error}`)
      }
    }
    
    const TruckersMP = async () => {
      
    }
    
    const Dashboard = async () => {
      
      if(connection === false) {
        Status_Connected = "Disconnected"
      } else if (connection === true) {
        Status_Connected = "Connected"
      } else {
        Status_Connected = "Nothing??"
      }
      
      if(gameName === "ETS2") {
        Game = "ETS2"
      } else if(gameName === "ATS") {
        Game = "ATS"
      }
      
      if(cruiseControlOn === true) {
        CruiseControlOn = "true"
      } else if (cruiseControlOn === false) {
        CruiseControlOn = "false"
      }
      
      if(engineOn === true) {
        Engine = "On"
      } else if (engineOn === false) {
        Engine = "Off"
      }
      
      if(electric === true) {
        Electric = "On"
      } else if (electric === false) {
        Electric = "Off"
      }
      
      if(wipersOn === true) {
        Wipers = "On"
      } else if (wipersOn === false) {
        Wipers = "Off"
      }
      
      if(attached === true) {
        TrailerAttached = "Attached"
      } else if (attached === false) {
        TrailerAttached = "Not Attached"
      }
      
      if(lightsParkingOn === true) {
        LightsParkingOn = "On"
      } else if (attached === false) {
        LightsParkingOn = "Off"
      }
      
      if(lightsBeamLowOn === true) {
        LightsBeamLowOn = "On"
      } else if (lightsBeamLowOn === false) {
        LightsBeamLowOn = "Off"
      }
      
      if(lightsBeamHighOn === true) {
        LightsBeamHighOn = "On"
      } else if (lightsBeamHighOn === false) {
        LightsBeamHighOn = "Off"
      }
      
      if(lightsBeaconOn === true) {
        LightsBeaconOn = "On"
      } else if (lightsBeaconOn === false) {
        LightsBeaconOn = "Off"
      }
      
      if(lightsBrakeOn === true) {
        LightsBrakeOn = "On"
      } else if (lightsBrakeOn === false) {
        LightsBrakeOn = "Off"
      }
      
      if(lightsDashboardOn === true) {
        LightsDashboardOn = "On"
      } else if (lightsDashboardOn === false) {
        LightsDashboardOn = "Off"
      }
      
      if (Shifter === "automatic") {
        if (Gears === 0) {
          Gear = "N"
        } else if (Gears === 1) {
          Gear = "D1"
        } else if (Gears === 2) {
          Gear = "D2"
        } else if (Gears === 3) {
          Gear = "D3"
        } else if (Gears === 4) {
          Gear = "D4"
        } else if (Gears === 5) {
          Gear = "D5"
        } else if (Gears === 6) {
          Gear = "D6"
        } else if (Gears === 7) {
          Gear = "D7"
        } else if (Gears === 8) {
          Gear = "D8"
        } else if (Gears === 9) {
          Gear = "D9"
        } else if (Gears === 10) {
          Gear = "D10"
        } else if (Gears === 11) {
          Gear = "D11"
        } else if (Gears === 12) {
          Gear = "D12"
        } else if (Gears === -1) {
          Gear = "R"
        }
      } else if (Shifter === "manual") {
        if (Gears === 0) {
          Gear = "N"
        } else if (Gears === -1) {
          Gear = "R1"
        } else if (Gears === -2) {
          Gear = "R2"
        } else if (Gears === -2) {
          Gear = "R3"
        }
      }

      if (Speedlimit === 0) {
        SpeedLimitSign = fs.readFileSync(`./images/noSpeedlimit.png`, `base64`)
      } else {
        const image = await Jimp.read
        ('images/speedlimit.png');
        image.resize(300, 300)
        Jimp.loadFont(Jimp.FONT_SANS_128_BLACK).then(font => {
          image.print(
            font, 
            0, 
            0,
            {
              text: `${Speedlimit}`,
              alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
              alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            },
            300,
            300,
          )
          image.getBase64Async(Jimp.AUTO)
          .then(base64 => {
              SpeedLimitSign = base64.slice(22)
          })
        })
      }

      SleepTime = new Date(SleepTime)
      SleepTimer = SleepTime.getHours()

      TrailerMass = Math.floor(TrailerMass / 1000)
    }

    const DashboardBlinkers = async () => {
      if(blinkerRightActive === true) {
        BlinkerRightOn = "true"
      } else {
        BlinkerRightOn = "false"
      }
      
      if(blinkerLeftActive === true) {
        BlinkerLeftOn = "true"
      } else {
        BlinkerLeftOn = "false"
      }
      
      if(blinkerLeftOn === true && blinkerRightOn === true) {
        HazardLightsOn = "true"
      } else {
        HazardLightsOn = "false"
      }
    }

    const DashboardGauge = async () => {
     
      function isBetween(n, a, b) {
        return (n - a) * (n - b) <= 0
      }
      
      async function getSpeedGauge(rotate) {
        var getSpeedGaugeRotate = -2
        const image = await Jimp.read
        ('images/Gauge.png');
        
        image.rotate(Math.floor(getSpeedGaugeRotate - rotate))
        image.resize(400, 400)
        const image2 = await Jimp.read
        ('images/SpeedGauge.png');
        image2.composite(image, 0, 0)
        image2.getBase64Async(Jimp.AUTO)
        .then(base64 => {
          SpeedGauge = base64.slice(22)
        })
      }
      
      async function getRPMGauge(rotate) {
        var getRPMGaugeRotate = -2
        const image = await Jimp.read
        ('images/Gauge.png');
        
        image.rotate(Math.floor(getRPMGaugeRotate - rotate))
        image.resize(400, 400)
        const image2 = await Jimp.read
        ('images/RPMGauge.png');
        image2.composite(image, 0, 0)
        image2.getBase64Async(Jimp.AUTO)
        .then(base64 => {
          RPMGauge = base64.slice(22)
        })
      }
      
      async function getFuelGauge(rotate) {
        var getRPMGaugeRotate = -2
        const image = await Jimp.read
        ('images/Gauge.png');
        
        image.rotate(Math.floor(getRPMGaugeRotate - rotate))
        image.resize(400, 400)
        const image2 = await Jimp.read
        ('images/FuelGauge.png');
        if(rotate > 170) {
          image2.resize(350, 350)
          image2.composite(image, -30, 0)
        } else if(isBetween(rotate, 84, 96) === true) { 
          image2.resize(400, 400)
          image2.composite(image, 0, 40)
        } else {
          image2.resize(300, 300)
          image2.composite(image, -55, -20)
        }
        image2.getBase64Async(Jimp.AUTO)
        .then(base64 => {
          FuelGauge = base64.slice(22)
        })
      }
      
      
      async function getSpeed() { // 8 5 3
        switch(true) {
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
      }
      
      async function getRPM() {
        let RPM2 = 0

        switch(true) {
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
          case isBetween(RPM, 1300, 1500): 
          RPM2 = 7
          break;
          case isBetween(RPM, 1500, 1700): 
          RPM2 = 8
          break;
          case isBetween(RPM, 1700, 1850): 
          RPM2 = 9
          break;
          case isBetween(RPM, 1850, 2000): 
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

        if(RPM > 5000) {
          RPM2 = 24
        }

        let Rotate = [
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
        
      }
      
      async function getFuel() {
        
        let FuelCap2 = FuelCap
        let Fuel2 = Fuel
        
        for(var i = 0;FuelCap2 > 20;i++) {
          FuelCap2 = Math.round(Math.floor(FuelCap2 / 1.1))
          Fuel2 = Math.round(Math.floor(Fuel2 / 1.1))
        }
        
        let Rotate = [
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
        
        getFuelGauge(Rotate[Fuel2])
        
      }

      await getRPM()
      await getSpeed()
      await getFuel()
      
    }

    const asyncFunc = async () => {
      
      if(TruckersMPinterval === 1) {
        await TruckersMPAPI()
        await TruckersMP()
      }

      await DashboardAPI()

      await Dashboard()
      await DashboardGauge()
      await DashboardBlinkers()
      
      let states = [
        { id: "Nybo.ETS2.Dashboard.Connected", value: `${Status_Connected}`},
        { id: "Nybo.ETS2.Dashboard.Game", value: `${Game}`},

        { id: "Nybo.ETS2.Dashboard.Speed", value: `${Speed}`},
        { id: "Nybo.ETS2.Dashboard.RPM", value: `${RPM}`},

        { id: "Nybo.ETS2.Dashboard.Gear", value: `${Gear}`},

        { id: "Nybo.ETS2.Dashboard.Fuel", value: `${Fuel}`},
        { id: "Nybo.ETS2.Dashboard.FuelCap", value: `${FuelCap}`},
        
        { id: "Nybo.ETS2.Dashboard.CruiseControlOn", value: `${CruiseControlOn}`},
        { id: "Nybo.ETS2.Dashboard.CruiseControlSpeed", value: `${CruiseControlSpeed}`},
        { id: "Nybo.ETS2.Dashboard.Speedlimit", value: `${Speedlimit}`},
        { id: "Nybo.ETS2.Dashboard.SpeedlimitSign", value: `${SpeedLimitSign}`},

        { id: "Nybo.ETS2.Dashboard.Electric", value: `${Wipers}`},
        { id: "Nybo.ETS2.Dashboard.Engine", value: `${Engine}`},
        { id: "Nybo.ETS2.Dashboard.Wipers", value: `${Electric}`},

        { id: "Nybo.ETS2.Dashboard.BlinkerRightOn", value: `${BlinkerRightOn}`},
        { id: "Nybo.ETS2.Dashboard.BlinkerLeftOn", value: `${BlinkerLeftOn}`},
        { id: "Nybo.ETS2.Dashboard.HazardLightsOn", value: `${HazardLightsOn}`},

        { id: "Nybo.ETS2.Dashboard.LightsParkingOn", value: `${LightsParkingOn}`},
        { id: "Nybo.ETS2.Dashboard.LightsBeamLowOn", value: `${LightsBeamLowOn}`},
        { id: "Nybo.ETS2.Dashboard.LightsBeamHighOn", value: `${LightsBeamHighOn}`},
        { id: "Nybo.ETS2.Dashboard.LightsBeaconOn", value: `${LightsBeaconOn}`},
        { id: "Nybo.ETS2.Dashboard.LightsBrakeOn", value: `${LightsBrakeOn}`},
        { id: "Nybo.ETS2.Dashboard.LightsDashboardOn", value: `${LightsDashboardOn}`},
        
        { id: "Nybo.ETS2.Dashboard.TrailerAttached", value: `${TrailerAttached}`},

        { id: "Nybo.ETS2.Dashboard.SpeedGauge", value: `${SpeedGauge}`},
        { id: "Nybo.ETS2.Dashboard.RPMGauge", value: `${RPMGauge}`},
        { id: "Nybo.ETS2.Dashboard.FuelGauge", value: `${FuelGauge}`},

        { id: "Nybo.ETS2.Dashboard.Servers", value: `${Servers}`},
        { id: "Nybo.ETS2.Dashboard.ServerName", value: `${ServerName}`},
        { id: "Nybo.ETS2.Dashboard.ServerPlayers", value: `${ServerPlayers}`},
        { id: "Nybo.ETS2.Dashboard.ServerPlayerQueue", value: `${ServerPlayerQueue}`},

        { id: "Nybo.ETS2.Dashboard.SleepTime", value: `${SleepTimer}`},
        { id: "Nybo.ETS2.Dashboard.TrailerMass", value: `${TrailerMass} Ton`},
        { id: "Nybo.ETS2.Dashboard.JobIncome", value: `${Jobincome} €`},

        { id: "Nybo.ETS2.Dashboard.JobSourceCity", value: `${JobSourceCity}`},
        { id: "Nybo.ETS2.Dashboard.JobSourceCompany", value: `${JobSourceCompany}`},

        { id: "Nybo.ETS2.Dashboard.JobDestinationCity", value: `${JobDestinationCity}`},
        { id: "Nybo.ETS2.Dashboard.JobDestinationCompany", value: `${JobDestinationCompany}`},

        //{ id: "", value: ``},
      ];

      TPClient.stateUpdateMany(states);
      console.log(SleepTimer)
      
      setTimeout(() => {
        main()
      }, RefreshInterval);
    }

    asyncFunc()

    //*/
  }

  const refreshing = async () => {
    let running = false

    if(fs.existsSync(`./server`)) {
      if(Retry === 5) {
        logIt("WARN","Telemetry Server not Found! Plugin closed after 5 Retrys!");
        process.exit()
      }
  
      const isRunning = (query, cb) => {
        let platform = process.platform;
        let cmd = '';
        switch (platform) {
          case 'win32' : cmd = `tasklist`; break;
          case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
          case 'linux' : cmd = `ps -A`; break;
          default: break;
        }
        exec(cmd, (err, stdout, stderr) => {
          cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
        });
      }
      
      isRunning('Ets2Telemetry.exe', (status) => {
        if(status === false) {
          execute('./server/Ets2Telemetry.exe', function(err, data) {
            if(err) {
              logIt("WARN","Telemetry Server could not be Started!");
            }
          })
          logIt("WARN","Telemetry Server not Found! Retry in 5 Seconds!");
          Retry = Math.floor(Retry + 1)
          running = false
          setTimeout(() => {
            refreshing()
          }, 5000);
  
        } else {
          running = true
          logIt("INFO", "Server loaded up! Script is starting!")
          setTimeout(() => {
            if(running === true) {
              main(0)
            }
          }, 0)
  
          setInterval(() => {
            if(running === true) {
              main(1)
            }
          }, 5000)
        }
      })
      return;
    } else {

      setTimeout(() => {
        main()
      }, 0);

      setInterval(() => {
        main(1)
      }, 5000)
    }
    
      
      
  }

  refreshing()
});
  

TPClient.on("Settings",(data) => {

  RefreshInterval = data[0]["Refresh Interval"]
  TruckersMPServer = data[1]["Truckers MP Server"]

});

TPClient.on("Update", (curVersion, newVersion) => {
  logIt("DEBUG",curVersion, newVersion);
});

TPClient.on("Close", (data) => {
  logIt("WARN","Closing due to TouchPortal sending closePlugin message"
  );
});

//Connects and Pairs to Touch Portal via Sockete
TPClient.connect({ pluginId });

fs.appendFileSync('./log.log', `\n`)
fs.appendFileSync('./log.log', `\n`)
fs.appendFileSync('./log.log', `\n`)
fs.appendFileSync('./log.log', `\n --------SCRIPT STARTED--------`)

function logIt() {
  var curTime = new Date().toISOString();
  var message = [...arguments];
  var type = message.shift();
  console.log(curTime,":",pluginId,":"+type+":",message.join(" "));
  fs.appendFileSync('./log.log', `\n${curTime}:${pluginId}:${type}:${message.join(" ")}`)
}