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
let path = ""
let cfg_path = ""
let telemetry_path = ""

let dirpath = process.cwd()
let dirname = dirpath.includes(`\\src\\bin`)
if (debugMode) { path = `./src/bin`; /**/ cfg_path = path+"/config"; /**/ telemetry_path = "./src/bin/tmp" } else { path = dirpath; /**/ cfg_path = path+"/config"; /**/ telemetry_path = "./tmp"; }
if (dirname) {console.log("You are Trying to start the Script inside the Source Folder without Debug mode! Abort Start..."); exit() } 

// First Setup Folder Creation
if(!fs.existsSync(`${path}/tmp`)) { fs.mkdirSync(`${path}/tmp`) }

const TouchPortalConnection = async (path, cfg_path, telemetry_path, uConfig, CurrencyList, refreshInterval, OfflineMode) => {
    let settings_error = 0
    CurrencyList = CurrencyList.currency_list

    TPClient.on("Info", async (data) => {
        // After TP Ready, Modules gets loaded
        logIt("TOUCHPORTAL", "INFO", "TP loaded. Loading Modules")
        usage(TPClient, dirpath, logIt, timeout)    
        if(!noServer) { telemetry_Server(path, logIt, timeout, refreshInterval) }

        // Checks for TMP File then continues
        for(var i = 0; Infinity; await timeout(500)) {
            if(!fs.existsSync(telemetry_path+"/tmp.json")) {
            } else {
                break
            }
        }

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

        switch(data.actionId) {

            case 'setting_speed':
                if(JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).Basics.unit === "Kilometer") {
                    replaceJSON(`${cfg_path}/usercfg.json`, "unit", "Miles")
                } else {
                    replaceJSON(`${cfg_path}/usercfg.json`, "unit", "Kilometer")
                }    
            break;
                
            case 'setting_fluid':
                let fluid = JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).Basics.fluid
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

                    default:
                        replaceJSON(`${cfg_path}/usercfg.json`, "fluid", 0)
                    break
                    // Liter || USGallon || UKGallon
                }           
            break;

            case 'setting_fluidCon':
                let fluidCon = JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).Basics.fluidCon
                switch(fluidCon) {
                    case 0:
                        replaceJSON(`${cfg_path}/usercfg.json`, "fluidCon", 1)
                    break

                    case 1:
                        replaceJSON(`${cfg_path}/usercfg.json`, "fluidCon", 2)
                    break

                    case 2:
                        replaceJSON(`${cfg_path}/usercfg.json`, "fluidCon", 0)
                    break

                    default:
                        replaceJSON(`${cfg_path}/usercfg.json`, "fluidCon", 0)
                    break
                    // Liter || USGallon || UKGallon
                }           
            break;
            
            case 'setting_weight':
                let weight = JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).Basics.weight
                switch(weight) {
                    case 0:
                        replaceJSON(`${cfg_path}/usercfg.json`, "weight", 1)
                    break

                    case 1:
                        replaceJSON(`${cfg_path}/usercfg.json`, "weight", 2)
                    break

                    case 2:
                        replaceJSON(`${cfg_path}/usercfg.json`, "weight", 3)
                    break

                    case 3:
                        replaceJSON(`${cfg_path}/usercfg.json`, "weight", 0)
                    break

                    default:
                        replaceJSON(`${cfg_path}/usercfg.json`, "weight", 0)
                    break
                    // Tons || USPounds || UKPounds ||
                } 
            break;
            
            case 'setting_temp':
                if(JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).Basics.temp === "Celsius") {
                    replaceJSON(`${cfg_path}/usercfg.json`, "temp", "Fahrenheit")
                } else {
                    replaceJSON(`${cfg_path}/usercfg.json`, "temp", "Celsius")
                }
            break;

            case 'setting_time':
                if(JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).Basics.timeFormat === "EU") {
                    replaceJSON(`${cfg_path}/usercfg.json`, "timeFormat", "US")
                } else {
                    replaceJSON(`${cfg_path}/usercfg.json`, "timeFormat", "EU")
                }
            break;



            default:
            break;
        }

    })
    
    TPClient.on("Settings", async (data) => {

        replaceJSON(`${cfg_path}/cfg.json`, `refreshInterval`, Number(data[0].Refresh_Interval))

        for (var i = 0; i < CurrencyList.length; await timeout(10), i++) {

            if (CurrencyList[i] === data[1].Currency) {
                replaceJSON(`${cfg_path}/usercfg.json`, `currency`, `${data[1].Currency}`)

                break
            } else {
                if (i === CurrencyList.length - 1) {
                    logIt("INFO", "Currency not Found! Using Default!")
                    replaceJSON(`${cfg_path}/usercfg.json`, `currency`, `EUR`)
                    settings_error = settings_error+1
                    break
                }
            }
        }

        replaceJSON(`${cfg_path}/cfg.json`, `TruckersMPServer`, Number(data[2].TruckersMP_Server))

        switch (data[3].AutoUpdate.toLowerCase()) {
            case "true":
                replaceJSON(`${cfg_path}/cfg.json`, `UpdateCheck`, true)
                break;
            case "false":
                replaceJSON(`${cfg_path}/cfg.json`, `UpdateCheck`, false)
                break;
            default:
                settings_error = settings_error+1
        }

        switch (data[4].PreRelease.toLowerCase()) {
            case "true":
                replaceJSON(`${cfg_path}/usercfg.json`, `PreRelease`, true)
                break;
            case "false":
                replaceJSON(`${cfg_path}/usercfg.json`, `PreRelease`, false)
                break;
            default:
                settings_error = settings_error+1
        }

        switch (data[5].OfflineMode.toLowerCase()) {
            case "true":
                replaceJSON(`${cfg_path}/cfg.json`, `OfflineMode`, true)
                break;
            case "false":
                replaceJSON(`${cfg_path}/cfg.json`, `OfflineMode`, false)
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
    if (system_path.basename(process.cwd()) === "ETS2_Dashboard") {
        let MissingFiles = await filescheck(path, cfg_path, logIt, timeout)
        if(MissingFiles > 0) {
            UpdateQuestion = await showDialog("error", ["yes", "no"], "ETS2 Dashboard", `Missing ${MissingFiles} Files/Folders! Continue?`)
        
            if (UpdateQuestion === 0) {
                return
            } else {
                exit()
            }
        }
    }

    // Loading Configs 
    logIt("MAIN", "INFO", "Loading `Config Files`...")
    let config = new sJSON(`${cfg_path}/cfg.json`)
    let uConfig = new sJSON(`${cfg_path}/usercfg.json`)
    let CurrencyList = new sJSON(`${cfg_path}/currency.json`)    
    let OfflineMode = config.OfflineMode
    let refreshInterval = config.refreshInterval

    //Checking Settings
    if (refreshInterval < 50) {
        logIt("WARN", "RefreshRate too low! Setting up RefreshRate...")
        replaceJSON(`${cfg_path}/cfg.json`, "refreshInterval", 50)
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
            replaceJSON(`${cfg_path}/usercfg.json`, `truckersmpStates`, false)
        });
    }
    
    // Checking for Update...
    if (OfflineMode === false) {
        logIt("MAIN", "INFO", "Starting AutoUpdate Script...")
        await AutoUpdate(config.UpdateCheck, uConfig.PreRelease, config.version, logIt, showDialog, timeout)
    }

    // Checking for FirstInstall
    if (system_path.basename(process.cwd()) === "ETS2_Dashboard" && JSON.parse(fs.readFileSync(`${cfg_path}/cfg.json`)).firstInstall === true || Testing === true) {
        logIt("MAIN", "INFO", "Starting First Install Script...")
        if(await firstInstall(showDialog, logIt, OfflineMode, timeout)) {
            replaceJSON(`${cfg_path}/cfg.json`, "firstInstall", false)
        } else {
            logIt("MAIN", "ERROR", "Something went wrong while FirstInstall")
        }
    }

    TouchPortalConnection(path, cfg_path, telemetry_path, uConfig, CurrencyList, refreshInterval, OfflineMode)
}

if(Testing) {
    async function test() {
    }
    test()
}

main(path, cfg_path, telemetry_path)

