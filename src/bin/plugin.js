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
const http = require(`request`);
const checkInternetConnected = require('check-internet-connected');
// Import Path/Zip Modules
const system_path = require('path');
// Import System Modules
const { exit } = require('process');
// import Custom Modules
const { logger } = require('./modules/script/logger')
const showDialog = require('./modules/script/showDialog')
const timeout = require('./modules/script/timeout')
const filescheck = require('./modules/script/filescheck')
const AutoUpdate = require('./modules/script/autoupdate')
const firstInstall = require('./modules/script/firstinstall')
const usage = require('./modules/script/usage')
const telemetry_Server = require('./modules/script/telemetry');
const pluginEvents = require('./modules/script/emitter')
// Debug Section
const debugMode = process.argv.includes("--debugging")
const noServer = process.argv.includes("--noServer")
const Testing = process.argv.includes("--testing")
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

const dirpath = process.cwd()
const path = debugMode ? `./src/bin` : dirpath
const cfg_path = path+"/config"
const telemetry_path = path+"/tmp"
const download_path = process.env.USERPROFILE + "/Downloads"

let eventTimeout = {}

// First Setup Folder Creation
if(!fs.existsSync(`${path}/tmp`)) { fs.mkdirSync(`${path}/tmp`) }

const TouchPortalConnection = async () => {
    let settings_error = 0
    let CurrencyList = new sJSON(`${cfg_path}/currency.json`).currency_list   
    let refreshInterval = new sJSON(`${cfg_path}/cfg.json`).refreshInterval

    TPClient.on("Info", async (data) => {
        // After TP Ready, Modules gets loaded
        logger.info("[TOUCHPORTAL] TP loaded. Loading Modules...")
        usage(TPClient, dirpath, timeout)    
        if(!noServer) { telemetry_Server(path, telemetry_path, refreshInterval) }

        let config = new sJSON(`${cfg_path}/cfg.json`)
        let userconfig = new sJSON(`${cfg_path}/usercfg.json`)

        const configs = {
            config,
            userconfig
        }

        logger.info("[MODULES] Loading Modules...")
        await mainStates(TPClient, path, configs)
        await truckersmpStates(TPClient, path, configs)

        await driverStates(TPClient, path, configs)
        await gameStates(TPClient, path, configs)
        await gaugeStates(TPClient, path, configs)
        await jobStates(TPClient, path, configs)
        await navigationStates(TPClient, path, configs)
        await trailerStates(TPClient, path, configs)
        await truckStates(TPClient, path, configs)
        await worldStates(TPClient, path, configs)

        logger.info("[MODULES] Loading Event listener...")
        
        pluginEvents.on(`telemetryRequest`, () => { 
            logger.info(`[MODULES] Starting Updates...`)
            const telemetryLoop = async () => {
                http.get(`http://localhost:25555/api/ets2/telemetry`, async function(err, resp, body) {
                    var data = ``;
                    data = body
                    
                    if (err != null) {
                        logger.error("[TELEMETRY] Request Error")                        
                        await timeout(3000)
                        return
                    }
                    
                    try {
                        const module = JSON.parse(fs.readFileSync(`${cfg_path}/usercfg.json`)).Modules
                        data = JSON.parse(data)
                        
                        let game = data.game
                        let truck = data.truck
                        let navigation = data.navigation
                        let job = data.job
                        let trailer = data.trailer
                        let cargo = data.cargo
                    
                        let driverStates = data.game
                        let gameStates = data.game
                        let gaugeStates = data.truck
                        let jobStates = {game, job, navigation}
                        let navigationStates = data.navigation
                        let trailerStates = {trailer, cargo}
                        let truckStates = data.truck
                        let worldStates = data.game
    
                        
                        pluginEvents.emit(`driverStates`, driverStates);
                        pluginEvents.emit(`gameStates`, gameStates);
                        pluginEvents.emit(`gaugeStates`, gaugeStates);
                        pluginEvents.emit(`jobStates`, jobStates);
                        pluginEvents.emit(`navigationStates`, navigationStates);
                        pluginEvents.emit(`trailerStates`, trailerStates);
                        pluginEvents.emit(`truckStates`, truckStates);
                        pluginEvents.emit(`worldStates`, worldStates);
                    } catch (error) {        
                        logger.error(`[TELEMETRY] Telemetry Data Error! -> ${error}`)
                        console.log(error)
                        await timeout(3000)
                        return
                    }
                })
                await new Promise(resolve => setTimeout(resolve, refreshInterval)); 
                await telemetryLoop(); 
            };
            telemetryLoop()
        })
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
                    logger.info("[SETTINGS] Currency not Found! Using Default!")
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
            showDialog("error", ["Ok"], "Hey! You messed something up in the Settings! Please check them! Meanwhile we are using the Default Settings to prevent Crashes. Read more on Github.")
        }

    });

    logger.info("[TOUCHPORTAL] Connecting to `Touch Portal`...")
    TPClient.connect({
        pluginId
    })

}

