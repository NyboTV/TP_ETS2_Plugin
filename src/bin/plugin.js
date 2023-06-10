// Import TP Modules
const TouchPortalAPI = require(`touchportal-api`);
const TPClient = new TouchPortalAPI.Client();
const pluginId = `TP_ETS2_Plugin`;
// Import Writing Modules
const fs = require(`fs`)
const fse = require('fs-extra')
const replaceJSON = require(`replace-json-property`).replace
const sJSON = require(`self-reload-json`)
// Import Internet Modules
const checkInternetConnected = require('check-internet-connected');
// Import Path/Zip Modules
const system_path = require('path');
//const getFolderSize = require("get-folder-size");
const AdmZip = require("adm-zip");
// Import System Modules
const { exit } = require('process');
// Import Electron Modules
const ProgressBar = require('electron-progressbar')
// import Custom Modules
const logIt = require('./modules/script/logIt') 
const showDialog = require('./modules/script/showDialog')
const timeout = require('./modules/script/timeout')
const filescheck = require('./modules/script/filescheck')
const AutoUpdate = require('./modules/script/autoupdate')
const firstInstall = require('./modules/script/firstinstall')
const usage = require('./modules/script/usage')
// Import Plugin Modules
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
const telemetry_Server = require('./modules/script/telemetry');


logIt("MAIN", "INFO", "Starting Plugin...")
// Debug Section
const debugMode = process.argv.includes("--debugging")
const noServer = process.argv.includes("--noServer")
const Testing = process.argv.includes("--testing")

// Path Vars
let dirpath = process.cwd()
let dirname = dirpath.includes(`\\src\\bin`)
if (debugMode) { path = `./src/bin`; /**/ cfg_path = path; /**/ telemetry_path = "./src/bin/tmp" } else { path = dirpath; /**/ cfg_path = path; /**/ telemetry_path = "./tmp"; }
if (dirname) {console.log("You are Trying to start the Script inside the Source Folder without Debug mode! Abort Start..."); exit() } 

// First Setup Folder Creation
if(!fs.existsSync(`${path}/tmp`)) { fs.mkdirSync(`${path}/tmp`) }

const TouchPortalConnection = async (path, cfg_path, telemetry_path, CurrencyList, uConfig, refreshInterval, OfflineMode) => {
    let settings_error = 0

    TPClient.on("Info", async (data) => {
        // After TP Ready, Modules gets loaded
        logIt("TOUCHPORTAL", "INFO", "TP loaded. Loading Modules")
        usage(TPClient, dirpath, logIt, timeout)    
        if(!noServer) { telemetry_Server(path, logIt, timeout, refreshInterval) }

        await mainStates(TPClient, refreshInterval, telemetry_path, logIt, timeout, path, uConfig)
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
        logIt("TOUCHPORTAL", "INFO", "Modules loaded.")
        logIt("TOUCHPORTAL", "INFO", "Starting Loop.")
        
    });

    TPClient.on("Action", async (data, hold) => {

        console.log(data)

        switch(data.actionId) {

            case 'setting_unit':
                if(JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).unit === "Kilometer") {
                    replaceJSON(`${cfg_path}/usercfg.json`, "unit", "Kilometer")
                } else {
                    replaceJSON(`${cfg_path}/usercfg.json`, "unit", "Miles")
                }    
            break;
                
            case 'setting_fluid':
                let fluid = JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).fluid
                switch(fluid) {
                    case 0:
                        replaceJSON(`${cfg_path}/usercfg.json`, "fluid", 1)
                    break

                    case 1:
                        replaceJSON(`${cfg_path}/usercfg.json`, "fluid", 2)
                    break

                    case 2:
                        replaceJSON(`${cfg_path}/usercfg.json`, "fluid", 0)
                    break

                }

                if(JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).fluid === 2) {
                    replaceJSON(`${cfg_path}/usercfg.json`, "fluid", "uk_galon")
                } else if(JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).fluid === 1) {
                    replaceJSON(`${cfg_path}/usercfg.json`, "fluid", "us_galon")
                } else {
                    replaceJSON(`${cfg_path}/usercfg.json`, "fluid", "Galons")
                }                
            break;
            
            case 'setting_weight':
                if(JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).weight === "Tons") {
                    replaceJSON(`${cfg_path}/usercfg.json`, "weight", "Tons")
                } else {
                    replaceJSON(`${cfg_path}/usercfg.json`, "weight", "Pounds")
                }
            break;
            
            case 'setting_temp':
                if(JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).temp === "Celsius") {
                    replaceJSON(`${cfg_path}/usercfg.json`, "temp", "Celsius")
                } else {
                    replaceJSON(`${cfg_path}/usercfg.json`, "temp", "Fahrenheit")
                }
            break;

            case 'setting_time':
                if(JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).timeFormat === "EU") {
                    replaceJSON(`${cfg_path}/usercfg.json`, "timeFormat", "EU")
                } else {
                    replaceJSON(`${cfg_path}/usercfg.json`, "timeFormat", "US")
                }
            break;



            default:
            break;
        }

    })
    
    TPClient.on("Settings", async (data) => {

        replaceJSON(`${cfg_path}/config/cfg.json`, `refreshInterval`, Number(data[0].Refresh_Interval))

        for (var i = 0; i < CurrencyList.length; await timeout(10), i++) {
            if (CurrencyList[i] === data[1].Currency) {
                replaceJSON(`${cfg_path}/config/usercfg.json`, `currency`, `${data[1].Currency}`)

                break
            } else {
                if (i === CurrencyList.length - 1) {
                    logIt("INFO", "Currency not Found! Using Default!")
                    replaceJSON(`${cfg_path}/config/usercfg.json`, `currency`, `EUR`)
                    settings_error = settings_error+1
                    break
                }
            }
        }

        replaceJSON(`${cfg_path}/config/cfg.json`, `TruckersMPServer`, Number(data[2].TruckersMP_Server))

        switch (data[3].AutoUpdate.toLowerCase()) {
            case "true":
                replaceJSON(`${cfg_path}/config/cfg.json`, `UpdateCheck`, true)
                break;
            case "false":
                replaceJSON(`${cfg_path}/config/cfg.json`, `UpdateCheck`, false)
                break;
            default:
                settings_error = settings_error+1
        }

        switch (data[4].PreRelease.toLowerCase()) {
            case "true":
                replaceJSON(`${cfg_path}/config/usercfg.json`, `PreRelease`, true)
                break;
            case "false":
                replaceJSON(`${cfg_path}/config/usercfg.json`, `PreRelease`, false)
                break;
            default:
                settings_error = settings_error+1
        }

        switch (data[5].OfflineMode.toLowerCase()) {
            case "true":
                replaceJSON(`${cfg_path}/config/cfg.json`, `OfflineMode`, true)
                break;
            case "false":
                replaceJSON(`${cfg_path}/config/cfg.json`, `OfflineMode`, false)
                break;
            default:
                settings_error = settings_error+1
        }

        if(settings_error >= 1) {
            showDialog("error", ["Ok"], "ETS2 Dashboard Settings", "Hey! You messed something up in the Settings! Please check them! Meanwhile we are using the Default Settings to prevent Crashes. Read more on Github.")
        }

    });

    logIt("TOUCHPORTAL", "INFO", "Connecting to `Touch Portal`...")
    TPClient.connect({
        pluginId
    })

}

