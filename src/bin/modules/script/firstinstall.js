// Import Writing Modules
const fs = require('fs')
// Import File System Modules
const AdmZip = require('adm-zip')
// Import Internet Modules
const download = require('download')

const firstInstall = async (showDialog, logIt, OfflineMode) => {
    return new Promise(async (resolve, reject) => {
        logIt("FIRSTINSTALL", "INFO", "First Install Script started...")
        
        // Telemetry Server first Install
        logIt("FIRSTINSTALL", "INFO", "Asking for Telemetry Server...")
        telemetryInstall = await showDialog("info", ["No. Let me do the First Steps", "Yes, im good"], "ETS2 Dashboard Plugin: First Install Detected!", "Hi! Did you ever used this Plugin before?")
        if (telemetryInstall === 0) {
            logIt("FIRSTINSTALL", "INFO", "Installing Telemetry Server...")
            require('child_process').exec('start "" "%appdata%/TouchPortal/plugins/ETS2_Dashboard/server"');
            await timeout(500)
            await showDialog("info", ["Okay!"], "ETS2 Dashboard", "To use this Plugin you need to install the Telemetry Server by Hand! \nTo do this, just open the 'Ets2Telemtry.exe' in the Folder we just opend for you and click on Install and follow the Instruction!")
        } else {
            logIt("FIRSTINSTALL", "INFO", "Telemetry already installed.")
        }
        
        
        // Default page
        if (OfflineMode === false) {
            logIt("FIRSTINSTALL", "INFO", "Asking Player for Default Page")
            defaultPageChoice = await showDialog("question", ["Yes, the KMH Version.", "Yes, the MPH Version", "No, Thanks"], "ETS2 Dashboard Plugin: First Install Detected!", "We have a Default Page for new Users! Do you want to install it?")
            if (defaultPageChoice === 0 || defaultPageChoice === 1) {
                logIt("FIRSTINSTALL", "INFO", "Downloading Default Page")
                
                download_File = ""
                if (defaultPageChoice === 0) {
                    download_File = "DefaultPage_KMH.zip"
                }
                
                if (defaultPageChoice === 1) {
                    download_File = "DefaultPage_MPH.zip"
                }
                
                
                url = "https://github.com/NyboTV/TP_ETS2_Plugin/raw/master/src/build/defaultPage/" + download_File
                download_path = process.env.APPDATA + `/TouchPortal/plugins/ETS2_Dashboard/tmp/`;
                
                try {
                    download(url, download_path)
                    .then(async () => {
                        logIt("FIRSTINSTALL", "INFO", "Download Finished!")
                        
                        var zip = new AdmZip(`${process.env.APPDATA}/TouchPortal/plugins/ETS2_Dashboard/tmp/${download_File}`);
                        logIt("FIRSTINSTALL", "INFO", "Unzipping...")
                        zip.extractAllTo(`${process.env.APPDATA}/TouchPortal/`)
                        logIt("FIRSTINSTALL", "INFO", "Unzip Finished! Deleting tmp File")
                        fs.unlinkSync(`${process.env.APPDATA}/TouchPortal/plugins/ETS2_Dashboard/tmp/${download_File}`)
                        
                        logIt("FIRSTINSTALL", "INFO", "Install Finished!")
                        await showDialog("info", ["Okay!", "Restart now! (Not a thing yet!)"], "ETS2 Dashboard Plugin: First Install Detected!", "Please Restart TouchPortal to see the Default Page.")
                        resolve(true)
                    })
                } catch (e) {
                    logIt("FIRSTINSTALL", "INFO", "Error while First Setup!! \n" + e)
                }
                
            } else {
                logIt("FIRSTINSTALL", "INFO", "Default Page install skipped...")
                resolve(true)
            }
        } else {
            logIt("FIRSTINSTALL", "INFO", "User is Offline, skipping DefaultPage Setup")
        }
    })
}
    


    
module.exports = firstInstall