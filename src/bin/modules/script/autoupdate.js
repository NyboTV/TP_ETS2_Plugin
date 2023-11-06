// Import Writing Modules
const fs = require(`fs`)
const fse = require('fs-extra')
const replaceJSON = require(`replace-json-property`).replace
// Import Internet Modules
const axios = require('axios')
const request = require('request');
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
            if (UpdateCheck === true && debugMode === false || Testing === true) {
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

                        if (!response.assets[0]) {
                            NeedUpdate = false
                            logIt("AUTOUPDATE", "WARNING", "AutoUpdate Check skipped. Asset is not present.")
                        }

                        if (NeedUpdate === true) {
                            newversion = response.tag_name
                            url = `https://github.com/NyboTV/TP_ETS2_Plugin/releases/download/${newversion}/ETS2_Dashboard.tpp`
                            download_path = process.env.USERPROFILE + "/Downloads"

                            if (response.prerelease === true) {
                                UpdateQuestion = await showDialog("question", ["No", "Yes", "Changelog"], `We found a new Update! Version: PreRelease-${newversion}, Install?`)
                            } else {
                                UpdateQuestion = await showDialog("question", ["No", "Yes", "Changelog"], `We found a new Update! Version: ${newversion}, Install?`)
                            }

                            if (UpdateQuestion === 2) {
                                UpdateQuestion = await showDialog("info", ["Later", "Update now!"], `*CHANGELOG* \n\n${response.body}`)
                            }
                        
                            if (UpdateQuestion === 1) {
                                showDialog("warning", ["Okay"], `If the Import will not start after the ProgressBar Closed, then you need to go to your Downloads Folder and execute the ETS2_Dashboard.tpp File! \n\nIf Windows will ask you which Programm you want to use to open the File, search the TouchPortal.exe and select it!`)
                                logIt("AUTOUPDATE", "INFO", "Update starting...")

                                let progressBar 
                                var body = "";
                                var cur = 0;
                                var len = ""
                                var total = ""

                                if(fs.existsSync(`${download_path}/ETS2_Dashboard.tpp`)) { 
                                    try { 
                                        fs.rmSync(`${download_path}/ETS2_Dashboard.tpp`) 
                                    } catch (e) {
                                        await showDialog("warning", ["Done"], "Due to AntiVirus issues we can not delete any Files outside this Plugin. Please delete the 'ETS2_Dashboard.tpp' File in your Downloads Folder")
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
                                    progressBar.detail = 'Finishing Download...';
                                    
                                    await timeout(200)

                                    logIt("AUTOUPDATE", "INFO", "Backup Config...")
                                    progressBar.detail = 'Backup Config Files...';
                                    
                                    fs.mkdirSync(`${download_path}/ETS2_Dashboard-Backup`)
                                    fse.copySync("./config", `${download_path}/ETS2_Dashboard-Backup`)
                                    replaceJSON(`${download_path}/ETS2_Dashboard-Backup/cfg.json`, "version", `${newversion}`)
                                    
                                    await timeout(2000)
                                    
                                    progressBar.detail = 'Starting Install...';
                                    
                                    try{
                                        exec(`${download_path}/ETS2_Dashboard.tpp`)
                                    } catch (e) {
                                        logIt("AUTOUPDATE", "ERROR", `${e}`)
                                    }
                                    await timeout(1500)
                                    logIt("AUTOUPDATE", "INFO", "Exiting Plugin due to Update...")
                                    progressBar.close()
                                    exit()
                                })                                

                            } else if (UpdateQuestion === 0) {
                                logIt("AUTOUPDATE", "INFO", "Update Skipped")
                                resolve()
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