const main = async (path, cfg_path, telemetry_path) => {
    // Let Plugin load up...
    await timeout(500)

    // Pre-Setup // Checking Missing Files/Folders
    if(!await filescheck(path, logIt)) {
        await showDialog("error", ["OK"], "ETS2 Dashboard", "Missing Files/Folders! Plugin start aborted!")
        exit()
    }

    // Loading Configs 
    logIt("MAIN", "INFO", "Loading `Config Files`...")
    let config = new sJSON(`${path}/config/cfg.json`)
    let uConfig = new sJSON(`${path}/config/usercfg.json`)
    let CurrencyList = new sJSON(`${path}/config/currency.json`)    
    let OfflineMode = config.OfflineMode
    let refreshInterval = config.refreshInterval

    //Checking Settings
    if (refreshInterval < 50) {
        logIt("WARN", "RefreshRate too low! Setting up RefreshRate...")
        replaceJSON(`${path}/config/cfg.json`, "refreshInterval", 50)
        refreshInterval = 50
    }
    
    // Checks Internet
    if(OfflineMode === false) {
        await checkInternetConnected()
        .then((result) => {
            logIt("MAIN", "INFO", "Internet Connected!")
        })
        .catch((ex) => {
            logIt("MAIN", "INFO", "No Internet Connection!")
            OfflineMode = true
            
            logIt("MAIN", "WARN", "Disable TruckersMP states to prevent errors...")
            replaceJSON(`${cfg_path}/config/usercfg.json`, `truckersmpStates`, false)
        });
    }
    
    // Checking for Update...
    if (OfflineMode === false) {
        logIt("MAIN", "INFO", "Starting AutoUpdate Script...")
        await AutoUpdate(config.UpdateCheck, uConfig.prerelease, config.version, logIt, showDialog, timeout)
    }

    // Checking for FirstInstall
    if (system_path.basename(process.cwd()) === "ETS2_Dashboard_autoupdate" || Testing === true) {
        logIt("MAIN", "INFO", "Starting First Install Script...")
        await firstInstall(showDialog, logIt, OfflineMode)
    }

    TouchPortalConnection(path, cfg_path, telemetry_path, CurrencyList, uConfig, refreshInterval, OfflineMode)
}

if(Testing) {
    async function test() {
        // Nothing to Test
    }
    test()
}

main(path, cfg_path, telemetry_path)

