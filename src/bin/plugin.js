// Import Node Modules
const TouchPortalAPI = require(`touchportal-api`);
const TPClient = new TouchPortalAPI.Client();
const pluginID = `TP_ETS2_Plugin`;
const http = require(`request`);
const { dialog } = require('electron')
const fs = require(`fs`)
const fse = require('fs-extra')
const replaceJSON = require(`replace-json-property`).replace
const sJSON = require(`self-reload-json`)
const checkInternetConnected = require('check-internet-connected');
const pid = require('pidusage')
const getFolderSize = require("get-folder-size");
const AdmZip = require("adm-zip");
const download = require('download');
const system_path = require('path');
const axios = require('axios')
const { exec, execFile, spawn } = require(`child_process`)
const { exit } = require('process');


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
const debugMode = process.argv.includes("--debugging")
const sourceTest = process.argv.includes("--sourceTest")
const noServer = process.argv.includes("--noServer")
const Testing = process.argv.includes("--Testing")

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

logIt("INFO", "Starting...")

const configs = async () => {
    
    logIt("CONFIG", "Loading `Config Files`...")
    // Script Files
    let config = new sJSON(`${path}/config/cfg.json`)
    let uConfig = new sJSON(`${path}/config/usercfg.json`)
    let CurrencyList = new sJSON(`${path}/config/currency.json`)



    logIt("INFO", "Loading `Plugin`...")
    plugin(config, uConfig, CurrencyList)

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

const plugin = async (config, uConfig, CurrencyList) => {
    

    logIt("INFO", "Checking for Missing Files...")
    // Checking for missing Files
    let firstInstall = config.firstInstall
    CurrencyList = CurrencyList.currency_list
    
    if(firstInstall === true) {
        if(debugMode && Testing === false) {
            logIt("INFO", "Skipping First Install due to DebugMode")
        } else {
            if(await FirstInstall()) {
                replaceJSON(`${path}/config/cfg.json`, "firstInstall", false)
            }
        }
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
        
        // Pre Start Stuff
        usage()


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
        await timeout(200) // Let the Plugin Load up

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
                        execFile(`${path}/server/Ets2Telemetry.exe`, function(err, data) {
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
            
            http.get(`http://localhost:25555/api/ets2/telemetry`, async function(err, resp, body) {
                
                var data = ``;
                data = body
                
                if (err != null) {
                    telemetry_status_online = false
                    
                    if(telemetry_retry === 1) {
                        resolve()
                    }
                    logIt("WARN", `Telemetry Request Error! -> ${err}`)
                    telemetry_retry = 1
                    
                    await timeout(3000)
                    resolve()
                    
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


    TPClient.on("Settings", async (data) => {
        
        replaceJSON(`${cfg_path}/config/cfg.json`, `refreshInterval`, Number(data[0].Refresh_Interval))

        for(var i = 0; i < CurrencyList.length; await timeout(10), i++) {
            if(CurrencyList[i] === data[1].Currency) {
                replaceJSON(`${cfg_path}/config/usercfg.json`, `currency`, `${data[1].Currency}`)

                break
            } else {
                if(i === CurrencyList.length-1) {
                    logIt("INFO", "Currency not Found! Using Default!")                    
                    replaceJSON(`${cfg_path}/config/usercfg.json`, `currency`, `EUR`) 
                    break
                }
            }
        }

        replaceJSON(`${cfg_path}/config/usercfg.json`, `unit`, data[2].Unit)
        replaceJSON(`${cfg_path}/config/usercfg.json`, `fluid`, data[3].Fluid)
        replaceJSON(`${cfg_path}/config/usercfg.json`, `weight`, data[4].Weight)
        replaceJSON(`${cfg_path}/config/usercfg.json`, `temp`, data[5].Temperature)
        replaceJSON(`${cfg_path}/config/usercfg.json`, `timeFormat`, data[6].Time_Format)
        replaceJSON(`${cfg_path}/config/usercfg.json`, `TruckersMPServer`, Number(data[7].TruckersMP_Server))

        let PreRelease = data[8].PreRelease.toLowerCase()
        if(PreRelease === "true") {
            PreRelease = true
        } else {
            PreRelease = false
        }
        replaceJSON(`${cfg_path}/config/usercfg.json`, `prerelease`, PreRelease)

    });

    logIt("INFO", "Connecting to `Touch Portal`...")
    TPClient.connect({pluginId})
}

// Beginning of Script | Checks Internet
setTimeout(async () => {

    await checkInternetConnected()
    .then((result) => {
        logIt("INFO", "Internet Connected!")
    })
    .catch((ex) => {
        logIt("INFO", "No Internet Connection!")
        OfflineMode = true
        
        logIt("WARN", "Disable TruckersMP states to prevent errors...")
        
        replaceJSON(`${cfg_path}/config/usercfg.json`, `truckersmpStates`, false)
    });
     
    // Checking for Update...
    if(system_path.basename(process.cwd()) != "ETS2_Dashboard_autoupdate") {
        await AutoUpdate()
    } 
    
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

const FirstInstall = async () => {
    return new Promise(async (resolve, reject) => {

        if(system_path.basename(process.cwd()) === "ETS2_Dashboard_autoupdate") {
            logIt("AutoUpdate", "AutoUpdate Detected...")

            UpdateQuestion = await showDialog("warning", ["Yes", "No"], "ETS2 Dashboard", "Do you want to Update your Plugin?")

            if(UpdateQuestion === 0) {

                await showDialog("warning", ["Done"], "ETS2 Dashboard", "Please fully Close TouchPortal! Remember: Its getting minimized in your System-Tray!")

                let TP_path = process.env.APPDATA + `/TouchPortal/plugins/ETS2_Dashboard`

                async function delete_Plugin() {

                    fs.rmSync(TP_path, { recursive: true, force: true })
                    
                }

                await delete_Plugin()

                fse.copySync(process.env.USERPROFILE + "/Downloads/ETS2_Dashboard_autoupdate", TP_path, { overwrite: true })

                replaceJSON(`${process.env.APPDATA}/TouchPortal/plugins/ETS2_Dashboard/config/cfg.json`, "firstInstall", false)

                await showDialog("info", ["Ok"], "ETS2 Dashboard", "Update Done! Please Start TouchPortal again.")
                
                exit()

            } else if (UpdateQuestion === 1) {
                await showDialog("info", ["Ok"], "ETS2 Dashboard", "Alright. Plugin is closing, due to execute in Downloads Folder!")
                exit()
            }

        } else {

            logIt("FirstInstall", "First Install Script started...")
    
            // Telemetry Server first Install
            logIt("FirstInstall", "Asking for Telemetry Server...")
            telemetryInstall = await showDialog("info", ["No. Let me do the First Steps", "Yes, im good"], "ETS2 Dashboard Plugin: First Install Detected!", "Hi! Did you ever used this Plugin before?")
            if(telemetryInstall === 0) {
                logIt("FirstInstall", "Installing Telemetry Server...")
                require('child_process').exec('start "" "%appdata%/TouchPortal/plugins/ETS2_Dashboard/server"');
                await timeout(500)
                await showDialog("info", ["Okay!"], "ETS2 Dashboard", "To use this Plugin you need to install the Telemetry Server by Hand! \nTo do this, just open the 'Ets2Telemtry.exe' in the Folder we just opend for you and click on Install and follow the Instruction!")
            } else {
                logIt("FirstInstall", "Telemetry already installed.")
            }
    
    
            // Default page
            if(OfflineMode === false) {
                logIt("FirstInstall", "Asking Player for Default Page")
                defaultPageChoice = await showDialog("question", ["Yes, the KMH Version.", "Yes, the MPH Version", "No, Thanks"], "ETS2 Dashboard Plugin: First Install Detected!", "We have a Default Page for new Users! Do you want to install it?")
                if(defaultPageChoice === 0 || defaultPageChoice === 1) {
                    logIt("FirstInstall", "Downloading Default Page")
    
                    download_File = ""
                    if(defaultPageChoice === 0) {  
                        download_File = "DefaultPage_KMH.zip"          
                    }
    
                    if(defaultPageChoice === 1) { 
                        download_File = "DefaultPage_MPH.zip"               
                    }
                    
                    
                    url = "https://github.com/NyboTV/TP_ETS2_Plugin/raw/master/src/build/defaultPage/"+download_File
                    download_path = process.env.APPDATA + `/TouchPortal/plugins/ETS2_Dashboard/tmp/`; 
                    
                    try {
                        download(url,download_path)
                        .then(async () => {
                            logIt("FirstInstall", "Download Finished!")
                
                            var zip = new AdmZip(`${process.env.APPDATA}/TouchPortal/plugins/ETS2_Dashboard/tmp/${download_File}`);
                            logIt("FirstInstall", "Unzipping...")
                            zip.extractAllTo(`${process.env.APPDATA}/TouchPortal/`)
                            logIt("FirstInstall", "Unzip Finished! Deleting tmp File")
                            fs.unlinkSync(`${process.env.APPDATA}/TouchPortal/plugins/ETS2_Dashboard/tmp/${download_File}`)
                
                            logIt("FirstInstall", "Install Finished!")
                            await showDialog("info",["Okay!", "Restart now! (Not a thing yet!)"], "ETS2 Dashboard Plugin: First Install Detected!", "Please Restart TouchPortal to see the Default Page.")
                            resolve(true)
                        })
                    } catch (e) {
                        logIt("FirstInstall", "Error while First Setup!! \n" + e)
                    }
                    
                } else {
                    logIt("FirstInstall", "Default Page install skipped...")
                    resolve(true)
                }
            } else {
                logIt("FirstInstall", "User is Offline, skipping DefaultPage Setup")
            }
        }
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

function showDialog(type, buttons, title, message) {
    return new Promise(async (resolve, reject) => { 

        let data  = {
            type: type,
            buttons: buttons,
            title: title,
            message: message
        }
        
        resolve(dialog.showMessageBoxSync(data))

    })
}

function AutoUpdate() {
    return new Promise(async (resolve, reject) => {
        let config = new sJSON(`${path}/config/cfg.json`)
        let uConfig = new sJSON(`${path}/config/usercfg.json`)
        let UpdateCheck = config.UpdateCheck
        let lastVersion = config.version
        let newversion = ""
        let PreReleaseAllowed = uConfig.prerelease
        let NeedUpdate = false

        
        logIt("AutoUpdate", "Checking for Updates... (Searching for PreRelease allowed: " + PreReleaseAllowed + ")")

        try {
            
            if(UpdateCheck === true && debugMode === false || Testing === true) {   
                axios.get('https://api.github.com/repos/NyboTV/TP_ETS2_Plugin/releases')
                .then(async function (response) {
                    response = response.data[0]

                    newversion = response.tag_name.split(".")
                    lastVersion = lastVersion.split(".")

                    if(response.prerelease === true && PreReleaseAllowed === true) {
                        for(var i = 0; i < newversion.length; await timeout(20), i++) {
                            if(newversion[i] > lastVersion[i]) {
                                NeedUpdate = true
                            } 
                        }
                    } else if(response.prerelease === false) {
                        for(var i = 0; i < newversion.length; await timeout(20), i++) {
                            if(newversion[i] > lastVersion[i]) {
                                NeedUpdate = true
                            } 
                        }
                    }
                    
    
                    if(NeedUpdate === true) {
                        newversion = response.tag_name
                        url = `https://github.com/NyboTV/TP_ETS2_Plugin/releases/download/${newversion}/ETS2_Dashboard.tpp`
                        download_path = process.env.USERPROFILE + "/Downloads"
                        if(response.prerelease === true) {
                            UpdateQuestion = await showDialog("info", ["Yes", "No"], "ETS2 Dashboard: AutoUpdater", "We found a new Update! Install? (Attention! Its a Pre-Release!)")
                        } else {
                            UpdateQuestion = await showDialog("info", ["Yes", "No"], "ETS2 Dashboard: AutoUpdater", "We found a new Update! Install?")
                        }
        
                        if(UpdateQuestion === 0) {
                            logIt("AutoUpdate", "Update starting...")
                            showDialog("info", ["Ok"], "ETS2 Dashboard: AutoUpdater", "We downloading the Plugin. Please wait...")

                            if(fs.existsSync(`${download_path}/ETS2_Dashboard_autoupdate`)) { 
                                try {
                                    fs.unlinkSync(`${download_path}/ETS2_Dashboard_autoupdate`) 
                                } catch (e) {
                                    await showDialog("warning", ["Done"], "ETS2 Dashboard", "Due to AntiVirus issues we can not delete any Files outside this Plugin. Please delete the 'ETS2_Dashboard_autoupdate' folder in your Downloads Folder")
                                }
                            }

                            download(url,download_path)
                            .then(async () => {
                                logIt("AutoUpdate", "Download Finished!")
                                
                                var zip = new AdmZip(`${download_path}/ETS2_Dashboard.tpp`);
                                logIt("AutoUpdate", "Unzipping...!")
                                zip.extractAllTo(`${download_path}`)
                                fs.unlinkSync(`${download_path}/ETS2_Dashboard.tpp`)
                                fs.renameSync(`${download_path}/ETS2_Dashboard`, `${download_path}/ETS2_Dashboard_autoupdate`)
                                logIt("AutoUpdate", "Unzip Finished!")


                                InstallQuestion = await showDialog("info", ["Yes", "No"], "ETS2 Dashboard: AutoUpdater", "Update Downloaded and unzipped! Do you want to install it now?")

                                if(InstallQuestion === 0) {
                                    await showDialog("warning", ["Ok"], "ETS2 Dashboard: AutoUpdater", "Due to AntiVirus Issues you have to execute the File by hand. Just go to your Downloads Folder -> 'ETS2_Dashboard_autoupdate' and execute the 'ETS2_Dashboard.exe'.")
                                    exit()

                                } else if (InstallQuestion === 1) {
                                    await showDialog("info", ["Okay!", "No"], "ETS2 Dashboard: AutoUpdater", "If you want to install it, just go to your Downloads Folder, into 'ETS2_Dashboard' and execute the 'ETS2_Dashboard.exe' File.")
                                    resolve(true)
                                }

                            })    
                            
                        } else if(UpdateQuestion === 1) {
                            logIt("AutoUpdate", "Update Skipped")
                            resolve()
                        } else if(UpdateQuestion === 2) {
                            logIt("AutoUpdate", "Update Skipped. Never ask Again!")
                            replaceJSON(`${path}/config/cfg.json`, "UpdateCheck", false)
                        }
                    } else {
                        logIt("AutoUpdate", "No Update Found.")
                        resolve()
                    }

                })
                .catch(function (error) {
                    logIt("Error", error)
                })

            } else {
                logIt("AutoUpdater", "Disabled")
                resolve()
            }

        } catch (e) {
            logIt("AutoUpdater", "AutoUpdater Failed!")
            logIt("AutoUpdater", e)
            //resolve()
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
    