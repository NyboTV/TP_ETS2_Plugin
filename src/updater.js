const fs = require('fs')
const fse = require('fs-extra')
const pluginId = 'TP_ETS2_Plugin';
const downloadRelease = require('download-github-release');
const exec = require('child_process').execFile;
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
    
    logIt("INFO", `Online Version: ${Version} | Lokale Version: ${config.version}`)
    
    if(config.version === "0.0.0") {
        Download()
    } else {
        if (config.version === Version) {
            logIt("INFO", "Up to Date!")
            Start()
        } else {
            if(config.autoupdate === "true") {
                Download()   
            } else {
                logIt("INFO", "Skipping Autoupdate Function because set to 'false'!")
                Start()
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
        Start()
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
    var server_folder = "server"
    var images_folder = "images"
    var entry_file = "entry.tp"
    var main_exe = "ets2_plugin.exe"
    var updater_exe = "updater.exe"
    
    zip.extractAllTo('./tmp/', true)
    fs.unlinkSync('./tmp/ETS2_Dashboard.zip')
    


    if(fs.existsSync(`./tmp/ETS2_Dashboard/${server_folder}`))  { fse.moveSync(`./tmp/ETS2_Dashboard/${server_folder}`, `../../${server_folder}`, { overwrite: true }) }
    if(fs.existsSync(`./tmp/ETS2_Dashboard/${images_folder}`))  { fse.moveSync(`./tmp/ETS2_Dashboard/${images_folder}`, `../../${images_folder}`, { overwrite: true }) }
    if(fs.existsSync(`./tmp/ETS2_Dashboard/${entry_file}`))     { fse.moveSync(`./tmp/ETS2_Dashboard/${entry_file}`, `../../${entry_file}`, { overwrite: true }) }
    if(fs.existsSync(`./tmp/ETS2_Dashboard/${main_exe}`))       { fse.moveSync(`./tmp/ETS2_Dashboard/${main_exe}`, `../../${main_exe}`, { overwrite: true }) }

    if(fs.existsSync(`./tmp/ETS2_Dashboard/${updater_exe}`)) { fs.unlinkSync(`./tmp/ETS2_Dashboard/${updater_exe}`) }
    fs.rmdirSync('./tmp/ETS2_Dashboard')
    
    logIt("INFO", "Update is Installed!")
    
    const options = {
        files: './config.json',
        from: `${config.version}`,
        to: `${Version}`,
    };

    const options2 = {
        files: './config.json',
        from: `${config.updateLatest}`,
        to: `no`,
    };
    
    try {
        var version = replace.sync(options);
        var updateLatest = replace.sync(options2);

        if(version[0].hasChanged === true) {
            logIt("INFO", "Version has been Updated!")
        } 
        if(updateLatest[0].hasChanged === true) {
            logIt("INFO", "Update Latest has been changed!")
        }
    }
    catch (error) {
        logIt("ERROR", error)
    }   
    logIt("INFO", "Starting Updater Script...")
    Start()
}    
    
function Start() {
    exec('ets2_plugin.exe', function(err, data) {  
        logIt("ERROR", err)
        console.log(data.toString());                       
    }); 
    return;
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