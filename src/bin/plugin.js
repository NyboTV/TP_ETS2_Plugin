// Import Node Modules
const TouchPortalAPI = require(`touchportal-api`);
const TPClient = new TouchPortalAPI.Client();
const pluginID = `TP_ETS2_Plugin`;
const http = require(`request`);
const https = require('https')
const fs = require(`fs`)
const exec = require(`child_process`).exec
const execute = require(`child_process`).execFile;
const replaceJSON = require(`replace-json-property`).replace
const sJSON = require(`self-reload-json`)
const axios = require('axios');
const { app, BrowserWindow, Tray, nativeImage, Notification } = require('electron');


// Important Script Vars
let path = ""
let cfg_path = ""
let telemetry_path = ""
let interface_path = ""
let TruckersMP_tmp = ""
let TruckersMP_Serverlist = ""

let open_settings = false
let frame = false
let version = ""

var ping = false

let notificationShowed = false
let NOTIFICATION_TITLE = ''
let NOTIFICATION_BODY = ''

let testNumber = 0

let PluginStarted = false
let PluginOnline = false
let PluginStandBy = false

let PluginStatus = "Offline"

let dirpath = process.cwd()
let dirname = dirpath.includes(`\\src\\bin`)

// Debug Section
const debugMode = process.argv.includes("--debug")
const sourceTest = process.argv.includes("--sourceTest")
const noServer = process.argv.includes("--noServer")
const OfflineMode = process.argv.includes("--Offline") 

if(debugMode) {
    path = `./src/bin`
    cfg_path = path
    interface_path = `./src/bin`
    telemetry_path = "./src/bin/tmp"
} else if(sourceTest) {
    function sourcetest() {
        setInterval(() => {
            console.log("Still On...")
        }, 2000)
        return;
    }
    sourcetest()

} else if(dirname) {
    console.log("You are Trying to start the Script inside the Source Folder without Debug mode! Abort Start...") 
} else {
    path = dirpath
    cfg_path = path
    interface_path = dirpath
    telemetry_path = "./tmp"
}

// Checks and creates if neccessary Logs Folder
if(fs.existsSync(`./logs`)) {  } else { fs.mkdirSync(`./logs`) }

logIt("INFO", "Starting...")

const configs = async () => {
    
    logIt("CONFIG", "Loading `Config Files`...")
    // Script Files
    let config = new sJSON(`${path}/config/cfg.json`)
    let uConfig = new sJSON(`${path}/config/usercfg.json`)

    webinterface(config, uConfig)

    for(var i = 0; i < Infinity; await timeout(2000), i++) {
        if(fs.existsSync(telemetry_path + "/truckersMP_TMP.json")) {
            try {
                TruckersMP_tmp = new sJSON(`${telemetry_path}/truckersMP_TMP.json`)
                logIt("TRUCKERSMP", "TMP File found and loaded!")
                return
            } catch (error) {
                logIt("ERROR", "TruckersMP TMP File Error!")
            }
        }
    }
}


