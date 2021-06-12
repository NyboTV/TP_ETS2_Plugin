const fs = require('fs')
const fse = require('fs-extra')
const pluginId = 'TP_ETS2_Plugin';
const https = require('https')
const downloadRelease = require('download-github-release');
const exec = require('child_process').execFile;
const AdmZip = require("adm-zip");
const replace = require('replace-in-file');

let firstStart = 1
let Version = ""
let config = ""

config = fs.readFileSync('./config.json')
config = JSON.parse(config)
    

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
    
    fs.writeFileSync('./tmp/update.json', `{ \n"newVersion": "${Version}" \n}`)
    
    console.log("Online Version: " + Version + " | Lokale Version: " +  config.version)
    
    if (config.version === Version) {
        logIt("INFO", "Up to Date!")
        Start()
    } else {
        logIt("INFO", "New Version Found! Plugin gets Updated after restart!")
        var data = fs.readFileSync('./config.json')
        data = JSON.parse(data)
        
        const options = {
            files: './config.json',
            from: `${data.updateLatest}`,
            to: `yes`,
        };
        
        try {
            var updateLatest = replace.sync(options);
            
            if(updateLatest[0].hasChanged === true) {
                logIt("INFO", "Update Latest has been changed!")
            }
            Start()
        }
        catch (error) {
            logIt("ERROR", error)
        }   
        
    }
    
}, 1500);


function Start() {
    exec('ets2_plugin.exe', function(err, data) {  
        logIt("ERROR", err)
        console.log(data.toString());                       
    }); 
    return;
}


function logIt() {
    if(!fs.existsSync('./logs')) {
        fs.mkdirSync('./logs')
    }
    if(!fs.existsSync('./logs/updater')) {
        fs.mkdirSync('./logs/updater')
    }

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

    