// Import Writing Modules
const fs = require(`fs`)
const fse = require('fs-extra')
const replaceJSON = require(`replace-json-property`).replace
// Import Internet Modules
const axios = require('axios')
const request = require('request');
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

            if (system_path.basename(process.cwd()) === "ETS2_Dashboard_autoupdate") {
                logIt("AUTOUPDATE", "INFO", "AutoUpdate Detected...")
    
                let currency = ""
                let unit = ""
                let fluid = ""
                let weight = ""
                let temp = ""
                let timeFormat = ""
                let TruckersMPServer = ""
                let FolderSize = ""
                let Downloads_Path = process.env.USERPROFILE + "\\Downloads\\ETS2_Dashboard_autoupdate"
                let TP_path = process.env.APPDATA + `/TouchPortal/plugins/ETS2_Dashboard`
    
                UpdateQuestion = await showDialog("warning", ["Yes", "No"], "ETS2 Dashboard", "Do you want to Update your Plugin?")
    
                if (UpdateQuestion === 0) {
                
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

                            await timeout(1000)
                            
                            currency = OldValues.Basics.currency
                            unit = OldValues.Basics.unit
                            fluid = OldValues.Basics.fluid
                            weight = OldValues.Basics.weight
                            temp = OldValues.Basics.temp
                            timeFormat = OldValues.Basics.timeFormat
                            TruckersMPServer = OldValues.Basics.TruckersMPServer
                            progressBar.value += 3

                            await timeout(200)
                            resolve()
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

                            try {
                                for (var i = 0; i < Files.length; true, i++) {
                                    fs.rmSync(Files[i])                                
                                    progressBar.value += 1
                                }
                                
                                for (var i = 0; i < Folder.length; true, i++) {
                                    fs.rmdirSync(Folder[i])                                
                                    progressBar.value += 1
                                }
                                
                                
                            } catch (e) {
                                logIt("AUTOUPDATE", "INFO", e)
                            }
                            
                            await timeout(200)
                            resolve()
                        })
                    }
    
                    async function CopyFiles(Folder, Files) {
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

                            try {
                                for (var i = 0; i < Folder.length; true, i++) {
                                    element = Folder[i]
                                    element = element.replace(`${Downloads_Path}`, '')
                                    element = element.split('\\')
                                    element = element.join(`/`)
                                    progressBar.value += 1
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
                                    progressBar.value += 1
                                    
                                }
                            } catch (e) {
                                logIt("AUTOUPDATE", "ERROR", e)
                            }
                            
                            await timeout(200)
                            resolve()

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

                    
                    let Files  = [];
                    let Folder = [];
                    let OldFolderSize = 0
                    let NewFolderSize = 0
                    let FolderSizes = 0
                    let BarMode = 0

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
                    OldFolderSize = Files.length+Folder.length
                    await ThroughDirectory(Downloads_Path)
                    NewFolderSize = Files.length+Folder.length-OldFolderSize
                
                    FolderSizes = Files.length+Folder.length

                    var progressBar = new ProgressBar({
                        title: "ETS2 Dashboard Update",
                        text: 'Preparing data...',
                        indeterminate: false,
                        maxValue: FolderSizes+100
                    });

                    progressBar.value += 1

                    progressBar.on('progress', function(value) {
                        switch (BarMode) {
                            case 0:
                                progressBar.detail = `Preparing Data: ${value} out of 6...`;
                            break;

                            case 1:
                                progressBar.detail = `Deleting Old Data: ${value-8} out of ${OldFolderSize}...`;
                            break;

                            case 2:
                                progressBar.detail = `Copy New Data: ${value-OldFolderSize} out of ${NewFolderSize}...`;
                            break;
                        }
                    });
                    
                    progressBar.on('ready', async function() {
                        await PrepFiles(progressBar)
                        BarMode = 1
                        await DeleteFiles(progressBar)
                        BarMode = 2
                        await CopyFiles(progressBar)
                        progressBar.detail = "Done."
                        
                        replaceJSON(`${process.env.APPDATA}/TouchPortal/plugins/ETS2_Dashboard/config/cfg.json`, "firstInstall", false)
                        await showDialog("info", ["Ok"], "ETS2 Dashboard", "Update Done! You can start TouchPortal again and delete this Folder")
                        
                        exit()
                    }) 
    
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
                                UpdateQuestion = await showDialog("info", ["Yes", "No"], "ETS2 Dashboard: AutoUpdater", `We found a new Update! Version: PreRelease-${newversion}, Install?`)
                            } else {
                                UpdateQuestion = await showDialog("info", ["Yes", "No"], "ETS2 Dashboard: AutoUpdater", `We found a new Update! Version: ${newversion}, Install?`)
                            }

                            if (UpdateQuestion === 0) {
                                logIt("AUTOUPDATE", "INFO", "Update starting...")

                                let progressBar 
                                var body = "";
                                var cur = 0;
                                var len = ""
                                var total = ""

                                if (fs.existsSync(`${download_path}/ETS2_Dashboard_autoupdate`)) {
                                    try {
                                        fs.rmdirSync(`${download_path}/ETS2_Dashboard_autoupdate`, { recursive: true })
                                    } catch (e) {
                                        await showDialog("warning", ["Done"], "ETS2 Dashboard", "Due to AntiVirus issues we can not delete any Files outside this Plugin. Please delete the 'ETS2_Dashboard_autoupdate' Folder in your Downloads Folder")
                                        logIt("AUTOUPDATE", "ERROR", e)
                                    }
                                }

                                if(fs.existsSync(`${download_path}/ETS2_Dashboard.tpp`)) { 
                                    try { 
                                        fs.rmSync(`${download_path}/ETS2_Dashboard.tpp`) 
                                    } catch (e) {
                                        await showDialog("warning", ["Done"], "ETS2 Dashboard", "Due to AntiVirus issues we can not delete any Files outside this Plugin. Please delete the 'ETS2_Dashboard.tpp' File in your Downloads Folder")
                                        logIt("AUTOUPDATE", "ERROR", e)
                                    }
                                }
                                
                                let file = fs.createWriteStream(`${download_path}/ETS2_Dashboard.tpp`);
                                request({
                                    uri: url,
                                    headers: {
                                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                                        'Accept-Encoding': 'gzip, deflate, br',
                                        'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
                                        'Cache-Control': 'max-age=0',
                                        'Connection': 'keep-alive',
                                        'Upgrade-Insecure-Requests': '1',
                                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36'
                                    },
                                    gzip: true
                                })
                                .on('response', function ( data ) {
                                    len = parseInt(data.headers['content-length'], 10);
                                    total = len / 1048576; //1048576 - bytes in  1Megabyte
                                                                        
                                    progressBar = new ProgressBar({
                                        title: "ETS2 Dashboard Update",
                                        text: 'AutoUpdate',
                                        indeterminate: false,
                                        maxValue: 101
                                    });
                                    
                                    progressBar.on('progress', function(value) {
                                        progressBar.detail = `Downloading Update: ${(100.0 * cur / len).toFixed(2)}%`;
                                    });
                                })
                                .on('data', (chunk) => {
                                    body += chunk
                                    cur += chunk.length;
                                    progressBar.value = Math.round(Number((100.0 * cur / len)))
                                })
                                .on('error', async (error) => {
                                    logIt("AUTOUPDATER", "INFO", "Error while Downloading Update... " + error)
                                    progressBar.detail = `Error while downloading Update... Closing in 5 Seconds...`
                                    await timeout(5000)
                                    exit()
                                })
                                .pipe(file)
                                .on('finish', async () => {
                                    progressBar.detail = `Download Completed.`
                                    logIt("AUTOUPDATE", "INFO", "Download Finished!")
                                    logIt("AUTOUPDATE", "INFO", "Waiting 1.5 Seconds to let the Script write the zip Header...")
                                    await timeout(1500)
                                    progressBar.detail = 'Unzipping Update...';
                                    
                                    try {
                                        var zip = new AdmZip(`${download_path}/ETS2_Dashboard.tpp`);
                                        logIt("AUTOUPDATE", "INFO", "Unzipping...!")
                                        zip.extractAllTo(`${download_path}`)
                                        fs.unlinkSync(`${download_path}/ETS2_Dashboard.tpp`)
                                        fs.renameSync(`${download_path}/ETS2_Dashboard`, `${download_path}/ETS2_Dashboard_autoupdate`)
                                        logIt("AUTOUPDATE", "INFO", "Unzip Finished!")
                                        progressBar.detail = "Done."
                                    } catch (e) {
                                        logIt("AUTOUPDATE", "Error", "Error while unzipping Update")
                                        logIt("AUTOUPDATE", "Error", e)
                                        progressBar.detail = "Error while unzipping Update..."
                                        await timeout(5000)
                                    }
                                    
                                    await timeout(200)
                                    
                                    //InstallQuestion = await showDialog("info", ["Yes", "No"], "ETS2 Dashboard: AutoUpdater", "Update Downloaded and unzipped! Do you want to install it now?")
                                    InstallQuestion = 1 // No Fix for ProgressBar Closes full plugin
                                    
                                    if (InstallQuestion === 0) {
                                        await showDialog("warning", ["Ok"], "ETS2 Dashboard: AutoUpdater", "Due to AntiVirus Issues you have to execute the File by hand. Just go to your Downloads Folder -> 'ETS2_Dashboard_autoupdate' and execute the 'ETS2_Dashboard.exe'.")
                                        logIt("AUTOUPDATE", "INFO", "Exiting Plugin due to Update...")
                                        exit()
                                        
                                    } else if (InstallQuestion === 1) {
                                        await showDialog("info", ["Okay!"], "ETS2 Dashboard: AutoUpdater", "If you want to install it, just go to your Downloads Folder, into 'ETS2_Dashboard' and execute the 'ETS2_Dashboard.exe' File. Plugin is Closing...")
                                        
                                        progressBar.close()
                                        exit()
                                        //resolve()
                                    }
                                })                                

                            } else if (UpdateQuestion === 1) {
                                logIt("AUTOUPDATE", "INFO", "Update Skipped")
                                progressBar.close()
                                resolve()
                            } else if (UpdateQuestion === 2) {
                                logIt("AUTOUPDATE", "INFO", "Update Skipped. Never ask Again!")
                                progressBar.close()
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