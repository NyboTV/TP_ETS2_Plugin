const fs = require('fs')
const fse = require('fs-extra')
const AdmZip = require('adm-zip')
const replaceJSON = require(`replace-json-property`).replace
const path = require('path')
const homeDir = require('os').homedir()
const sJSON = require('self-reload-json')
const { exit } = require('process');

const Release = process.argv.includes("--release");
const testMode = process.argv.includes("--test");

let InputPath = "./src"
let OutputPath = "./src/build/tmp"
let InstallPath = "C:/Users/nicoe/AppData/Roaming/TouchPortal/plugins"
let desktopPath = `${homeDir}/Desktop`
let curTime = new Date().toISOString().
replace(/T/, ` `).
replace(/\..+/, ``)

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


    let Files  = [];
    let Folder = [];
    let FilesArray = []
    let FilesArray2 = []

    function ThroughDirectory(Directory) {
        return new Promise(async (resolve, reject) => {
            fs.readdirSync(Directory).forEach(File => {
                const Absolute = path.join(Directory, File);
                if (fs.statSync(Absolute).isDirectory()) { ThroughDirectory(Absolute); Folder.push(Absolute) }
                else return Files.push(Absolute);
            })
            resolve()
        })
    }
    
    async function CheckArray() {
        FilesArray = Folder.concat(Files)
        return new Promise(async (resolve) => {
            for (var i = 0; i < FilesArray.length; true, i++) {
                element = FilesArray[i]
                element = element.replace(`src\\build\\tmp\\ETS2_Dashboard\\`, '')
                element = element.split('\\')
                element = element.join(`/`)
                FilesArray2.push(element)
                if(FilesArray.length-1 === i) {
                    resolve()
                }
            }
        })
    }

    async function writeToFile() {
        return new Promise(async (resolve) => {
            fs.writeFile(`${OutputPath}/config/files.json`, JSON.stringify(FilesArray2), (err) => {
                if (err)
                    console.log(err);
                else {
                    resolve()
                }
            });
        })
    }

    await ThroughDirectory(OutputPath);
    await CheckArray()
    await writeToFile()

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

    console.log("FINISHED AT " + curTime)
    await tmp()
    exit()
        
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
        latestVersion = latestVersion.split(".")

        latestVersion[0] = Number(latestVersion[0])
        latestVersion[1] = Number(latestVersion[1])
        latestVersion[2] = Number(latestVersion[2])

        if(latestVersion[2] >= 9) {
            if(latestVersion[1] >= 9) {
                latestVersion[0] = Math.floor(latestVersion[0]+1)
                latestVersion[1] = 0
                latestVersion[2] = 0
            } else {
                latestVersion[1] = Math.floor(latestVersion[1]+1)
                latestVersion[2] = 0                
            }
        } else {
            latestVersion[2] = Math.floor(latestVersion[2]+1)
        }

        latestVersion[0] = `${latestVersion[0]}`
        latestVersion[1] = `${latestVersion[1]}`
        latestVersion[2] = `${latestVersion[2]}`

        latestVersion = latestVersion.join(".")

        console.log("Latest App Version: " + latestVersion)
        
        replaceJSON('./src/bin/config/cfg.json', 'version', latestVersion)
        replaceJSON('./src/build/bin/config/cfg.json', 'version', latestVersion)
        replaceJSON('./package.json', 'version', latestVersion)

        resolve()
    })
}
    