const main = async () => {
    // Pre-Setup // Checking Missing Files/Folders
    if (system_path.basename(process.cwd()) === "ETS2_Dashboard") {
        let MissingFiles = await filescheck(cfg_path, logger)
        if(MissingFiles > 0) {
            UpdateQuestion = await showDialog("error", ["yes", "no"], `Missing ${MissingFiles} Files/Folders! Continue?`)
        
            if (UpdateQuestion !== 0) {
                await showDialog("info", "Ok", `Plugin Start aborted! Please send the Log File in Plugins Folder to the Creator on Discord!`)
                exit()
            }
        }
    }

    //Deleting Old Update File
    if(fs.existsSync(`${download_path}/ETS2_Dashboard.tpp`)) {
        fs.rmSync(`${download_path}/ETS2_Dashboard.tpp`)
    }

    // Checking for Config Backup
    if(fs.existsSync(`${download_path}/ETS2_Dashboard-Backup`)) {
        logger.info("[MAIN] Found Old Config Backup... Loading Backup...")
        fse.copySync(`${download_path}/ETS2_Dashboard-Backup`, `./config`)
        fs.rmdirSync(`${download_path}/ETS2_Dashboard-Backup`, {recursive: true})
        logger.info("[MAIN] Config Backup Deleted.")
    }

    // Loading Configs 
    logger.info("[MAIN] Loading `Config Files`...")
    let config = new sJSON(`${cfg_path}/cfg.json`)
    let uConfig = new sJSON(`${cfg_path}/usercfg.json`) 
    let refreshInterval = config.refreshInterval
    let OfflineMode = config.OfflineMode

    //Checking Settings
    if (refreshInterval < 50) {
        logger.info("[WARN] RefreshRate too low! Setting up RefreshRate...")
        replaceJSON(`${cfg_path}/cfg.json`, "refreshInterval", 50)
        refreshInterval = 50
    }
    
    // Checks Internet
    if(OfflineMode === false) {
        await checkInternetConnected()
        .then((result) => {
            logger.info("[MAIN] Internet Connected!")
        })
        .catch((ex) => {
            logger.info("[MAIN] No Internet Connection!")
            OfflineMode = true
            
            logger.info("[MAIN] Disable TruckersMP states to prevent errors...")
            replaceJSON(`${cfg_path}/usercfg.json`, `truckersmpStates`, false)
        });
    }
    
    // Checking for Update...
    if (OfflineMode === false) {
        logger.info("[MAIN] Starting AutoUpdate Script...")
        await AutoUpdate(config.UpdateCheck, uConfig.PreRelease, config.version, logger, showDialog, timeout)
    }

    // Checking for FirstInstall
    if (system_path.basename(process.cwd()) === "ETS2_Dashboard" && JSON.parse(fs.readFileSync(`${cfg_path}/cfg.json`)).firstInstall === true || Testing === true) {
        logger.info("[MAIN] Starting First Install Script...")
        if(await firstInstall(showDialog, logger.info, OfflineMode, timeout)) {
            replaceJSON(`${cfg_path}/cfg.json`, "firstInstall", false)
        } else {
            logger.error("[MAIN] Something went wrong while FirstInstall")
        }
    } else {
        logger.info("[MAIN] First Install Skipped.")
    }

    TouchPortalConnection()
}

main()