const plugin = async (config, uConfig) => {
    

    logIt("INFO", "Checking for Missing Files...")
    // Checking for missing Files
    let firstInstall = config.firstInstall
    const FilesCheck = async () => {
        let missing = []
        if(!fs.existsSync(`${path}/images`)) { missing.push("Images Folder") }
        if(!fs.existsSync(`${path}/images/Gauge.png`)) { missing.push("Gauge.png") }
        if(!fs.existsSync(`${path}/images/RPMGauge.png`)) { missing.push("RPMGauge.png") }
        if(!fs.existsSync(`${path}/images/FuelGauge.png`)) { missing.push("FuelGauge.png") }
        if(!fs.existsSync(`${path}/images/SpeedGauge.png`)) { missing.push("SpeedGauge.png") }
        if(!fs.existsSync(`${path}/images/speedlimit.png`)) { missing.push("speedlimit.png") }
        if(!fs.existsSync(`${path}/images/noSpeedlimit.png`)) { missing.push("noSpeedlimit.png") }

        
        if(!fs.existsSync(`${path}/server`)) { missing.push("Server Folder") }
        if(!fs.existsSync(`${path}/server/Ets2Plugins`)) { missing.push("Ets2Plugins") }
        if(!fs.existsSync(`${path}/server/Ets2Plugins/win_x64`)) { missing.push("Ets2Plugins/win_x64") }
        if(!fs.existsSync(`${path}/server/Ets2Plugins/win_x86`)) { missing.push("Ets2Plugins/win_x86") }
        if(!fs.existsSync(`${path}/server/Ets2Plugins/win_x64/plugins`)) { missing.push("Ets2Plugins/../plugins") }
        if(!fs.existsSync(`${path}/server/Ets2Plugins/win_x86/plugins`)) { missing.push("Ets2Plugins/../plugins") }
        if(!fs.existsSync(`${path}/server/Ets2Plugins/win_x64/plugins/ets2-telemetry-server.dll`)) { missing.push("../plugins/ets2-telemetry-server.dll") }
        if(!fs.existsSync(`${path}/server/Ets2Plugins/win_x86/plugins/ets2-telemetry-server.dll`)) { missing.push("../plugins/ets2-telemetry-server.dll") }
        if(!fs.existsSync(`${path}/server/Ets2Telemetry.exe.config`)) { missing.push("Ets2Telemetry.exe.config") }
        if(!fs.existsSync(`${path}/server/Ets2TestTelemetry.json`)) { missing.push("Ets2TestTelemetry.json") }
        if(!fs.existsSync(`${path}/server/Owin.dll`)) { missing.push("Owin.dll") }
        if(!fs.existsSync(`${path}/server/Microsoft.Practices.ServiceLocation.dll`)) { missing.push("Microsoft.Practices.ServiceLocation.dll") }
        if(!fs.existsSync(`${path}/server/Microsoft.Owin.Cors.dll`)) { missing.push("Microsoft.Owin.Cors.dll") }
        if(!fs.existsSync(`${path}/server/System.Web.Cors.dll`)) { missing.push("System.Web.Cors.dll") }
        if(!fs.existsSync(`${path}/server/Owin.WebSocket.dll`)) { missing.push("Owin.WebSocket.dll") }
        if(!fs.existsSync(`${path}/server/Microsoft.Owin.Security.dll`)) { missing.push("Microsoft.Owin.Security.dll") }
        if(!fs.existsSync(`${path}/server/System.Web.Http.Owin.dll`)) { missing.push("System.Web.Http.Owin.dll") }
        if(!fs.existsSync(`${path}/server/Microsoft.Owin.Hosting.dll`)) { missing.push("Microsoft.Owin.Hosting.dll") }
        if(!fs.existsSync(`${path}/server/Microsoft.Owin.dll`)) { missing.push("Microsoft.Owin.dll") }
        if(!fs.existsSync(`${path}/server/Microsoft.Owin.Host.HttpListener.dll`)) { missing.push("Microsoft.Owin.Host.HttpListener.dll") }
        if(!fs.existsSync(`${path}/server/System.Net.Http.Formatting.dll`)) { missing.push("System.Net.Http.Formatting.dll") }
        if(!fs.existsSync(`${path}/server/log4net.dll`)) { missing.push("log4net.dll") }
        if(!fs.existsSync(`${path}/server/Microsoft.AspNet.SignalR.Core.dll`)) { missing.push("Microsoft.AspNet.SignalR.Core.dll") }
        if(!fs.existsSync(`${path}/server/Ets2Telemetry.log`)) { missing.push("Ets2Telemetry.log") }
        if(!fs.existsSync(`${path}/server/System.Web.Http.dll`)) { missing.push("System.Web.Http.dll") }
        if(!fs.existsSync(`${path}/server/Ets2Telemetry.exe`)) { missing.push("Ets2Telemetry.exe") }
        if(!fs.existsSync(`${path}/server/Newtonsoft.Json.dll`)) { missing.push("Newtonsoft.Json.dll") }
        if(!fs.existsSync(`${path}/server/Microsoft.Owin.Diagnostics.dll`)) { missing.push("Microsoft.Owin.Diagnostics.dll") }


        if(!fs.existsSync(`${telemetry_path}`)) { fs.mkdirSync(`${telemetry_path}`) }

        missing.forEach(file => {
            logIt("MISSING", `File/Folder missing: "${file}"`)
        })
    }
    if(firstInstall) {
        await FilesCheck()
    }


    logIt("INFO", "Importing Modules...")
    // Script Modules
    const test = require(`./modules/test`);

    const driverStates = require(`./modules/states/driver`);
    const gameStates = require(`./modules/states/Game`);
    const gaugeStates = require(`./modules/states/gauge`);
    const jobStates = require(`./modules/states/job`);
    const navigationStates = require(`./modules/states/navigation`);
    const trailerStates = require(`./modules/states/trailer`);
    const truckStates = require(`./modules/states/truck`);
    const truckersmpStates = require(`./modules/states/truckersmp`);
    const worldStates = require(`./modules/states/world`);
    
    
    logIt("INFO", "Loading `Script Vars`...")
    // Script Vars
    let telemetry = ""
    let telemetry_retry = 0
    let telemetry_retry_start = 0
    let refreshInterval = config.refreshInterval
    
    let telemetry_status = false
    let telemetry_status_online = false
    let pluginId = pluginID
    
    
    if(refreshInterval >= 100) {
    } else {
        replaceJSON(`${path}/config/cfg.json`, "refreshInterval", 100)
        logIt("WARN", "RefreshRate too low! Setting up RefreshRate...")
        refreshInterval = 100
    }

    // Modules Loader
    function main_loader() {
        const telemetry_loop = async () => {
            telemetry_status = await Telemetry_Status()
            await Telemetry_Request(telemetry_status)
            
            await timeout(refreshInterval)
            telemetry_loop()
        }
        
        
        const main_loop = async () => {
            if(noServer) {
                telemetry_status_online = true
            }

            if(telemetry_status_online === false) {
                await timeout(refreshInterval)
                main_loop()
            } else
            modules()
        }
        
        logIt("INFO", "Loading `Telemetry Server`...")
        if(noServer === false) {
            telemetry_loop()
        }
        logIt("INFO", "Loading `Modules`...")
        main_loop()
    }
    
    // Modules
    async function modules() {
        await driverStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig) 
        await gameStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig)
        await gaugeStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig)
        await jobStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, OfflineMode)
        await navigationStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig)
        await trailerStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig)
        await truckStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig)
        await truckersmpStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig)
        await worldStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig)

        await timeout(200)
        logIt("INFO", "Modules loaded.")
        logIt("INFO", "Starting Loop.")
        PluginOnline = true
    }
    
    
    // Telemetry Section
    function Telemetry_Status() {
        return new Promise(async (resolve) => {
            
            const isRunning = (query, cb) => {
                let platform = process.platform;
                let cmd = ``;
                switch (platform) {
                    case `win32` : cmd = `tasklist`; break;
                    case `darwin` : cmd = `ps -ax | grep ${query}`; break;
                    case `linux` : cmd = `ps -A`; break;
                    default: break;
                }
                exec(cmd, (err, stdout, stderr) => {
                    cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
                });
            }
            
            isRunning(`Ets2Telemetry.exe`, (status) => {
                if(status) {
                    resolve(status)
                    telemetry_retry_start = 0
                } else {
                    if(telemetry_retry_start === 0) {
                        telemetry_status_online = false
                        execute(`${path}/server/Ets2Telemetry.exe`, function(err, data) {
                            logIt("ERROR", err)
                            logIt("ERROR",data.toString())
                        });
                        telemetry_retry_start = 1
                    }
                    resolve(status)
                }
            })    
        })
    }
    function Telemetry_Request(status) {
        return new Promise(async (resolve) => {
            
            if(status === false) {
                telemetry_retry = 0
                resolve()
                return
            } else 
            
            http.get(`http://localhost:25555/api/ets2/telemetry`, function(err, resp, body) {
                
                var data = ``;
                data = body
                
                if (err) {
                    telemetry_status_online = false
                    
                    if(telemetry_retry === 1) {
                        resolve()
                    }
                    logIt("WARN", `Telemetry Request Error! -> ${err}`)
                    telemetry_retry = 1
                    
                    async function resolveIt() {
                        await timeout(3000)
                        resolve()
                    }
                    resolveIt() 
                    
                } else
                
                try {
                    data = JSON.parse(data)
                    telemetry = JSON.stringify(data)                    
                    telemetry_retry = 0
                    telemetry_status_online = true
                    fs.writeFileSync(`${telemetry_path}/tmp.json`, `${telemetry}`, `utf8`)
                    resolve()
                } catch (error) {
                    telemetry_status_online = false
                    
                    if(telemetry_retry === 1) {
                        resolve()
                    }
                    logIt("WARN", `Telemetry Data Request Error! -> ${err}`)
                    telemetry_retry = 1
                    async function resolveIt() {
                        await timeout(3000)
                        resolve()
                    }
                    resolveIt()   
                }
            })
        })
    }
    
    
    // TouchPortal Info 
    TPClient.on("Info", async(data) => {
        // Start
        logIt("INFO", "Loading 'Main Loader'...")
        main_loader()
    });

    TPClient.on("Action", async (data,hold) => {

        let settings = data.data[0].value

        if (settings === "open") {
            open_settings = true
        }

    })

    TPClient.on("Update", (curVersion, remoteVersion) => {

        let optionsArray = [
          {
            "id":`${pluginId}Update`,
            "title":"Take Me to Download"
          },
          {
            "id":`${pluginId}Ignore`,
            "title":"Ignore Update"
          }
        ];
    
        TPClient.sendNotification(`${pluginId}UpdateNotification`,"My Plugin has been updated", `A new version of my plugin ${remoteVersion} is available to download`, optionsArray);
    });

    logIt("INFO", "Connecting to `Touch Portal`...")
    TPClient.connect({pluginId, "updateUrl":"https://raw.githubusercontent.com/NyboTV/TP_ETS2_Plugin/master/package.json" })
}

