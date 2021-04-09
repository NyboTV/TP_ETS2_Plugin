const TouchPortalAPI = require('touchportal-api');
const TPClient = new TouchPortalAPI.Client();
const pluginId = 'TP_ETS2_Plugin';
const http = require('http');
const fs = require('fs')
const Jimp = require('jimp')

TPClient.on("Info", (data) => {
  logIt("DEBUG","Info : We received info from Touch-Portal");
  logIt('INFO',`Starting process watcher for Windows`);

  let Status_Connected = "Disconnected"
  let Game = "Nothing Found!"
  let Speed = "0"
  let SpeedGauge = ""
  let CruiseControlSpeed = "0"
  let CruiseControlOn = "false"
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
  let LightsParkingOn = "false"
  let LightsBeamLowOn = "false"
  let LightsBeamHighOn = "false"
  let LightsBeaconOn = "false"
  let LightsBrakeOn = "false"
  let LightsDashboardOn = "false"
  let TrailerAttached = "false"
  let Speedlimit = 0

  const Dashboard = async (GaugeOn, BlinkerOn) => {
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
        
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Connected", `${Status_Connected}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Game", `${Game}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.CruiseControlOn", `${CruiseControlOn}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Engine", `${Engine}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Electric", `${Electric}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Electric", `${Wipers}`);
        TPClient.stateUpdate("Nybo.ETS2.Dashboard.Electric", `${TrailerAttached}`);
        
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

          //console.log(`${BlinkerLeftOn} || ${BlinkerRightOn}`)
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
          
          async function main(rotate) {
            const image = await Jimp.read
            ('images/Gauge.png');
           
            image.rotate(rotate)
            image.resize(400, 400)
            .write('images/Gauge0.png')

            setTimeout(async() => {
              const image = await Jimp.read
              ('images/SpeedGauge.png');
              const image2 = await Jimp.read
              ('images/Gauge0.png');
              image.composite(image2, 0, 0)
              .write('images/Speed.png')

              setTimeout(() => {
                SpeedGauge = fs.readFileSync('images/Speed.png', 'base64');            
              }, 100);
            }, 100);
          }

          if(Speed < 1) {
            main(17) //17
          }
          if(Speed > 10 && Speed < 20) {
            main(5)
          }
          if(Speed > 20 && Speed < 30) {
            main(-8)
          } 
          if(Speed > 30 && Speed < 40) {
            main(-20)
          }
          if(Speed > 40 && Speed < 50) {
            main(-33)
          }
          if(Speed > 50 && Speed < 60) {
            main(-48)
          }
          if(Speed > 60 && Speed < 70) {
            main(-60)
          }
          if(Speed > 70 && Speed < 80) {
            main(-73)
          }
          if(Speed > 80 && Speed < 90) {
            main(-85)
          }
          if(Speed > 90 && Speed < 100) {
            main(-98)
          }
          if(Speed > 100 && Speed < 110) {
            main(-112)
          }
          if(Speed > 110 && Speed < 120) {
            main(-125)
          }
          if(Speed > 120) {
            main(-137)
          }

          TPClient.stateUpdate("Nybo.ETS2.Dashboard.Speed", `${Speed}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.SpeedGauge", `${SpeedGauge}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.RPM", `${RPM}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.Gear", `${Gear}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.CruiseControlSpeed", `${CruiseControlSpeed}`);
          TPClient.stateUpdate("Nybo.ETS2.Dashboard.Speedlimit", `${Speedlimit}`);
        }

        if(GaugeOn === 1) {
          DashboardGauge()
        }
        if(BlinkerOn === 1) {
          DashboardBlinkers()
        }
        
      })
    })
  }

  setInterval(() => {
    Dashboard(1, 1)
  }, 900);

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
  //console.log(curTime,":",pluginId,":"+type+":",message.join(" "));
}