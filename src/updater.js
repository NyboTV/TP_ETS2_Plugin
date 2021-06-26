const fs = require('fs')
const fse = require('fs-extra')
const pluginId = 'TP_ETS2_Plugin';
const downloadRelease = require('download-github-release');
const AdmZip = require("adm-zip");
const replace = require('replace-in-file');
const https = require('https');

var github = fs.readFileSync('./config.json')
github = JSON.parse(github)

var user = `${github.github_Username}`
var repo = `${github.github_Repo}`
var outputdir = './tmp'
var leaveZipped = false

let firstStart = 1
let Version = ""

config = github

if(!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs')
    fs.mkdirSync('./logs/updater')
    fs.mkdirSync('./logs/index')
}

if(!fs.existsSync('./tmp')) {
    fs.mkdirSync('./tmp')
}

logIt("INFO", "Searching new Version")

const options = {
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/NyboTV/TP_ETS2_Plugin/releases/latest',
    method: 'GET',
    headers: {'user-agent': 'node.js'}
}

fs.writeFileSync('./tmp/updater.json', " ")
https.get(options, (res) => {
    
    res.on('data', (d) => {
        fs.appendFileSync('./tmp/updater.json', d)
    });
    
}).on('error', (e) => {
    console.error(e);
})

setTimeout(() => {
    Version = fs.readFileSync("./tmp/updater.json", 'utf-8')
    Version = JSON.parse(Version).tag_name
    fs.unlinkSync('./tmp/updater.json')
    
    logIt("INFO", `Online Version: ${Version} | Local Version: ${config.version}`)
    
    if(config.version === "0.0.0") {
        Download()
    } else {
        if (config.version === Version) {
            logIt("INFO", "Up to Date!")
            End()
        } else {
            if(config.autoupdate === "true") {
                Download()   
            } else {
                logIt("INFO", "Skipping Autoupdate Function because set to 'false'!")
                End()
            }
        }
    }
}, 1500);

function Download() {
    logIt("INFO", "New Version Found! Updating...")
    
    downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped)
    .then(function() {
        logIt("INFO", "Update is Downloaded! Installing now...")
        Update()
    }).catch(function(err) {
        logIt("ERROR", `Update Failed! Reason: ${err.message}`)
        End()
    });
    
    function filterRelease(release) {
        return release.prerelease === false;
    }
    
    function filterAsset(asset) {
        return asset.name.indexOf(`${github.github_FileName}`) >= 0;
    }
}
    

function Update() {
    logIt("INFO", "Update is installing...")
    
    fse.renameSync('./tmp/ETS2_Dashboard_AutoUpdater.tpp', './tmp/ETS2_Dashboard.zip', { overwrite: true })
    
    var zip = new AdmZip("./tmp/ETS2_Dashboard.zip");
    var tmp_path = "./tmp/ETS2_Dashboard"
    var server_folder = `server`
    var images_folder = `images`
    var entry_file = `entry.tp`
    var main_exe = `index.exe`
    var config_file = `config.json`
    
    zip.extractAllTo('./tmp/', true)
    fs.unlinkSync('./tmp/ETS2_Dashboard.zip')    

    console.log(fs.existsSync(`${tmp_path}/${server_folder}`))

    if(fs.existsSync(`./tmp/ETS2_Dashboard/${server_folder}`))  { fse.move(`${tmp_path}/${server_folder}`, `./${server_folder}`,   { overwrite: true },    err => { if(err) return console.log(err) }) }
    if(fs.existsSync(`./tmp/ETS2_Dashboard/${server_folder}`))  { fse.move(`${tmp_path}/${images_folder}`, `./${images_folder}`,   { overwrite: true },    err => { if(err) return console.log(err) }) }
    if(fs.existsSync(`./tmp/ETS2_Dashboard/${server_folder}`))  { fse.move(`${tmp_path}/${entry_file}`,    `./${entry_file}`,      { overwrite: true },    err => { if(err) return console.log(err) }) }
    if(fs.existsSync(`./tmp/ETS2_Dashboard/${server_folder}`))  { fse.move(`${tmp_path}/${main_exe}`,      `./${main_exe}`,        { overwrite: true },    err => { if(err) return console.log(err) }) }
    if(fs.existsSync(`./tmp/ETS2_Dashboard/${server_folder}`))  { fse.move(`${tmp_path}/${config_file}`,   `./${config_file}`,     { overwrite: true },    err => { if(err) return console.log(err) }) }
    
    logIt("INFO", "Update is Installed!")
    
    const options = {
        files: './config.json',
        from: `${config.version}`,
        to: `${Version}`,
    };
    
    try {
        //var version = replace.sync(options);

        if(version[0].hasChanged === true) {
            logIt("INFO", "Version has been Updated!")
        }
    }
    catch (error) {
        logIt("ERROR", error)
    }   
    logIt("INFO", "Starting Main Script...")
    End()
}    
    
function End() {
    process.exit()
}

function logIt() {
        
    if(firstStart === 1) {
        fs.writeFileSync('./logs/updater/latest.log', `\n --------SCRIPT STARTED--------`)
        firstStart = 0
    }
    
    var curTime = new Date().toISOString();
    var message = [...arguments];
    var type = message.shift();
    console.log(curTime,":",pluginId,":"+type+":",message.join(" "));
    fs.appendFileSync('./logs/updater/latest.log', `\n${curTime}:${pluginId}:${type}:${message.join(" ")}`)
}