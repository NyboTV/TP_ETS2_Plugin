const fs = require('fs')
const fse = require('fs-extra')
const replaceJSON = require('replace-json-property')
const AdmZip = require('adm-zip')

const Release = process.argv.includes("--release");
const testMode = process.argv.includes("--test");

let InputPath = "./src"
let OutputPath = "./src/build/tmp"
let InstallPath = "C:/Users/nicoe/AppData/Roaming/TouchPortal/plugins"

if(fs.existsSync(`./src/build/ETS2_Dashboard`)) {
    fs.rmSync(`./src/build/ETS2_Dashboard`, { recursive: true })
}


const tmp = async () => {

    if(fs.existsSync(`${OutputPath}`)) {
        fs.rmSync(`${OutputPath}`, { recursive: true, force: true })
        console.log("TMP Folder Removed")
    }

    if(fs.existsSync(`${OutputPath}`) === false) {
        fs.mkdirSync(`${OutputPath}`)
        console.log("TMP Folder Created")
    }

    if(fs.existsSync(`${InputPath}/build/ETS2_Dashboard`)) {
        fs.rmSync(`${InputPath}/build/ETS2_Dashboard`, { recursive: true })
        console.log("ETS Folder removed")
    }
}

const pack = async () => {

    //ReCreate TMP Folder
    await tmp()

    return

    //Copy Main File
    fse.moveSync(`./plugin-win.exe`, `${OutputPath}/ets2_plugin.exe`)
    
    // Delete Other OS until Supported:
    fs.rmSync('./plugin-linux')
    fs.rmSync('./plugin-macos')
    //

    //Copy Index File
    //fse.copySync(`./index.exe`, `${OutputPath}/index.exe`)
    //Copy Server Folder
    fse.copySync(`${InputPath}/bin/server`, `${OutputPath}/server`)
    //Copy IMG Folder
    fse.copySync(`${InputPath}/bin/images`, `${OutputPath}/images`) 
    //Create Config Folder
    fse.mkdirSync(`${OutputPath}/config`) 
    //Copy Config File
    fse.copySync(`${InputPath}/build/bin/cfg.json`, `${OutputPath}/cfg.json`) 
    //Copy UserSetting File
    fse.copySync(`${InputPath}/build/bin/usercfg.json`, `${OutputPath}/usercfg.json`)  
    //Copy Entry File
    fse.copySync(`${InputPath}/build/bin/entry.tp`, `${OutputPath}/entry.tp`) 
    //Copy Folder
    fse.copySync(`${OutputPath}`, `./src/build/ETS2_Dashboard`)
    fse.moveSync(`./src/build/ETS2_Dashboard`, `${OutputPath}/ETS2_Dashboard`)

	var zip = new AdmZip();

	zip.addLocalFolder(`${OutputPath}/ETS2_Dashboard`, 'ETS2_Dashboard');

	zip.writeZip("./Installers/Win/ETS2_Dashboard.zip");
    fse.renameSync('./Installers/Win/ETS2_Dashboard.zip', './Installers/Win/ETS2_Dashboard.tpp', { overwrite: true })

    if(testMode) {
        setTimeout(() => {
            
            if(fs.existsSync(`${InstallPath}`)) {
                fs.rmdirSync(`${InstallPath}/ETS2_Dashboard`, { recursive: true })
            }

            fse.copyFileSync(`./Installers/Win/ETS2_Dashboard.tpp`, `${InstallPath}/ETS2_Dashboard.tpp`)
            fse.renameSync(`${InstallPath}/ETS2_Dashboard.tpp`, `${InstallPath}/ETS2_Dashboard.zip`, { overwrite: true })
            
            var zip = new AdmZip(`${InstallPath}/ETS2_Dashboard.zip`);
            zip.extractAllTo(`${InstallPath}`, true)
            fs.rmdirSync(`${InstallPath}/ETS2_Dashboard.zip`) 
        }, 2000);
    } else if(Release) {
        fs.copyFileSync('./Installers/Win/ETS2_Dashboard.tpp', 'P:/Dieser PC/Desktop/ETS2_Dashboard.tpp')
    }
        
}
pack()
