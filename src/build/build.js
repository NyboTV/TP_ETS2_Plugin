const fs = require('fs')
const fse = require('fs-extra')
const AdmZip = require('adm-zip')
const replaceJSON = require(`replace-json-property`).replace
const path = require('path')
const homeDir = "D:/Dieser PC/Desktop/ETS2_Dashboard.tpp"
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

    console.log("Deleting TMP")
    await tmp()

    console.log("Changing Version")
    await version()

    //Copy Main File
    fse.moveSync(`./ETS2_Dashboard-win32-x64`, `${OutputPath}/ETS2_Dashboard`)
    
    OutputPath = `${OutputPath}/ETS2_Dashboard`
    //Copy Server Folder
    fse.copySync(`${InputPath}/bin/server`, `${OutputPath}/server`)
    //Copy IMG Folder
    fse.copySync(`${InputPath}/bin/images`, `${OutputPath}/images`) 
    //Copy Config Folder
    fse.copySync(`${InputPath}/bin/config`, `${OutputPath}/config`) 
    //Copy Entry File
    fse.copySync(`${InputPath}/bin/entry.tp`, `${OutputPath}/entry.tp`) 


    let Files  = [];
    let Folder = [];
    let FilesArray = []
    let FilesArray2 = []

    function ThroughDirectory(Directory) {
        return new Promise(async (resolve, reject) => {
            fs.readdirSync(Directory).forEach(File => {
                const Absolute = path.join(Directory, File);
                if (fs.statSync(Absolute).isDirectory()) { 
                    fs.readdir(Absolute, function(err, files) {
                        if (err) {
                           // some sort of error
                        } else {
                           if (!files.length) {
                           } else {
                                ThroughDirectory(Absolute); 
                                Folder.push(Absolute) 
                           }
                        }
                    });
                }
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

    console.log("Checking Dir...")
    await ThroughDirectory(OutputPath);
    console.log("Sorting Array...")
    await CheckArray()
    console.log("Writing to File...")
    await writeToFile()

    
    console.log("Setting up Config File...")
    replaceJSON('./src/build/tmp/ETS2_Dashboard/config/cfg.json', 'firstInstall', true)
    replaceJSON('./src/build/tmp/ETS2_Dashboard/config/cfg.json', 'refreshInterval', 500)
    replaceJSON('./src/build/tmp/ETS2_Dashboard/config/cfg.json', 'debug', false)
    replaceJSON('./src/build/tmp/ETS2_Dashboard/config/cfg.json', 'UpdateCheck', true)
    replaceJSON('./src/build/tmp/ETS2_Dashboard/config/cfg.json', 'OfflineMode', false)

    
    console.log("Zipping Dir...")
	var zip = new AdmZip();
	zip.addLocalFolder(`${OutputPath}`, 'ETS2_Dashboard');

	zip.writeZip(`${OutputPath}/ETS2_Dashboard.zip`);
    console.log("Dir Zipped")
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

    console.log("Deleting TMP...")
    await tmp()

    console.log("FINISHED AT " + curTime)
    exit()
        
}
pack()


async function tmp () {
    return new Promise(async (resolve, reject) => {
        if(fs.existsSync(`${OutputPath}`)) {
            fse.removeSync(`${OutputPath}`, { recursive: true })
            console.log("TMP Folder Removed")
            resolve()
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
        replaceJSON('./package.json', 'version', latestVersion)

        resolve()
    })
}
    

