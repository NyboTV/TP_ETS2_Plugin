// Import Writing Modules
const fs = require(`fs`)
const replaceJSON = require(`replace-json-property`).replace
// Import Internet Modules
const axios = require('axios')
const download = require('download');
// Import File System Modules
const AdmZip = require("adm-zip");
const system_path = require('path');
// Import System Modules
const { exit } = require('process');
// Import Electron Modules
const ProgressBar = require('electron-progressbar')
// Import System Modules
const { exec } = require(`child_process`)

// Debug Section
const debugMode = process.argv.includes("--debugging")
const Testing = process.argv.includes("--testing")

const isRunning = (query, cb) => {
    exec('tasklist', (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}

const autoupdate = async (UpdateCheck, PreReleaseAllowed, lastVersion, logIt, showDialog, timeout) => {
    return new Promise(async (resolve, reject) => {
        let newversion = ""
        let NeedUpdate = false

        try {

            if (system_path.basename(process.cwd()) === "ETS2_Dashboard_autoupdate" || Testing === true) {
                logIt("AUTOUPDATE", "INFO", "AutoUpdate Detected...")
    
                let currency = ""
                let unit = ""
                let fluid = ""
                let weight = ""
                let temp = ""
                let timeFormat = ""
                let TruckersMPServer = ""
                let Downloads_Path = process.env.USERPROFILE + "\\Downloads\\ETS2_Dashboard_autoupdate"
                let TP_path = process.env.APPDATA + `/TouchPortal/plugins/ETS2_Dashboard`
    
                UpdateQuestion = await showDialog("warning", ["Yes", "No"], "ETS2 Dashboard", "Do you want to Update your Plugin?")
    
                if (UpdateQuestion === 0) {
                    await timeout(200)
                
                    async function CheckTPEXE() {
                        return new Promise(async (resolve) => {
                            isRunning(`TouchPortalServices.exe`, async (status) => {
                                resolve(status)
                            })
                        })    
                    } 
    
                    async function PrepFiles() {
                        return new Promise(async (resolve, reject) => {
                            logIt("AUTOUPDATE", "INFO", "Prep. Files...")
                            var progressBar = new ProgressBar({
                                title: "ETS2 Dashboard Update",
                                text: 'Preparing data...',
                                indeterminate: false,
                                maxValue: 6
                            });
                            
                            progressBar.value += 1
                            progressBar.on('progress', function(value) {
                                progressBar.detail = `Preparing Data: ${value} out of ${progressBar.getOptions().maxValue}...`;
                            });
                            
                            progressBar.on('ready', async function() {
                                progressBar.value += 2
                                if(fs.existsSync(`${TP_path}/config/usercfg.json`)) {
                                    OldValues = JSON.parse(fs.readFileSync(`${TP_path}/config/usercfg.json`))
                                } else {
                                    OldValues = {
                                        "Basics": {
                                            "currency": "EUR",
                                            "unit": "Kilometer",
                                            "fluid": "Liters",
                                            "weight": "Tons",
                                            "temp": "Celsius",
                                            "timeFormat": "EU"
                                        }
                                    }
                                }
    
                                await timeout(2000)
                                
                                currency = OldValues.Basics.currency
                                unit = OldValues.Basics.unit
                                fluid = OldValues.Basics.fluid
                                weight = OldValues.Basics.weight
                                temp = OldValues.Basics.temp
                                timeFormat = OldValues.Basics.timeFormat
                                TruckersMPServer = OldValues.Basics.TruckersMPServer
                                progressBar.value += 3
    
                                progressBar.setCompleted()
    
                                await timeout(200)
                                resolve()
                            }) 
                        })    
                    }
                    
                    async function DeleteFiles() {
                        return new Promise(async (resolve, reject) => {
                            logIt("AUTOUPDATE", "INFO", "Deleting Old Files...")
    
                            let Files  = [];
                            let Folder = [];
                            function ThroughDirectory(Directory) {
                                return new Promise(async (resolve, reject) => {
                                    fs.readdirSync(Directory).forEach(File => {
                                        const Absolute = system_path.join(Directory, File);
                                        if (fs.statSync(Absolute).isDirectory()) { ThroughDirectory(Absolute); Folder.push(Absolute) }
                                        else return Files.push(Absolute);
                                    })
                                    resolve()
                                })
                            }
                            await ThroughDirectory(TP_path);
    
                            let FolderSize = Files.length+Folder.length
                            
                            var progressBar2 = new ProgressBar({
                                title: "ETS2 Dashboard Update",
                                text: 'Deleting data...',
                                indeterminate: false,
                                maxValue: FolderSize
                            });
                            
                            progressBar2.value +=1
    
                            progressBar2.on('progress', function(value) {
                                progressBar2.detail = `Deleting Old Data: ${value} out of ${progressBar2.getOptions().maxValue}...`;
                            });
                            
                            progressBar2.on('ready', async function() {       

                                await timeout(500)

                                try {
                                    for (var i = 0; i < Files.length; true, i++) {
                                        fs.rmSync(Files[i])                                
                                        progressBar2.value += 1
                                    }
                                    
                                    for (var i = 0; i < Folder.length; true, i++) {
                                        fs.rmdirSync(Folder[i])                                
                                        progressBar2.value += 1
                                    }
                                } catch (e) {
                                    logIt("AUTOUPDATE", "INFO", e)
                                }
                            })
                                
                            progressBar2.setCompleted()
                                
                            await timeout(200)
                            resolve()
                        })
                    }
    
                    async function CopyFiles() {
                        return new Promise(async (resolve, reject) => {   
                            logIt("AUTOUPDATE", "INFO", "Copy new Files...")      
    
                            let Files  = [];
                            let Folder = [];
                            function ThroughDirectory(Directory) {
                                return new Promise(async (resolve, reject) => {
                                    fs.readdirSync(Directory).forEach(File => {
                                        const Absolute = system_path.join(Directory, File);
                                        if (fs.statSync(Absolute).isDirectory()) { ThroughDirectory(Absolute); Folder.push(Absolute) }
                                        else return Files.push(Absolute);
                                    })
                                    resolve()
                                })
                            }
                            await ThroughDirectory(Downloads_Path);
    
                            let FolderSize = Files.length+Folder.length
                            
                            var progressBar3 = new ProgressBar({
                                title: "ETS2 Dashboard Update",
                                text: 'Copying data...',
                                indeterminate: false,
                                maxValue: FolderSize
                            });
                            
                            progressBar3.value +=1
    
                            progressBar3.on('progress', function(value) {
                                progressBar3.detail = `Copying New Data: ${value} out of ${progressBar3.getOptions().maxValue}...`;
                            });
                            
                            progressBar3.on('ready', async function() {     

                                await timeout(500)
                                
                                try {
                                    for (var i = 0; i < Folder.length; true, i++) {
                                        element = Folder[i]
                                        element = element.replace(`${Downloads_Path}`, '')
                                        element = element.split('\\')
                                        element = element.join(`/`)
                                        progressBar3.value += 1
                                        if(!fs.existsSync(TP_path + element)) {
                                            fs.mkdirSync(TP_path + element, { recursive: true })
                                        }
                                    }
                                    
                                    for (var i = 0; i < Files.length; true, i++) {
                                        
                                        element = Files[i]
                                        element = element.replace(`${Downloads_Path}`, '')
                                        element = element.split('\\')
                                        element = element.join(`/`)
                                        fs.copyFileSync(Files[i], TP_path + element)            
                                        progressBar3.value += 1
                                        
                                    }
                                } catch (e) {
                                    logIt("AUTOUPDATE", "ERROR", e)
                                }
    
                                progressBar3.setCompleted()
                                await timeout(200)
                                resolve()
                            })
    
                            
                        })
                    }
    
                    for(var i = 0; Infinity; await timeout(100)) {
                        if(await CheckTPEXE() === false) {
                            break
                        } else {
                            logIt("AUTOUPDATE", "INFO", "TP Still running...")
                            await showDialog("warning", ["Done"], "ETS2 Dashboard", "Please fully Close TouchPortal! Remember: Its getting minimized in your System-Tray!")
                            await timeout(500)
                        }
                    }
                    await PrepFiles()
                    await DeleteFiles()
                    await CopyFiles()
                    
                    replaceJSON(`${process.env.APPDATA}/TouchPortal/plugins/ETS2_Dashboard/config/cfg.json`, "firstInstall", false)
                    await showDialog("info", ["Ok"], "ETS2 Dashboard", "Update Done! You can start TouchPortal again and delete this Folder")
    
                    exit()
    
                } else if (UpdateQuestion === 1) {
                    await showDialog("info", ["Ok"], "ETS2 Dashboard", "Alright. Plugin is closing, due to execute in Downloads Folder!")
                    exit()
                }
    
            } else if (UpdateCheck === true && debugMode === false || Testing === true) {
                logIt("AUTOUPDATE", "INFO", "Checking for Updates... (Searching for PreRelease allowed: " + PreReleaseAllowed + ")")

                axios.get('https://api.github.com/repos/NyboTV/TP_ETS2_Plugin/releases')
                    .then(async function(response) {
                        response = response.data[0]

                        newversion = response.tag_name.split(".")
                        lastVersion = lastVersion.split(".")

                        if (response.prerelease === true && PreReleaseAllowed === true) {
                            for (var i = 0; i < newversion.length; await timeout(20), i++) {
                                if (newversion[i] > lastVersion[i]) {
                                    NeedUpdate = true
                                }
                            }
                        } else if (response.prerelease === false) {
                            for (var i = 0; i < newversion.length; await timeout(20), i++) {
                                if (newversion[i] > lastVersion[i]) {
                                    NeedUpdate = true
                                }
                            }
                        }


                        if (NeedUpdate === true) {
                            newversion = response.tag_name
                            url = `https://github.com/NyboTV/TP_ETS2_Plugin/releases/download/${newversion}/ETS2_Dashboard.tpp`
                            download_path = process.env.USERPROFILE + "/Downloads"

                            if (response.prerelease === true) {
                                UpdateQuestion = await showDialog("info", ["Yes", "No"], "ETS2 Dashboard: AutoUpdater", "We found a new Update! Install? (Attention! Its a Pre-Release!)")
                            } else {
                                UpdateQuestion = await showDialog("info", ["Yes", "No"], "ETS2 Dashboard: AutoUpdater", "We found a new Update! Install?")
                            }

                            var progressBar = new ProgressBar({
                                title: "ETS2 Dashboard Update",
                                text: 'Preparing data...',
                            });

                            if (UpdateQuestion === 0) {
                                logIt("AUTOUPDATE", "INFO", "Update starting...")
                                progressBar.detail = 'Downloading Update...';

                                if (fs.existsSync(`${download_path}/ETS2_Dashboard_autoupdate`)) {
                                    try {
                                        fs.unlinkSync(`${download_path}/ETS2_Dashboard_autoupdate`)
                                    } catch (e) {
                                        await showDialog("warning", ["Done"], "ETS2 Dashboard", "Due to AntiVirus issues we can not delete any Files outside this Plugin. Please delete the 'ETS2_Dashboard_autoupdate' folder in your Downloads Folder")
                                    }
                                }


                                download(url, download_path)
                                    .then(async () => {
                                        logIt("AUTOUPDATE", "INFO", "Download Finished!")
                                        progressBar.detail = 'Unzipping Update...';

                                        var zip = new AdmZip(`${download_path}/ETS2_Dashboard.tpp`);
                                        logIt("AUTOUPDATE", "INFO", "Unzipping...!")
                                        zip.extractAllTo(`${download_path}`)
                                        fs.unlinkSync(`${download_path}/ETS2_Dashboard.tpp`)
                                        fs.renameSync(`${download_path}/ETS2_Dashboard`, `${download_path}/ETS2_Dashboard_autoupdate`)
                                        logIt("AUTOUPDATE", "INFO", "Unzip Finished!")

                                        progressBar.setCompleted()

                                        await timeout(200)

                                        InstallQuestion = await showDialog("info", ["Yes", "No"], "ETS2 Dashboard: AutoUpdater", "Update Downloaded and unzipped! Do you want to install it now?")

                                        if (InstallQuestion === 0) {
                                            await showDialog("warning", ["Ok"], "ETS2 Dashboard: AutoUpdater", "Due to AntiVirus Issues you have to execute the File by hand. Just go to your Downloads Folder -> 'ETS2_Dashboard_autoupdate' and execute the 'ETS2_Dashboard.exe'.")
                                            logIt("AUTOUPDATE", "INFO", "Exiting Plugin due to Update...")
                                            exit()

                                        } else if (InstallQuestion === 1) {
                                            await showDialog("info", ["Okay!"], "ETS2 Dashboard: AutoUpdater", "If you want to install it, just go to your Downloads Folder, into 'ETS2_Dashboard' and execute the 'ETS2_Dashboard.exe' File.")
                                            resolve(true)
                                        }

                                    }).catch(async (e) => {
                                        logIt("AUTOUPDATE", "Error", "Error while Connecting to Update")
                                        logIt("AUTOUPDATE", "Error", e)
                                        progressBar.detail("Error while downloading")

                                        await timeout(2000)
                                        progressBar.setCompleted()
                                    })

                            } else if (UpdateQuestion === 1) {
                                logIt("AUTOUPDATE", "INFO", "Update Skipped")
                                progressBar.setCompleted()
                                resolve()
                            } else if (UpdateQuestion === 2) {
                                logIt("AUTOUPDATE", "INFO", "Update Skipped. Never ask Again!")
                                progressBar.setCompleted()
                                replaceJSON(`${path}/config/cfg.json`, "UpdateCheck", false)
                            }
                        } else {
                            logIt("AUTOUPDATE", "INFO", "No Update Found.")
                            resolve()
                        }

                    })
                    .catch(function(error) {
                        logIt("AUTOUPDATE", "Error", error)
                    })

            } else {
                logIt("AUTOUPDATE", "INFO", "Disabled")
                resolve()
            }

        } catch (e) {
            logIt("AUTOUPDATER", "INFO", "AutoUpdater Failed!")
            logIt("AUTOUPDATER", "INFO", e)
            //resolve()
        }
    })
}
    
module.exports = autoupdate