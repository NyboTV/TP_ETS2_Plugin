// Import Node Modules
const TouchPortalAPI = require(`touchportal-api`);
const TPClient = new TouchPortalAPI.Client();
const pluginID = `TP_ETS2_Plugin`;
const http = require(`request`);
const fs = require(`fs`)
const exec = require(`child_process`).exec
const execute = require(`child_process`).execFile;
const replaceJSON = require(`replace-json-property`).replace
const sJSON = require(`self-reload-json`)

// Important Script Vars
let path = ""
let telemetry_path = ""
let interface_path = ""
let TruckersMP_tmp = ""

let testNumber = 0

let PluginStarted = false
let PluginOnline = false

let dirpath = process.cwd()
let dirname = dirpath.includes(`\\src\\bin`)

// Debug Section
const debugMode = process.argv.includes("--debug")
const sourceTest = process.argv.includes("--sourceTest")
const noServer = process.argv.includes("--noServer")

if(debugMode) {
    path = `./src/bin`
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
            logIt("MISSING", `File/Folder missing: ${file}`)
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
    
    
    if(refreshInterval >= 300) {
    } else {
        replaceJSON(`${path}/config/cfg.json`, "refreshInterval", 300)
        logIt("WARN", "RefreshRate too low! Setting up RefreshRate...")
        refreshInterval = 300
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
        await jobStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig)
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
    
    
    logIt("INFO", "Connecting to `Touch Portal`...")
    TPClient.connect({
        pluginId
    })
}

const webinterface = async (config, uConfig) => {
    // Loading Modules
    const express = require('express');
    const { engine } = require('express-handlebars');
    const app = express();
    const path = require('path')
    const pid = require('pidusage')
    const fastFolderSize = require('fast-folder-size')

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
    var currency = ""
    var weight = ""

    var TruckersMP = ""

    var truckmpStatus = ""
    var truckmpServer = ""
    var truckmpPlayer = ""
    var truckmpQueue = ""
    var truckmpServerList = ""
    
    var cpu_usage = ""
    var mem_usage = ""
    var storage_usage = ""


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

            unit            = uConfig.Basics.unit


            if(PluginOnline)        { PluginOnline = true /*"1"*/ }      else { PluginOnline = false /*"2"*/ }
            if(driverStates)        { driverStates = "1" }      else { driverStates = "2" }
            if(gameStates)          { gameStates = "1" }        else { gameStates = "2" }
            if(gaugeStates)         { gaugeStates = "1" }       else { gaugeStates = "2" }
            if(jobStates)           { jobStates = "1" }         else { jobStates = "2" }
            if(navigationStates)    { navigationStates = "1" }  else { navigationStates = "2" }
            if(trailerStates)       { trailerStates = "1" }     else { trailerStates = "2" }
            if(truckStates)         { truckStates = "1" }       else { truckStates = "2" }
            if(truckersmpStates)    { truckersmpStates = "1" }  else { truckersmpStates = "2" }
            if(worldStates)         { worldStates = "1" }       else { worldStates = "2" }
        }
    }
    

    async function userCFGInterface () {
        for (var i = 0; i < Infinity; await timeout(500), i++) {
            unit = uConfig.Basics.unit
            unit = unit.toLowerCase()
            currency = uConfig.Basics.currency
            
            if(unit === "imperial") {
                weight = "Pounds"
            } else {
                weight = "Tons"
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
                        TruckersMP = TruckersMP_tmp.response[uConfig.TruckersMP.TruckersMPServer - 1]
                        
                        truckmpStatus = "ONLINE"
                        truckmpServer = TruckersMP.name
                        truckmpPlayer = TruckersMP.players
                        truckmpQueue = TruckersMP.queue
                        truckmpServerList = TruckersMP_Array.join("\n")
                    }
                    
                } catch (e) {
                    logIt("ERROR", `${e}`)
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
            pid(process.pid, function (err, stats) {
                cpu_usage = Math.round(stats.cpu * 100) / 100 + "%"
                mem_usage = Math.round(stats.memory / 1024 / 1024) + " MB"
                fastFolderSize(dirpath, (err, size) => {
                    storage_usage = size
                    storage_usage = (storage_usage / 1000 / 1000).toFixed(2)
                    if(storage_usage >= 1000) {
                        storage_usage = (storage_usage / 1000).toFixed(2) + " GB"
                    } else {
                        storage_usage = storage_usage + " MB"
                    }
                })
            })
        }
    }
    

    app.engine('hbs', engine({
        extname: 'hbs', 
        defaultLayout: 'interface', 
        layoutsDir: interface_path + '/interface' 
    }))

    StatesStatus()
    userCFGInterface()
    TruckersMPInterface()
    usage()

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

            unit: unit,
            currency: currency,
            weight: weight,

            truckmpStatus: truckmpStatus,
            truckmpServer: truckmpServer,
            truckmpPlayer: truckmpPlayer,
            truckmpQueue: truckmpQueue,
            truckmpServerList: truckmpServerList,
        })
    })

    logIt("INTERFACE", "Starting Interface...")
    app.listen(5000)
    
    logIt("INTERFACE", "Interface started.")
    await timeout(500)
    logIt("INFO", "Loading `Plugin`...")
    plugin(config, uConfig)
}

//Loading Configs
configs()

    
// Other Function
function isBetween(n, a, b) {
    return (n - a) * (n - b) <= 0
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