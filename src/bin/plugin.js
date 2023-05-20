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
const checkInternetConnected = require('check-internet-connected');
const pid = require('pidusage')
const getFolderSize = require("get-folder-size")


// Important Script Vars
let path = ""
let cfg_path = ""
let telemetry_path = ""
let OfflineMode = false
let PluginStarted = false

let cpu_usage = ""
let mem_usage = ""
let storage_usage = ""

let dirpath = process.cwd()
let dirname = dirpath.includes(`\\src\\bin`)

// Debug Section
const debugMode = process.argv.includes("--debug")
const sourceTest = process.argv.includes("--sourceTest")
const noServer = process.argv.includes("--noServer")

if(debugMode) {
    path = `./src/bin`
    cfg_path = path
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
    telemetry_path = "./tmp"
}

// Checks and creates if neccessary Logs Folder
if(fs.existsSync(`./logs`)) {  } else { fs.mkdirSync(`./logs`) }

// Pre Start Stuff
usage()

logIt("INFO", "Starting...")

const configs = async () => {
    
    logIt("CONFIG", "Loading `Config Files`...")
    // Script Files
    let config = new sJSON(`${path}/config/cfg.json`)
    let uConfig = new sJSON(`${path}/config/usercfg.json`)


    logIt("INFO", "Loading `Plugin`...")
    plugin(config, uConfig)

     setTimeout(async () => {
        
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
    }, 200);
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
        if(!fs.existsSync(`${path}/server/Ets2Plugins/win_x64/plugins`)) { missing.push("Ets2Plugins/../plugins") }
        if(!fs.existsSync(`${path}/server/Ets2Plugins/win_x64/plugins/ets2-telemetry-server.dll`)) { missing.push("../plugins/ets2-telemetry-server.dll") }
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

    const mainStates = require(`./modules/states/main`)

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
    let plugin_settings = ""
    
    
    if(refreshInterval >= 50) {
    } else {
        replaceJSON(`${path}/config/cfg.json`, "refreshInterval", 50)
        logIt("WARN", "RefreshRate too low! Setting up RefreshRate...")
        refreshInterval = 50
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
        await mainStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, plugin_settings)
        await driverStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, plugin_settings) 
        await gameStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, plugin_settings)
        await gaugeStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, plugin_settings)
        await jobStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, plugin_settings, OfflineMode)
        await navigationStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, plugin_settings)
        await trailerStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, plugin_settings)
        await truckStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, plugin_settings)
        await truckersmpStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, plugin_settings)
        await worldStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig, plugin_settings)

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
        
        switch (data.actionId) {


            case `settings`:
                open_settings = true
            break;


            case `setting_speed`:
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
                
            case 'setting_fluid':
                
                let fluids = [
                    "Galons",
                    "Liters"
                ]
                
                var position = fluids.indexOf(uConfig.Basics.fluid)
                
                var fluid = fluids[position + 1]
                
                if(fluid === undefined) {
                    fluid = "Galons"
                }
                
                replaceJSON(`${cfg_path}/config/usercfg.json`, `fluid`, `${fluid}`)
            break;
                
            case `setting_weight`:
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

            case `setting_temp`:
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
                
        }

    })

    TPClient.on("Update", (curVersion, remoteVersion) => {

        let optionsArray = [
          {
            "id":`${pluginId} Update`,
            "title":"Take Me to Download"
          },
          {
            "id":`${pluginId} Ignore`,
            "title":"Ignore Update"
          }
        ];
    
        TPClient.sendNotification(`${pluginId} UpdateNotification`,"My Plugin has been updated", `A new version of my plugin ${remoteVersion} is available to download`, optionsArray);
    });

    TPClient.on("Settings",async (data) => {

        CurrencyList = await getCurrency()

        for(var i = 0; i < CurrencyList.length; await timeout(1), i++) {
            if(CurrencyList[i] === data[1].Currency) {
                replaceJSON(`${cfg_path}/config/usercfg.json`, `currency`, `${data[1].Currency}`)
                break
            } else {
                if(i === CurrencyList.length-1) {
                    logIt("INFO", "Currency not Found! Using Default!")                    
                    replaceJSON(`${cfg_path}/config/usercfg.json`, `currency`, `${data[1].Currency}`)
                    break
                }
            }
        }

        replaceJSON(`${cfg_path}/config/cfg.json`, `refreshInterval`, Number(data[0].Refresh_Interval))

    });

    logIt("INFO", "Connecting to `Touch Portal`...")
    TPClient.connect({pluginId})
}


// Beginning of Script | Checks Internet
setTimeout(async () => {

    await checkInternetConnected()
    .then((result) => {
        logIt("INFO", "Internet Connected!")
        
        replaceJSON(`${cfg_path}/config/usercfg.json`, `truckersmpStates`, true)
    })
    .catch((ex) => {
        logIt("INFO", "No Internet Connection!")
        OfflineMode = true
        
        logIt("WARN", "Disable TruckersMP states to prevent errors...")
        
        replaceJSON(`${cfg_path}/config/usercfg.json`, `truckersmpStates`, false)
    });
       
    //Loading Configs
    configs()
    
}, 100);
    
// Other Function
function timeout(ms) {
    return new Promise(async (resolve, reject) => {
        ms = Number(ms)
        setTimeout(() => {
            resolve();
        }, ms);
    })
}

async function usage () {
    let cpu_usageOld = ""
    let mem_usageOld = ""
    let storage_usageOld = ""

    for (var i = 0; i < Infinity; await timeout(1500), i++) {
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

        if(PluginStarted === true) {
            states = []

            if(cpu_usage !== cpu_usageOld) {
                cpu_usageOld = cpu_usage
    
                var data = {
                    id: "Nybo.ETS2.Usage.CPU_Usage",
                    value: `${cpu_usage}`
                }

                states.push(data)
            }

            if(mem_usage !== mem_usageOld) {
                mem_usageOld = mem_usage

                var data = {
                    id: "Nybo.ETS2.Usage.MEM_Usage",
                    value: `${mem_usage}`
                }

                states.push(data)

            }

            if(storage_usage !== storage_usageOld) {
                storage_usageOld = storage_usage
                
                var data = {
                    id: "Nybo.ETS2.Usage.Storage_Usage",
                    value: `${storage_usage}`
                }

                states.push(data)

            }

            try {
                if(states.length > 0) {
                    TPClient.stateUpdateMany(states);
                }
            } catch (error) {
                logIt("ERROR", `Usage States Error: ${error}`)
                logIt("ERROR", `Usage States Error. Retry...`)
            }
        }
    }
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
                try {

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
                } catch (err) {
                    logIt("ERROR", "No Internet connection...")
                    resolve(false)
                }
            }
        } catch (e) {
            logIt("WARNING", "Currency List is getting Updated or doesent Exists!!")
            resolve(null)
        }
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
    