const webinterface = async (config, uConfig) => {

    //Electron Window
    window_browser(config)

    // Loading Modules
    const express = require('express');
    const hbs = require('express-handlebars');
    const app = express();
    const path = require('path')
    const pid = require('pidusage')
    const getFolderSize = require("get-folder-size")

    var driverStates = false
    var gameStates = false
    var gaugeStates = false
    var jobStates = false
    var navigationStates = false
    var trailerStates = false
    var truckStates = false
    var truckersmpStates = false
    var worldStates = false

    var unit = ""
    var unit2 = ""
    var currency = ""
    var currency_list = ""
    var weight = ""
    var weight2 = ""
    var temp = ""
    var temp2 = ""

    var TruckersMP = ""

    var truckmpStatus = ""
    var truckmpServer = ""
    var truckmpPlayer = ""
    var truckmpQueue = ""
    var truckmpServerList = ""
    
    var cpu_usage = ""
    var mem_usage = ""
    var storage_usage = ""

    var cur_user = ""


    async function StatesStatus () {
        for (var i = 0; i < Infinity; await timeout(500), i++) {
            driverStates        = uConfig.Modules.driverStates
            gameStates          = uConfig.Modules.gameStates
            gaugeStates         = uConfig.Modules.gaugeStates
            jobStates           = uConfig.Modules.jobStates
            navigationStates    = uConfig.Modules.navigationStates
            trailerStates       = uConfig.Modules.trailerStates
            truckStates         = uConfig.Modules.truckStates
            truckersmpStates    = uConfig.Modules.truckersmpStates
            worldStates         = uConfig.Modules.worldStates


            if( [driverStates,gameStates,gaugeStates,jobStates,navigationStates,trailerStates,truckStates,truckersmpStates,worldStates].some(el => el == true)) {
                if(PluginOnline)        { PluginOnline = "1" }      else { PluginOnline = "2" }
                if(PluginOnline === "1") { PluginStatus = "Online" } else { PluginStatus = "Offline" }  
            } else {
                PluginOnline = "3"
                PluginStatus = "StandBy"
                PluginStandBy = true
            }
        }
    }
    

    async function userCFGInterface () {
        for (var i = 0; i < Infinity; await timeout(500), i++) {
            unit = uConfig.Basics.unit
            unit = unit.toLowerCase()

            weight = uConfig.Basics.weight
            weight = weight.toLowerCase()

            temp = uConfig.Basics.temp
            temp = temp.toLowerCase()

            currency = uConfig.Basics.currency
            currency_list = await getCurrency()
            currency_list.splice(currency_list.indexOf(currency), 1);
            
            if(unit === "miles") {
                unit2 = false
            } else {
                unit2 = true
            }

            if(weight === "pounds") {
                weight2 = false
            } else {
                weight2 = true
            }

            if(temp === "fahrenheit") {
                temp2 = false
            } else {
                temp2 = true
            }
        }
    }


    async function TruckersMPInterface () {

        var TruckersMP_Array = []
        
        async function truckmp_array () {
            for (var i = 0; i < Infinity; await timeout(500), i++) {

                TruckersMP_Array = []
                try {
                    TruckersMP_tmp.response.forEach(server => {
                        TruckersMP_Array.push(server.name)
                    })
                } catch (e) {
                }

            }
        }

        async function truckmp () {
            for (var i = 0; i < Infinity; await timeout(500), i++) {
                try {
                    if(TruckersMP_tmp.response.id === "false") {
                        truckmpStatus = "OFFLINE"
                        truckmpServer = "OFFLINE"
                        truckmpPlayer = "OFFLINE"
                        truckmpQueue = "OFFLINE"
                        truckmpServerList = "OFFLINE"
                    } else {                    
                        TruckersMP = TruckersMP_tmp.response[uConfig.TruckersMP.TruckersMPServer]
                        
                        truckmpStatus = "ONLINE"
                        truckmpServer = TruckersMP.name
                        truckmpPlayer = TruckersMP.players
                        truckmpQueue = TruckersMP.queue
                        truckmpServerList = TruckersMP_tmp.response

                        TruckersMP_Serverlist.forEach

                        TruckersMP_Serverlist = TruckersMP_Array
                    }
                    
                } catch (e) {
                    truckmpStatus = "OFFLINE"
                    truckmpServer = "API ERROR"
                    truckmpPlayer = "API ERROR"
                    truckmpQueue = "API ERROR"
                    truckmpServerList = "API ERROR"
                }
            }
        }
        

        truckmp_array()
        truckmp()
    }


    async function usage () {
        for (var i = 0; i < Infinity; await timeout(500), i++) {
            pid(process.pid, async function (err, stats) {
                cpu_usage = Math.round(stats.cpu * 100) / 100 + "%"
                mem_usage = Math.round(stats.memory / 1024 / 1024) + " MB"

                getFolderSize(dirpath, function(err, size) {
                    if (err) { throw err; }
                  
                    
                    storage_usage = size
                    storage_usage = (storage_usage / 1000 / 1000).toFixed(2)
                    if(storage_usage >= 1000) {
                        storage_usage = (storage_usage / 1000).toFixed(2) + " GB"
                    } else {
                        storage_usage = storage_usage + " MB"
                    }
                });
            })
        }
    }

    async function cur_user_online () {

        for (var i = 0; i < Infinity; await timeout(30000), i++) {
            ping = await serverPing(ping)
            console.log(ping)
            if(ping) {
                axios.get('http://82.165.69.157:5000/ets2_plugin')
                .then(response => {
                    response = response.data
                    cur_user = response.current_user
                })
                .catch(e => {
                    logIt("ERROR", "An Error Appeared! " + e)
                    cur_user = "Server Offline"
                })
            } else {
                cur_user = "Server Offline"
            }
        }
    }

    app.engine('hbs', hbs.engine({
        extname: 'hbs', 
        defaultLayout: 'interface', 
        layoutsDir: interface_path + '/interface',
    }))

    StatesStatus()
    userCFGInterface()
    TruckersMPInterface()
    usage()
    cur_user_online()

    app.set('views', path.join(interface_path, '/interface'))
    app.set('view engine', 'hbs')
    app.use(express.static(path.join(interface_path, '/interface')))
    
    logIt("INTERFACE", "Loading Interface...")


    app.get("/", (req, res) => {
        res.render("interface", {
            driverStates: driverStates,  
            gameStates: gameStates,
            gaugeStates: gaugeStates,
            jobStates: jobStates,
            navigationStates: navigationStates,
            trailerStates: trailerStates,
            truckStates: truckStates,
            truckersmpStates: truckersmpStates,
            worldStates: worldStates,

            cpu_usage: cpu_usage,
            mem_usage: mem_usage,
            storage_usage: storage_usage,

            PluginOnline: PluginOnline,
            PluginStatus: PluginStatus,  

            UserOnline: cur_user,
            version: config.version,

            unit: unit2,
            currency: currency,
            currency_list: currency_list,
            weight: weight2,
            temp: temp2,

            truckmpStatus: truckmpStatus,
            truckmpServer: truckmpServer,
            truckmpPlayer: truckmpPlayer,
            truckmpQueue: truckmpQueue,
            truckmpServerList: truckmpServerList,

        })
    })

    app.post('/setup', async (req, res) => {

        var data = req.rawHeaders
        var data2 = req.rawHeaders

        for( var i = 0; i < data.length; i++){ 
            if ( data[i] === "request") { 
                data = data[i+1] 
            }
        }

        for( var i = 0; i < data2.length; i++){ 
            if ( data2[i] === "request_data") { 
                data2 = data2[i+1] 
            }
        }

        try {
            switch (data) {
                case `gameStates`:
                    if(gameStates) {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, false)
                    } else {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, true)
                    }
                break;
                
                case `driverStates`:
                    if(driverStates) {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, false)
                    } else {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, true)
                    }
                break;
                
                case `gaugeStates`:
                    if(gaugeStates) {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, false)
                    } else {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, true)
                    }
                break;
                
                case `jobStates`:
                    if(jobStates) {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, false)
                    } else {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, true)
                    }
                break;
                
                case `navigationStates`:
                    if(navigationStates) {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, false)
                    } else {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, true)
                    }
                break;
                
                case `trailerStates`:
                    if(trailerStates) {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, false)
                    } else {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, true)
                    }
                break;
                
                case `truckStates`:
                    if(truckStates) {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, false)
                    } else {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, true)
                    }
                break;
                
                case `truckersmpStates`:
                    if(truckersmpStates) {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, false)
                    } else {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, true)
                    }
                break;
                
                case `worldStates`:
                    if(worldStates) {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, false)
                    } else {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `${data}`, true)
                    }
                break;
    
    
    
                case `currency`:

                    currency = data2
                    if(currency !== uConfig.Basics.currency) {   
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `currency`, `${currency}`)
                    }
    
                break;
    
                case `unit`:
                    let units = [
                        "Miles",
                        "Kilometer"
                    ]
    
                    var position = units.indexOf(uConfig.Basics.unit)
    
                    var unit = units[position + 1]
    
                    if(unit === undefined) {
                        unit = "Miles"
                    }
    
                    replaceJSON(`${cfg_path}/config/usercfg.json`, `unit`, `${unit}`)
    
                break;

                case `weight`:
                    let weights = [
                        "Tons",
                        "Pounds"
                    ]
    
                    var position = weights.indexOf(uConfig.Basics.weight)
    
                    var weight = weights[position + 1]
    
                    if(weight === undefined) {
                        weight = "Tons"
                    }
    
                    replaceJSON(`${cfg_path}/config/usercfg.json`, `weight`, `${weight}`)
    
                break;

                case `temp`:
                    let temps = [
                        "Celsius",
                        "Fahrenheit"
                    ]
    
                    var position = temps.indexOf(uConfig.Basics.temp)
    
                    var temp = temps[position + 1]
    
                    if(temp === undefined) {
                        temp = "Celsius"
                    }
    
                    replaceJSON(`${cfg_path}/config/usercfg.json`, `temp`, `${temp}`)
    
                break;


    
                case `server`:

                    if(data2 === "-1") {
                        return
                    }

                    replaceJSON(`${cfg_path}/config/usercfg.json`, `TruckersMPServer`, `${data2}`)
    
                break;
                


                case `status`:
    
                    var server = Math.floor(Number(uConfig.TruckersMP.TruckersMPServer) + 1)
                    
                    if(server >= TruckersMP_Serverlist.length) {
                        server = 0
                    }

                    if(PluginStandBy === false) {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `gameStates`, false)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `driverStates`, false)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `gaugeStates`, false)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `jobStates`, false)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `navigationStates`, false)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `trailerStates`, false)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `truckStates`, false)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `truckersmpStates`, false)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `worldStates`, false)

                        PluginStandBy = true

                    } else {
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `gameStates`, true)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `driverStates`, true)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `gaugeStates`, true)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `jobStates`, true)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `navigationStates`, true)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `trailerStates`, true)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `truckStates`, true)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `truckersmpStates`, true)
                        replaceJSON(`${cfg_path}/config/usercfg.json`, `worldStates`, true)
                        
                        PluginStandBy = false
                    }
                                    
                break;



                case `currency_list`:
                    var currency_list3 = await getCurrency()  
                    var res_data = {
                        "currency": uConfig.Basics.currency,
                        "list": currency_list3
                    }
                    res.send(res_data)
                break;


                default: break;
            }
            if(data !== "currency_list") {
                res.sendStatus(201)
            }
        } catch (e) {
            //res.sendStatus(400)
            logIt("ERROR", "Something went wrong while Post Request! " + e)
        }

    })

    logIt("INTERFACE", "Starting Interface...")
    app.listen(5000)
    
    logIt("INTERFACE", "Interface started.")
    await timeout(500)
    //open('http://localhost:5000')
    logIt("INFO", "Loading `Plugin`...")

    plugin(config, uConfig)
}

