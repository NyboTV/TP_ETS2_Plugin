// Import Node Modules
const TouchPortalAPI = require('touchportal-api');
const TPClient = new TouchPortalAPI.Client();
const pluginID = 'TP_ETS2_Plugin';
const http = require('request');
const https = require('https')
const fs = require('fs')
const fse = require("fs-extra")
const Jimp = require('jimp')
const exec = require('child_process').exec
const execute = require('child_process').execFile;
const replaceJSON = require('replace-json-property');
const { exit } = require('process');
const sJSON = require('self-reload-json')


// Important Script Vars
let path = ""

// Debug Section
const debugMode = process.argv.includes("--debug")
if(debugMode) {
    path = `./src`
} else {
    path = `.`
}


logIt("INFO", "Plugin is Starting...")
logIt("INFO", "Plugin is 'importing Modules'...")

// Script Modules
const test = require('./modules/test');
const gameStates = require('./modules/states/Game');
const worldStates = require('./modules/states/world');
const driverStates = require('./modules/states/driver');
const gaugeStates = require('./modules/states/gauge');
const jobStates = require('./modules/states/job');
const navigationStates = require('./modules/states/navigation');
const trailerStates = require('./modules/states/trailer');
const truckStates = require('./modules/states/truck');
const truckersmpStates = require('./modules/states/truckersmp');




logIt("INFO", "Plugin is loading 'Script Vars'...")
// Script Vars
let telemetry = ""
let telemetry_retry = 0

let pluginId = pluginID


logIt("INFO", "Plugin is loading 'Script Files'...")
// Script Files
let config = new sJSON(`${path}/config/cfg.json`)
let uConfig = new sJSON(`${path}/config/usercfg.json`)


logIt("INFO", "Plugin is loading 'Modules Loader'...")
// Modules Loader
function modules_loader() {
    setInterval(async() => {
        let telemetry_status = await Telemetry_Status()
        await Telemetry_Request(telemetry_status)
        
        if(telemetry_status === false) {
            return;
        }
        
        modules()
    }, 200);
}
    

logIt("INFO", "Plugin is loading 'Modules'...")
// Modules
function modules() {
    driverStates(TPClient, telemetry.game, logIt, timeout, config, uConfig, path)
    gameStates(TPClient, telemetry.game, logIt, timeout, config, uConfig, path)
    gaugeStates(TPClient, telemetry.truck, logIt, timeout, config, uConfig, path)
    jobStates(TPClient, telemetry, logIt, timeout, config, uConfig, path)
    navigationStates(TPClient, telemetry.navigation, logIt, timeout, config, uConfig, path)
    trailerStates(TPClient, telemetry, logIt, timeout, config, uConfig, path)
    truckStates(TPClient, telemetry, logIt, timeout, config, uConfig, path)
    truckersmpStates(TPClient, telemetry.game, logIt, timeout, config, uConfig, path)
    worldStates(TPClient, telemetry.game, logIt, timeout, config, uConfig, path)

}


logIt("INFO", "Plugin is loading 'Telemetry Section'...")
// Telemetry Section
function Telemetry_Status() {
    return new Promise(async (resolve) => {
        
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
            //logIt("INFO", `Telemetry: ${status}`)
            resolve(status)
        })    
    })
}
function Telemetry_Request(status) {
    return new Promise(async (resolve) => {
        
        if(status === false) {
            telemetry_retry = 0
            resolve()
        } else 
        
        http.get('http://localhost:25555/api/ets2/telemetry', function(err, resp, body) {
            
            var data = '';
            data = body
            
            if (err) {
                
                if(telemetry_retry === 1) {
                    return
                }
                logIt("WARN", `Telemetry Request Error! -> ${err}`)
                telemetry_retry = 1
                return;

            }
            
            try {

                data = JSON.parse(data)
                telemetry = data
                telemetry_retry = 0
                resolve()
            } catch (error) {

                if(telemetry_retry === 1) {
                    return
                }
                logIt("WARN", `Telemetry Data Request Error! -> ${err}`)
                telemetry_retry = 1
                return;
            }
        })
    })
}


// TouchPortal Info 
TPClient.on("Info", async(data) => {

    // Start
    logIt("INFO", "Plugin Connected to 'Touch Portal'")
    modules_loader()

});


logIt("INFO", "Plugin is connecting to 'Touch Portal'...")
TPClient.connect({
    pluginId
})
  

// Other Function
function timeout(ms) {
    return new Promise(async (resolve, reject) => {
        ms = Number(ms)
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

function logIt() {

    if(fs.existsSync(`${path}/logs`) === false) {
        fs.writeFileSync(`${path}/logs/latest.log`, "Plugin Started")
    }
    
    let curTime = new Date().toISOString().
    replace(/T/, ' ').
    replace(/\..+/, '')
    let message = [...arguments];
    let type = message.shift();
    console.log(curTime, ":", pluginID, ":" + type + ":", message.join(" "));
    fs.appendFileSync(`${path}/logs/latest.log`, `\n${curTime}:${pluginID}:${type}:${message.join(" ")}`)
}
