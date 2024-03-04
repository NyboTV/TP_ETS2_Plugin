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

const AutoUpdate = async (UpdateCheck, PreReleaseAllowed, lastVersion, logger, showDialog, timeout) => {
    return new Promise(async (resolve, reject) => {
        let newversion = ""
        let NeedUpdate = false

        try {
            if (UpdateCheck === true && debugMode === false || Testing === true) {
                logger.info("[AUTOUPDATE] Checking for Updates... (Searching for PreRelease allowed: " + PreReleaseAllowed + ")")

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
                            logger.info("[AUTOUPDATE] Check skipped. Asset is not present.")
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
                                logger.info("[AUTOUPDATE] Update starting...")

                                let progressBar 
                                var body = "";
                                var cur = 0;
                                var len = ""

                                if(fs.existsSync(`${download_path}/ETS2_Dashboard.tpp`)) { 
                                    try { 
                                        fs.rmSync(`${download_path}/ETS2_Dashboard.tpp`) 
                                    } catch (e) {
                                        await showDialog("warning", ["Done"], "Due to AntiVirus issues we can not delete any Files outside this Plugin. Please delete the 'ETS2_Dashboard.tpp' File in your Downloads Folder")
                                        logger.error("[AUTOUPDATE] ERROR " + e)
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
                                        text: 'AUTOUPDATE',
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
                                    logger.error("[AUTOUPDATE] Error while Downloading Update... " + error)
                                    progressBar.detail = `Error while downloading Update... Closing in 5 Seconds...`
                                    await timeout(5000)
                                    exit()
                                })
                                .pipe(file)
                                .on('finish', async () => {
                                    progressBar.detail = `Download Completed.`
                                    logger.info("[AUTOUPDATE] Download Finished!")
                                    logger.info("[AUTOUPDATE] Waiting 1.5 Seconds to let the Script write the zip Header...")
                                    await timeout(1500)
                                    progressBar.detail = 'Finishing Download...';
                                    
                                    await timeout(200)

                                    logger.info("[AUTOUPDATE] Backup Config...")
                                    progressBar.detail = 'Backup Config Files...';
                                    
                                    fs.mkdirSync(`${download_path}/ETS2_Dashboard-Backup`)
                                    fse.copySync("./config", `${download_path}/ETS2_Dashboard-Backup`)
                                    replaceJSON(`${download_path}/ETS2_Dashboard-Backup/cfg.json`, "version", `${newversion}`)
                                    
                                    await timeout(2000)
                                    
                                    progressBar.detail = 'Starting Install...';
                                    
                                    try{
                                        exec(`${download_path}/ETS2_Dashboard.tpp`)
                                    } catch (e) {
                                        logger.error(`[AUTOUPDATE] ERROR ${e}`)
                                    }
                                    await timeout(1500)
                                    logger.info("[AUTOUPDATE] Exiting Plugin due to Update...")
                                    progressBar.close()
                                    exit()
                                })                                

                            } else if (UpdateQuestion === 0) {
                                logger.info("[AUTOUPDATE] Update Skipped")
                                resolve()
                            }
                        } else {
                            logger.info("[AUTOUPDATE] No Update Found.")
                            resolve()
                        }

                    })
                    .catch(function(error) {
                        logger.error("[AUTOUPDATE] Error " + error)
                    })

            } else {
                logger.info("[AUTOUPDATE] Disabled")
                resolve()
            }

        } catch (e) {
            logger.error("[AUTOUPDATE] ERROR " + e)
            //resolve()
        }
    })
}
    
module.exports = AutoUpdate