//Checks Version
if(!OfflineMode) {
    getVersion()
}

//Loading Configs
configs()

    
// Other Function
function isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0
}

async function getVersion() {
    return new Promise(async (resolve, reject) => {
        axios.get('https://github.com/NyboTV/Tp_ETS2_Plugin/releases/latest')
        .then(response => {
            response = response.request.path
            
            response =  response.split(`NyboTV`)
                        .pop()
                        .split(`Tp_ETS2_Plugin`)
                        .pop()
                        .split(`releases`)
                        .pop()
                        .split(`/`)
                        .pop()

            version = response
        })
        .catch(e => {
            logIt("ERROR", "An Error Appeared! " + e)
        })
    })
}

function serverPing() {
    return new Promise(async (resolve, reject) => {
        axios.get('http://82.165.69.157:5000/')
        .then(response => {
            if(debugMode) { logIt("API", "Server Ping successfull") }
            resolve(true)
            ping = true
        })
        .catch(e => {
            if(ping) {
                logIt("ERROR", e)
            }
            resolve(false)
        })
    })
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function getCurrency() {
    return new Promise(async (resolve, reject) => {
        try {

            if(OfflineMode) {
                let data = fs.readFileSync(`${path}/config/currency.json`)

                data = JSON.parse(data)
                data = data.currency_list

                resolve(data)

            } else {

                https.get('https://raw.githubusercontent.com/NyboTV/TP_ETS2_Plugin/master/src/data/currency.json', (resp) => {
                    var data = ''
                    
                    resp.on('data', (chunk) => {
                        data += chunk
                    })
                    
                    resp.on('end', () => {
                        
                        if(IsJsonString(data) === true) {
                            fs.writeFileSync(`${path}/config/currency.json`, `${data}`)
                            data = JSON.parse(data)
                            data = data.currency_list
                            resolve(data)
                        }
                    })
                })
            }
        } catch (e) {
            logIt("WARNING", "Currency List is getting Updated or doesent Exists!!")
            resolve(null)
        }
    })
}

function window_browser (config) {
    
    
    if (require('electron-squirrel-startup')) { 
        app.quit();
    }
    
    const createWindow = () => {
        setInterval(() => {

            if(open_settings && BrowserWindow.getAllWindows().length === 0) {

                if(debugMode) { frame = true }

                const mainWindow = new BrowserWindow({
                    width: 1250,
                    height: 920,
                    title: "ETS2 Dashboard Plugin",
                    acceptFirstMouse: true,
                    frame: frame, 
                    transparent: false,
                    resizable: false,
                    webPreferences: {
                        nodeIntegration: true
                    }
                });
                
                mainWindow.loadURL('http://localhost:5000')
                mainWindow.removeMenu()
                mainWindow.setTitle("ETS2 Dashboard Plugin")
                app.setAppUserModelId("ETS2 Dashboard Plugin")
                
                //mainWindow.webContents.openDevTools();
                
                app.on('window-all-closed', () => {
                });
                
                app.whenReady().then(() => {  
                })
                open_settings = false

                var version2 = version.split('.')
                version2 = version2.join('')

                var versionOld = config.version.split('.')
                versionOld = versionOld.join('')

                if(version > versionOld) {
                            
                    NOTIFICATION_TITLE = "A new Version is Available!"
                    NOTIFICATION_BODY = `The new Version "${version}" is now Available! You can find it on my Github Page!`
                    
                    if(notificationShowed === false) {
                        showNotification()
                    }
                    notificationShowed = true
                }
            }
        }, 2000);

        
    }
    
    app.on('ready', createWindow);
    
    
    const showNotification = () => {
        new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
    }
    
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}



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
        fs.mkdirSync(`${path}/logs`)
    }
    if(PluginStarted === false) {
        fs.writeFileSync(`${path}/logs/latest.log`, "Plugin Started")
        PluginStarted = true
    }



    let curTime = new Date().toISOString().
    replace(/T/, ` `).
    replace(/\..+/, ``)
    let message = [...arguments];
    let type = message.shift();
    console.log(curTime, ":", pluginID, ":" + type + ":", message.join(" "));
    fs.appendFileSync(`${path}/logs/latest.log`, `\n${curTime}:${pluginID}:${type}:${message.join(" ")}`)
}
    