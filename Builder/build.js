const fs = require('fs')
const fse = require('fs-extra')
const replaceJSON = require('replace-json-property')
const AdmZip = require('adm-zip')

let InputPath = "./src"
let OutputPath = "./Build/TMP"

fs.rmdirSync('./Build/TMP', { recursive: true })

fs.mkdirSync('./Build/TMP')

const pack = async () => {
    //Copy Main File
    fse.moveSync(`./ets2_plugin.exe`, `${OutputPath}/ets2_plugin.exe`)
    //Copy Index File
    fse.copySync(`./index.exe`, `${OutputPath}/index.exe`)
    //Copy Server Folder
    fse.copySync(`${InputPath}/server`, `${OutputPath}/server`)
    //Copy IMG Folder
    fse.copySync(`${InputPath}/images`, `${OutputPath}/images`) 
    //Copy Config File
    fse.copySync(`./config.json`, `${OutputPath}/config.json`) 
    replaceJSON(`${OutputPath}/config.json`, `version`, '0.0.0')
    replaceJSON(`${OutputPath}/config.json`, `userid`, '')
    replaceJSON(`${OutputPath}/config.json`, `discordMessage`, false)
    //Copy UserSetting File
    fse.copySync(`./userSettings.json`, `${OutputPath}/userSettings.json`)  
    //Copy Entry File
    fse.copySync(`./entry.tp`, `${OutputPath}/entry.tp`) 
    //Copy Prestart File
    fse.copySync(`./Build/TMP_batch/prestart.exe`, `${OutputPath}/prestart.exe`) 
    //Copy Start File
    fse.copySync(`./Build/TMP_batch/start.exe`, `${OutputPath}/start.exe`) 
    //Copy Folder
    fse.copySync('./Build/TMP', './Build/ETS2_Dashboard')
    fse.moveSync('./Build/ETS2_Dashboard', './Build/TMP/ETS2_Dashboard')
    fs.rmdirSync('./Build/ETS2_Dashboard', { recursive: true })

	var zip = new AdmZip();

	zip.addLocalFolder(`${OutputPath}/ETS2_Dashboard`, 'ETS2_Dashboard');

	zip.writeZip("./Build/Releases/Plugin/ETS2_Dashboard.zip");
    fse.renameSync('./Build/Releases/Plugin/ETS2_Dashboard.zip', './Build/Releases/Plugin/ETS2_Dashboard_AutoUpdater.tpp', { overwrite: true })

    fs.rmdirSync('./Build/TMP', { recursive: true })
    fs.mkdirSync('./Build/TMP')
    
    //Copy Server Folder
    fse.moveSync(`./index.exe`, `${OutputPath}/index.exe`)
    //Copy Prestart File
    fse.copySync(`./Build/TMP_batch/prestart.exe`, `${OutputPath}/prestart.exe`) 
    //Copy Start File
    fse.copySync(`./Build/TMP_batch/start.exe`, `${OutputPath}/start.exe`) 
    //Copy Config File
    fse.copySync(`./config.json`, `${OutputPath}/config.json`) 
    replaceJSON(`${OutputPath}/config.json`, `version`, '0.0.0')
    replaceJSON(`${OutputPath}/config.json`, `userid`, '')
    replaceJSON(`${OutputPath}/config.json`, `discordMessage`, false)
    //Copy Entry File
    fse.copySync(`./entry.tp`, `${OutputPath}/entry.tp`) 
    //Copy Folder
    fse.copySync('./Build/TMP', './Build/ETS2_Dashboard')
    fse.moveSync('./Build/ETS2_Dashboard', './Build/TMP/ETS2_Dashboard')
    fs.rmdirSync('./Build/ETS2_Dashboard', { recursive: true })

    var zip = new AdmZip();
	zip.addLocalFolder(`${OutputPath}/ETS2_Dashboard`, 'ETS2_Dashboard');

	zip.writeZip("./Build/Releases/Plugin/ETS2_Dashboard.zip");
    fse.renameSync('./Build/Releases/Plugin/ETS2_Dashboard.zip', './Build/Releases/Plugin/ETS2_Dashboard.tpp', { overwrite: true })

    fs.rmdirSync('./Build/TMP', { recursive: true })
    fs.mkdirSync('./Build/TMP')
    
    const testMode = process.argv.includes("--test");

    if(testMode) {
        setTimeout(() => {
            
            fs.rmdirSync(`C:/Users/nicoe/AppData/Roaming/TouchPortal/plugins/ETS2_Dashboard`, { recursive: true })
            fse.copyFileSync(`./Build/Releases/Plugin/ETS2_Dashboard.tpp`, `C:/Users/nicoe/AppData/Roaming/TouchPortal/plugins/ETS2_Dashboard/ETS2_Dashboard.tpp`)
            fse.renameSync('C:/Users/nicoe/AppData/Roaming/TouchPortal/plugins/ETS2_Dashboard/ETS2_Dashboard.tpp', 'C:/Users/nicoe/AppData/Roaming/TouchPortal/plugins/ETS2_Dashboard/ETS2_Dashboard.zip', { overwrite: true })
            
            var zip = new AdmZip("C:/Users/nicoe/AppData/Roaming/TouchPortal/plugins/ETS2_Dashboard/ETS2_Dashboard.zip");
            zip.extractAllTo('C:/Users/nicoe/AppData/Roaming/TouchPortal/plugins/', true)
            fs.rmdirSync('C:/Users/nicoe/AppData/Roaming/TouchPortal/plugins/ETS2_Dashboard/ETS2_Dashboard.zip') 
        }, 2000);
    }
        
}
pack()
