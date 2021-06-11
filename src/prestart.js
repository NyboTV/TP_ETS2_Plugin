const fs = require('fs')
const fse = require('fs-extra')
const pluginId = 'TP_ETS2_Plugin';
const downloadRelease = require('download-github-release');
const exec = require('child_process').execFile;
const AdmZip = require("adm-zip");
const replace = require('replace-in-file');

var user = 'NyboTV'
var repo = 'TP_ETS2_Plugin'
var outputdir = './tmp'
var leaveZipped = false

let firstStart = 1
let Version = ""
let config = ""


if(!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs')
    fs.mkdirSync('./logs/updater')
    fs.mkdirSync('./logs/index')
}


config = fs.readFileSync('./config')
config = JSON.parse(config)

if(config.updateLatest === "update") {
    logIt("INFO", "New Version Found! Updating...")

    downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped)
    .then(function() {
        logIt("INFO", "Update is Downloaded! Installing now...")
        Update()
    }).catch(function(err) {
        console.error(err.message);
    });
} else {
    Start()
}
function filterRelease(release) {
    return release.prerelease === false;
}
    
function filterAsset(asset) {
    return asset.name.indexOf('ETS2_Dashboard') >= 0;
}

function Update() {
    var zip = new AdmZip("./tmp/ETS2_Dashboard.zip");
    logIt("INFO", "Update is installing...")
    
    fse.renameSync('./tmp/ETS2_Dashboard.tpp', './tmp/ETS2_Dashboard.zip', { overwrite: true })
    
    
    zip.extractAllTo('./tmp/', true)
    fs.unlinkSync('./tmp/ETS2_Dashboard.zip')
    
    fse.moveSync('./tmp/ETS2_Dashboard/server', '../../server', { overwrite: true })
    fse.moveSync('./tmp/ETS2_Dashboard/images', '../../images', { overwrite: true })
    fse.moveSync('./tmp/ETS2_Dashboard/entry.tp', '../../entry.tp', { overwrite: true })
    fse.moveSync('./tmp/ETS2_Dashboard/ets2_plugin.exe', '../../ets2_plugin.exe', { overwrite: true })
    fse.moveSync('./tmp/ETS2_Dashboard/updater.exe', '../../updater.exe', { overwrite: true })

    fs.unlinkSync('./tmp/ETS2_Dashboard/prestart.exe')
    fs.rmdirSync('./tmp/ETS2_Dashboard')
    
    logIt("INFO", "Update is Installed!")
    
    var data = fs.readFileSync('./config.json')
    data = JSON.parse(data)
    
    const options = {
        files: './config.json',
        from: `${data.version}`,
        to: `${Version}`,
    };

    const options2 = {
        files: './config.json',
        from: `${data.updateLatest}`,
        to: `uptodate`,
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
    exec('updater.exe', function(err, data) {  
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