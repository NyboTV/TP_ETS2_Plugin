const fs = require('fs')
const fse = require('fs-extra')
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
        fse.remove(`${OutputPath}`, err => { 
            if(err) return console.error(err)
            console.log("TMP Folder Removed")
        })
    }

    if(fs.existsSync(`${OutputPath}`) === false) {
        fs.mkdirSync(`${OutputPath}`)
        console.log("TMP Folder Created")
    }

    if(fs.existsSync(`${InputPath}/build/ETS2_Dashboard`)) {
        fse.removeSync(`${InputPath}/build/ETS2_Dashboard`, { recursive: true })
        console.log("ETS Folder removed")
    }
}

const pack = async () => {

    //ReCreate TMP Folder
    await tmp()

    //Copy Main File
    fse.moveSync(`./plugin-win.exe`, `${OutputPath}/ets2_plugin.exe`)
    
    //Copy Index File
    //fse.copySync(`./index.exe`, `${OutputPath}/index.exe`)
    //Copy Server Folder
    fse.copySync(`${InputPath}/bin/server`, `${OutputPath}/server`)
    //Copy IMG Folder
    fse.copySync(`${InputPath}/bin/images`, `${OutputPath}/images`) 
    //Copy Interface Folder
    fse.copySync(`${InputPath}/bin/interface`, `${OutputPath}/interface`) 
    //Copy Config Folder
    fse.copySync(`${InputPath}/build/bin/config`, `${OutputPath}/config`) 
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

            fse.copyFileSync(`./Installers/Win/ETS2_Dashboard.tpp`, `${InstallPath}/ETS2_Dashboard.tpp`)
            fse.renameSync(`${InstallPath}/ETS2_Dashboard.tpp`, `${InstallPath}/ETS2_Dashboard.zip`, { overwrite: true })
            
            var zip = new AdmZip(`${InstallPath}/ETS2_Dashboard.zip`);
            zip.extractAllTo(`${InstallPath}`, true)
            fse.removeSync(`${InstallPath}/ETS2_Dashboard.zip`) 
        }, 2000);
    } else if(Release) {
        fs.copyFileSync('./Installers/Win/ETS2_Dashboard.tpp', 'P:/Dieser PC/Desktop/ETS2_Dashboard.tpp')
    }

    
    await tmp()
        
}
pack()
