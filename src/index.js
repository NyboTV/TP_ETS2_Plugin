const TouchPortalAPI = require('touchportal-api');
const TPClient = new TouchPortalAPI.Client();
const pluginId = 'TP_ETS2_Plugin';
const http = require('http');
const fs = require('fs')
const Jimp = require('jimp')
const exec = require('child_process').exec
const execute = require('child_process').execFile

TPClient.on("Info", (data) => {
  logIt("DEBUG","Info : We received info from Touch-Portal");
  logIt('INFO',`Starting process watcher for Windows`);

  var Retry = 0
  
  const Dashboard = async (GaugeOn, BlinkerOn, ServerTest) => {

    if(Retry === 5) {
      logIt("WARN","Telemetry Server not Found! Plugin closed after 5 Retrys!");
      process.exit()
    }
    
    if(ServerTest === 1) {
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
          setTimeout(() => {
            Dashboard(1, 1, 1)
          }, 5000);
        } else {
          Dashboard(1, 1, 0)
        }
      })
      return;
    }
    
    let Status_Connected = "Disconnected"
    let Game = "Nothing Found!"
    let CruiseControlOn = "false"
    let Speed = "0"
    let Gear = "0"
    let RPM = "0"
    let Fuel = "0"
    let FuelCap = "0"
    let Engine = "Off"
    let Electric = "Off"
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

    let TrailerAttached = "Not Attached"

    let CruiseControlSpeed = "0"
    let Speedlimit = 0

    let RPMGauge = ""
    let SpeedGauge = ""
    let FuelGauge = ""
    
    http.get('http://localhost:25555/api/ets2/telemetry', (resp) => {
      let data = '';  

      resp.on('data', (chunk) => {
        data += chunk;
      })
  
      resp.on('end', () => {
        data = JSON.parse(data)

        if(data.game.connected === false) {
          Status_Connected = "Disconnected"
        } else if (data.game.connected === true) {
          Status_Connected = "Connected"
        } else {
          Status_Connected = "Nothing??"
        }

        if(data.game.gameName === "ETS2") {
          Game = "ETS2"
        } else if(data.game.gameName === "ATS") {
          Game = "ATS"
        }

        if(data.truck.cruiseControlOn === true) {
          CruiseControlOn = "true"
        } else if (data.game.cruiseControlOn === false) {
          CruiseControlOn = "false"
        }

        if(data.truck.engineOn === true) {
          Engine = "Started"
        } else if (data.game.engineOn === false) {
          Engine = "Off"
        }

        if(data.truck.electric === true) {
          Electric = "On"
        } else if (data.game.electric === false) {
          Electric = "Off"
        }

        if(data.truck.wipersOn === true) {
          Wipers = "On"
        } else if (data.game.wipersOn === false) {
          Wipers = "Off"
        }

        if(data.trailer.attached === true) {
          TrailerAttached = "Attached"
        } else if (data.trailer.attached === false) {
          TrailerAttached = "Not Attached"
        }

        if(data.truck.lightsParkingOn === true) {
          LightsParkingOn = "On"
        } else if (data.trailer.attached === false) {
          LightsParkingOn = "Off"
        }

        if(data.truck.lightsBeamLowOn === true) {
          LightsBeamLowOn = "On"
        } else if (data.truck.lightsBeamLowOn === false) {
          LightsBeamLowOn = "Off"
        }

        if(data.truck.lightsBeamHighOn === true) {
          LightsBeamHighOn = "On"
        } else if (data.truck.lightsBeamHighOn === false) {
          LightsBeamHighOn = "Off"
        }

        if(data.truck.lightsBeaconOn === true) {
          LightsBeaconOn = "On"
        } else if (data.truck.lightsBeaconOn === false) {
          LightsBeaconOn = "Off"
        }

        if(data.truck.lightsBrakeOn === true) {
          LightsBrakeOn = "On"
        } else if (data.truck.lightsBrakeOn === false) {
          LightsBrakeOn = "Off"
        }

        if(data.truck.lightsDashboardOn === true) {
          LightsDashboardOn = "On"
        } else if (data.truck.lightsDashboardOn === false) {
          LightsDashboardOn = "Off"
        }
        
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Connected", `${Status_Connected}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Game", `${Game}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.CruiseControlOn", `${CruiseControlOn}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Engine", `${Engine}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Electric", `${Electric}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Wipers", `${Wipers}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.TrailerAttached", `${TrailerAttached}`);

        TPClient.stateUpdate("Nybo.ETS2.Dashboard.LightsParkingOn", `${LightsParkingOn}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.LightsBeamLowOn", `${LightsBeamLowOn}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.LightsBeamHighOn", `${LightsBeamHighOn}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.LightsBeaconOn", `${LightsBeaconOn}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.LightsBrakeOn", `${LightsBrakeOn}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.LightsDashboardOn", `${LightsDashboardOn}`);
        
        const DashboardBlinkers = async () => {
          if(data.truck.blinkerRightActive === true) {
            BlinkerRightOn = "true"
          } else {
            BlinkerRightOn = "false"
          }

          if(data.truck.blinkerLeftActive === true) {
            BlinkerLeftOn = "true"
          } else {
            BlinkerLeftOn = "false"
          }

          if(data.truck.blinkerLeftOn === true && data.truck.blinkerRightOn) {
            HazardLightsOn = "true"
          } else {
            HazardLightsOn = "false"
          }

          TPClient.stateUpdate("Nybo.ETS2.Dashboard.HazardLightsOn", `${HazardLightsOn}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.BlinkerRightOn", `${BlinkerRightOn}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.BlinkerLeftOn", `${BlinkerLeftOn}`);
        }
        
        const DashboardGauge = async () => {
          Speed = Math.round(data.truck.speed)
          RPM = Math.round(data.truck.engineRpm)
          Gear = data.truck.displayedGear
          CruiseControlSpeed = Math.round(data.truck.cruiseControlSpeed)
          Fuel = Math.round(data.truck.fuel)
          FuelCap = Math.round(data.truck.fuelCapacity)
          Speedlimit = data.navigation.speedLimit
          
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
              TPClient.stateUpdate("Nybo.ETS2.Dashboard.SpeedGauge", `${SpeedGauge}`);
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
              TPClient.stateUpdate("Nybo.ETS2.Dashboard.RPMGauge", `${RPMGauge}`);
            })
          }

          async function getFuelGauge(rotate) {
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
              FuelGauge = base64.slice(22)
              TPClient.stateUpdate("Nybo.ETS2.Dashboard.FuelGauge", `${FuelGauge}`);
            })
          }


          async function getSpeed() { // 8 5 3
            switch(true) {
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
            switch(true) {
              case isBetween(RPM, 0, 100): 
                await getRPMGauge(0) 
              break;
              case isBetween(RPM, 100, 300): 
                await getRPMGauge(10) 
              break;
              case isBetween(RPM, 300, 400): 
                await getRPMGauge(20) 
              break;
              case isBetween(RPM, 400, 700): 
                await getRPMGauge(30) 
              break;
              case isBetween(RPM, 700, 850): 
                await getRPMGauge(40) 
              break;
              case isBetween(RPM, 850, 1000): 
                await getRPMGauge(50) 
              break;
              case isBetween(RPM, 1000, 1200): 
                await getRPMGauge(60) 
              break;
              case isBetween(RPM, 1300, 1500): 
                await getRPMGauge(70) 
              break;
              case isBetween(RPM, 1500, 1700): 
                await getRPMGauge(80) 
              break;
              case isBetween(RPM, 1700, 1850): 
                await getRPMGauge(90) 
              break;
              case isBetween(RPM, 1850, 2000): 
                await getRPMGauge(100) 
              break;
              case isBetween(RPM, 2000, 2300): 
                await getRPMGauge(110) 
              break;
              case isBetween(RPM, 2300, 2400): 
                await getRPMGauge(120) 
              break;
              case isBetween(RPM, 2400, 2600): 
                await getRPMGauge(130) 
              break;
            }
          }

          async function getFuel() {
            switch(true) {
              case isBetween(Fuel, 0, 100): 
                await getFuelGauge(0) 
              break;
              case isBetween(Fuel, 100, 300): 
                await getFuelGauge(10) 
              break;
              case isBetween(Fuel, 300, 400): 
                await getFuelGauge(20) 
              break;
              case isBetween(Fuel, 400, 700): 
                await getFuelGauge(30) 
              break;
              case isBetween(Fuel, 700, 850): 
                await getFuelGauge(40) 
              break;
              case isBetween(Fuel, 850, 1000): 
                await getFuelGauge(50) 
              break;
              case isBetween(Fuel, 1000, 1200): 
                await getFuelGauge(60) 
              break;
              case isBetween(Fuel, 1300, 1500): 
                await getFuelGauge(70) 
              break;
              case isBetween(Fuel, 1500, 1700): 
                await getFuelGauge(80) 
              break;
              case isBetween(Fuel, 1700, 1850): 
                await getFuelGauge(90) 
              break;
              case isBetween(Fuel, 1850, 2000): 
                await getFuelGauge(100) 
              break;
              case isBetween(Fuel, 2000, 2300): 
                await getFuelGauge(110) 
              break;
              case isBetween(Fuel, 2300, 2400): 
                await getFuelGauge(120) 
              break;
              case isBetween(Fuel, 2400, 2600): 
                await getFuelGauge(130) 
              break;
            }
          }

          await getRPM()
          await getSpeed()
          //await getFuel()

          TPClient.stateUpdate("Nybo.ETS2.Dashboard.Speed", `${Speed}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.RPM", `${RPM}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.Gear", `${Gear}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.CruiseControlSpeed", `${CruiseControlSpeed}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.Speedlimit", `${Speedlimit}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.Fuel", `${Fuel}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.FuelCap", `${FuelCap}`);
        }

        if(GaugeOn === 1) {
          DashboardGauge()
        }
        if(BlinkerOn === 1) {
          DashboardBlinkers()
        }
        
      })
    })
    //*/

    setTimeout(() => {
      Dashboard(1, 1, 0)
    }, 200);
  }

  Dashboard(1, 1, 1)

});

TPClient.on("Settings",(data) => {

    //Do something with the Settings message here
    // Note: this can be called any time settings are modified or saved in the TouchPortal Settings window.
    /* 
      [{"Setting 1":"Value 1"},{"Setting 2":"Value 2"},...,{"Setting N":"Value N"}]
    */

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

function logIt() {
  var curTime = new Date().toISOString();
  var message = [...arguments];
  var type = message.shift();
  console.log(curTime,":",pluginId,":"+type+":",message.join(" "));
  fs.writeFileSync('./log.log', `${curTime}:${pluginId}:${type}:${message.join(" ")}`)
}