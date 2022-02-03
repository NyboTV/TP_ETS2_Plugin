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
let PluginStarted = false
let testNumber = 0
let interface_path = ""

let dirpath = process.cwd()
let dirname = dirpath.includes(`\\src\\bin`)

// Debug Section
const debugMode = process.argv.includes("--debug")
if(debugMode) {
    path = `./src/bin`
    interface_path = `./src/bin`
    telemetry_path = "./src/bin/tmp"
} else if(dirname) {
    console.log("You are Trying to start the Script inside the Source Folder without Debug mode! Abort Start...") 
} else {
    path = dirpath
    interface_path = dirpath
    telemetry_path = "./tmp"
}

// Checks and creates if neccessary Logs Folder
if(fs.existsSync(`./logs`)) {  } else { fs.mkdirSync(`./logs`) }

const plugin = async () => {

    console.log(path)
    logIt("INFO", "Plugin is Starting...")
    logIt("INFO", "Plugin is loading `Config Files`...")
    // Script Files
    let config = new sJSON(`${path}/config/cfg.json`)
    let uConfig = new sJSON(`${path}/config/usercfg.json`)
    

    logIt("INFO", "Plugin is Checking for Missing Files...")
    // Checking for missing Files
    let firstInstall = config.firstInstall
    const FilesCheck = async () => {
        let missing = []
        if(fs.existsSync(`${path}/images`)) { missing.push("Images Folder") }
        if(fs.existsSync(`${path}/images/Gauge.png`)) { missing.push("Gauge.png") }
        if(fs.existsSync(`${path}/images/RPMGauge.png`)) { missing.push("RPMGauge.png") }
        if(fs.existsSync(`${path}/images/FuelGauge.png`)) { missing.push("FuelGauge.png") }
        if(fs.existsSync(`${path}/images/SpeedGauge.png`)) { missing.push("SpeedGauge.png") }
        if(fs.existsSync(`${path}/images/speedlimit.png`)) { missing.push("speedlimit.png") }
        if(fs.existsSync(`${path}/images/noSpeedlimit.png`)) { missing.push("noSpeedlimit.png") }

        
        if(fs.existsSync(`${path}/server`)) { missing.push("Server Folder") }
        if(fs.existsSync(`${path}/server/Ets2Plugins`)) { missing.push("Ets2Plugins") }
        if(fs.existsSync(`${path}/server/Ets2Plugins/win_x64`)) { missing.push("Ets2Plugins/win_x64") }
        if(fs.existsSync(`${path}/server/Ets2Plugins/win_x86`)) { missing.push("Ets2Plugins/win_x86") }
        if(fs.existsSync(`${path}/server/Ets2Plugins/win_x64/plugins`)) { missing.push("Ets2Plugins/../plugins") }
        if(fs.existsSync(`${path}/server/Ets2Plugins/win_x86/plugins`)) { missing.push("Ets2Plugins/../plugins") }
        if(fs.existsSync(`${path}/server/Ets2Plugins/win_x64/plugins/ets2-telemetry-server.dll`)) { missing.push("../plugins/ets2-telemetry-server.dll") }
        if(fs.existsSync(`${path}/server/Ets2Plugins/win_x86/plugins/ets2-telemetry-server.dll`)) { missing.push("../plugins/ets2-telemetry-server.dll") }
        if(fs.existsSync(`${path}/server/Ets2Telemetry.exe.config`)) { missing.push("Ets2Telemetry.exe.config") }
        if(fs.existsSync(`${path}/server/Ets2TestTelemetry.json`)) { missing.push("Ets2TestTelemetry.json") }
        if(fs.existsSync(`${path}/server/Owin.dll`)) { missing.push("Owin.dll") }
        if(fs.existsSync(`${path}/server/Microsoft.Practices.ServiceLocation.dll`)) { missing.push("Microsoft.Practices.ServiceLocation.dll") }
        if(fs.existsSync(`${path}/server/Microsoft.Owin.Cors.dll`)) { missing.push("Microsoft.Owin.Cors.dll") }
        if(fs.existsSync(`${path}/server/System.Web.Cors.dll`)) { missing.push("System.Web.Cors.dll") }
        if(fs.existsSync(`${path}/server/Owin.WebSocket.dll`)) { missing.push("Owin.WebSocket.dll") }
        if(fs.existsSync(`${path}/server/Microsoft.Owin.Security.dll`)) { missing.push("Microsoft.Owin.Security.dll") }
        if(fs.existsSync(`${path}/server/System.Web.Http.Owin.dll`)) { missing.push("System.Web.Http.Owin.dll") }
        if(fs.existsSync(`${path}/server/Microsoft.Owin.Hosting.dll`)) { missing.push("Microsoft.Owin.Hosting.dll") }
        if(fs.existsSync(`${path}/server/Microsoft.Owin.dll`)) { missing.push("Microsoft.Owin.dll") }
        if(fs.existsSync(`${path}/server/Microsoft.Owin.Host.HttpListener.dll`)) { missing.push("Microsoft.Owin.Host.HttpListener.dll") }
        if(fs.existsSync(`${path}/server/System.Net.Http.Formatting.dll`)) { missing.push("System.Net.Http.Formatting.dll") }
        if(fs.existsSync(`${path}/server/log4net.dll`)) { missing.push("log4net.dll") }
        if(fs.existsSync(`${path}/server/Microsoft.AspNet.SignalR.Core.dll`)) { missing.push("Microsoft.AspNet.SignalR.Core.dll") }
        if(fs.existsSync(`${path}/server/Ets2Telemetry.log`)) { missing.push("Ets2Telemetry.log") }
        if(fs.existsSync(`${path}/server/System.Web.Http.dll`)) { missing.push("System.Web.Http.dll") }
        if(fs.existsSync(`${path}/server/Ets2Telemetry.exe`)) { missing.push("Ets2Telemetry.exe") }
        if(fs.existsSync(`${path}/server/Newtonsoft.Json.dll`)) { missing.push("Newtonsoft.Json.dll") }
        if(fs.existsSync(`${path}/server/Microsoft.Owin.Diagnostics.dll`)) { missing.push("Microsoft.Owin.Diagnostics.dll") }


        if(fs.existsSync(`${telemetry_path}`)) {  } else { fs.mkdirSync(`${telemetry_path}`) }
    }
    if(firstInstall) {
        await FilesCheck()
    }


    logIt("INFO", "Plugin is `importing Modules`...")
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
    
    
    logIt("INFO", "Plugin is loading `Script Vars`...")
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
            if(telemetry_status_online === false) {
                await timeout(refreshInterval)
                main_loop()
            } else
            modules()
        }
        
        logIt("INFO", "Plugin is loading `Telemetry Server`...")
        telemetry_loop()
        logIt("INFO", "Plugin is loading `Modules`...")
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
        logIt("INFO", "Plugin is starting Loop.")

        logIt("INTERFACE", "Plugin is loading Webinterface...")
        webinterface(config, uConfig)
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
                            console.log(err)
                            console.log(data.toString());
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
        logIt("INFO", "Plugin is loading `Main Loader`...")
        main_loader()
        
    });
    
    
    logIt("INFO", "Plugin is connecting to `Touch Portal`...")
    TPClient.connect({
        pluginId
    })
}

