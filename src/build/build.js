const fs = require('fs')
const fse = require('fs-extra')
const AdmZip = require('adm-zip')
const replaceJSON = require(`replace-json-property`).replace
const prompt = require('prompt')
const homeDir = require('os').homedir()
const sJSON = require('self-reload-json')

const Release = process.argv.includes("--release");
const testMode = process.argv.includes("--test");

let InputPath = "./src"
let OutputPath = "./src/build/tmp"
let InstallPath = "C:/Users/nicoe/AppData/Roaming/TouchPortal/plugins"
let desktopPath = `${homeDir}/Desktop`

let latestVersion = new sJSON(`./src/bin/config/cfg.json`).version

if(fs.existsSync(`./src/build/ETS2_Dashboard`)) {
    fs.rmSync(`./src/build/ETS2_Dashboard`, { recursive: true })
}

const pack = async () => {

    await tmp()
    await version()

    //Copy Main File
    fse.moveSync(`./ETS2_Dashboard-win32-x64`, `${OutputPath}/ETS2_Dashboard`)
    
    OutputPath = `${OutputPath}/ETS2_Dashboard`
    //Copy Server Folder
    fse.copySync(`${InputPath}/bin/server`, `${OutputPath}/server`)
    //Copy IMG Folder
    fse.copySync(`${InputPath}/bin/images`, `${OutputPath}/images`) 
    //Copy Config Folder
    fse.copySync(`${InputPath}/build/bin/config`, `${OutputPath}/config`) 
    //Copy Entry File
    fse.copySync(`${InputPath}/build/bin/entry.tp`, `${OutputPath}/entry.tp`) 

	var zip = new AdmZip();

	zip.addLocalFolder(`${OutputPath}`, 'ETS2_Dashboard');

	zip.writeZip(`${OutputPath}/ETS2_Dashboard.zip`);
    fse.renameSync(`${OutputPath}/ETS2_Dashboard.zip`, `${OutputPath}/ETS2_Dashboard.tpp`, { overwrite: true })

    if(testMode) {
        setTimeout(() => {

            fse.copyFileSync(`${OutputPath}/ETS2_Dashboard.tpp`, `${InstallPath}/ETS2_Dashboard.tpp`)
            fse.renameSync(`${InstallPath}/ETS2_Dashboard.tpp`, `${InstallPath}/ETS2_Dashboard.zip`, { overwrite: true })
            
            var zip = new AdmZip(`${InstallPath}/ETS2_Dashboard.zip`);
            zip.extractAllTo(`${InstallPath}`, true)
            fse.removeSync(`${InstallPath}/ETS2_Dashboard.zip`) 
        }, 2000);
    } else if(Release) {
        fs.copyFileSync(`${OutputPath}/ETS2_Dashboard.tpp`, `${desktopPath}/ETS2_Dashboard.tpp`)
    }

    console.log("FINISHED")
    await tmp()
        
}
pack()


async function tmp () {
    return new Promise(async (resolve, reject) => {
        if(fs.existsSync(`${OutputPath}`)) {
            fse.remove(`${OutputPath}`, err => { 
                if(err) return console.error(err)
                console.log("TMP Folder Removed")
                resolve()
            })
        }
        
        if(fs.existsSync(`${OutputPath}`) === false) {
            fs.mkdirSync(`${OutputPath}`)
            console.log("TMP Folder Created")
            resolve()
        }
        
        if(fs.existsSync(`${InputPath}/build/ETS2_Dashboard`)) {
            fse.removeSync(`${InputPath}/build/ETS2_Dashboard`, { recursive: true })
            console.log("ETS Folder removed")
            resolve()
        }

    })
}

async function version() {
    return new Promise(async (resolve, reject) => {
        prompt.start()

        console.log("Latest App Version: " + latestVersion)
        prompt.get([version], function (err, result) {
            if(err) return console.log(err)
        
            replaceJSON('./src/bin/config/cfg.json', 'version', result.version)
            replaceJSON('./src/build/bin/config/cfg.json', 'version', result.version)
            replaceJSON('./package.json', 'version', result.version)

            resolve()
        })
    })
    
}