const webinterface = async (config, uConfig) => {
    // Loading Modules
    const express = require('express');
    const { engine, create } = require('express-handlebars');
    const app = express();
    const path = require('path')
    const pid = require('pidusage')

    var driverStates = uConfig.Modules.driverStates
    var gameStates = uConfig.Modules.gameStates
    var gaugeStates = uConfig.Modules.gaugeStates
    var jobStates = uConfig.Modules.jobStates
    var navigationStates = uConfig.Modules.navigationStates
    var trailerStates = uConfig.Modules.trailerStates
    var truckStates = uConfig.Modules.truckStates
    var truckersmpStates = uConfig.Modules.truckersmpStates
    var worldStates = uConfig.Modules.worldStates

    var cpu_usage = ""
    var mem_usage = ""
    var storage_usage = ""

    async function usage () {
        for (var i = 0; i < Infinity; await timeout(500), i++) {

            pid(process.pid, function (err, stats) {
                cpu_usage = Math.round(stats.cpu * 100) / 100
                mem_usage = Math.round(stats.memory / 1024 / 1024) + "MB"
                storage_usage = fs.statSync(dirpath).size
                storage_usage = (storage_usage / 1000 / 1000).toFixed(2) + "MB"
            })
        }
    }
    usage()

    var livereload = require("livereload");
    var connectLiveReload = require("connect-livereload");
    const liveReloadServer = livereload.createServer();
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/");
        }, 100);
    });
    
    app.engine('hbs', engine({
        extname: 'hbs', 
        defaultLayout: 'interface', 
        layoutsDir: interface_path + '/interface' 
    }))

    create({
        helpers: {
            hello: function () { console.log("Test") }
        }
    })

    

    app.set('views', path.join(interface_path, '/interface'))
    app.set('view engine', 'hbs')
    app.use(express.static(path.join(interface_path, '/interface')))
    app.use(connectLiveReload());
    
    logIt("INTERFACE", "Plugin is loading Interface...")


    app.get("/", (req, res) => {
        res.render("interface", { 
            title: "Test", 
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
            storage_usage: storage_usage
        })
    })

    logIt("INTERFACE", "Plugin is starting Interface...")
    app.listen(5000)
    
    logIt("INTERFACE", "Plugin Interface started.")
}

//plugin()
plugin()

// Interface Function
async function interface (module) {
    if(module === "driverStates") {
        console.log("DriverStates")
    }

    if(module === "gameStates") {
        console.log("GameStates")
    }
    console.log("Works but not correct")
}
    
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
