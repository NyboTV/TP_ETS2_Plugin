const fs = require('fs')
const fse = require('fs-extra')
const pluginId = 'TP_ETS2_Plugin';
const https = require('https')
const downloadRelease = require('download-github-release');
const exec = require('child_process').execFile;
const AdmZip = require("adm-zip");

var user = 'NyboTV'
var repo = 'TP_ETS2_Plugin'
var outputdir = './tmp'
var leaveZipped = false

let firstStart = 1
let Version = ""
let config = ""

if(fs.existsSync('update.bat')) {
    fs.rmSync('update.bat')
}

logIt("INFO", "Searching new Version")

const options = {
    hostname: 'api.github.com',
    port: 443,
    path: '/repos/NyboTV/TP_ETS2_Plugin/releases/latest',
    method: 'GET',
    headers: {'user-agent': 'node.js'}
}

fs.writeFileSync('./updater.json', " ")
https.get(options, (res) => {

  res.on('data', (d) => {
      fs.appendFileSync('./updater.json', d)
  });

}).on('error', (e) => {
  console.error(e);
})

setTimeout(() => {
    Version = fs.readFileSync("./updater.json", 'utf-8')
    Version = JSON.parse(Version).tag_name
    fs.unlinkSync('./updater.json')
    
    
    if(fs.existsSync('./config.json')) {
        config = fs.readFileSync('./config.json')
        config = JSON.parse(config)
    } else {
        fs.writeFileSync('./config.json', '{ \n "version": "1.0.0" \n}')
        config = fs.readFileSync('./config.json')
        config = JSON.parse(config)
    }
    if(fs.existsSync('./tmp')) {
        fs.rmdirSync('./tmp', { recursive: true })
        fs.mkdirSync('./tmp')
    } else {
        fs.mkdirSync('./tmp')
    }
    console.log("Online Version: " + Version + " | Lokale Version: " +  config.version)
    
    if (config.version === Version) {
        logIt("INFO", "Up to Date!")
        Start()
    } else {
        logIt("INFO", "New Version Found! Updating...")
        
        downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped)
        .then(function() {
            logIt("INFO", "Update is Downloaded! Installing now...")
            Update()
        }).catch(function(err) {
            console.error(err.message);
        });
                
    }
    
    function filterRelease(release) {
        return release.prerelease === false;
    }
    
    function filterAsset(asset) {
        return asset.name.indexOf('ETS2_Dashboard') >= 0;
    }

    function Update() {
        logIt("INFO", "Update is installing...")

        fse.renameSync('./tmp/ETS2_Dashboard.tpp', './tmp/ETS2_Dashboard.zip', { overwrite: true })

        var zip = new AdmZip("./tmp/ETS2_Dashboard.zip");
        zip.extractAllTo('./tmp/', true)
        fs.unlinkSync('./tmp/ETS2_Dashboard.zip')

        fse.moveSync('./tmp/ETS2_Dashboard/server', '../../server', { overwrite: true })
        fse.moveSync('./tmp/ETS2_Dashboard/images', '../../images', { overwrite: true })
        fse.moveSync('./tmp/ETS2_Dashboard/entry.tp', '../../entry.tp', { overwrite: true })
        fse.moveSync('./tmp/ETS2_Dashboard/ets2_plugin.exe', '../../ets2_plugin.exe', { overwrite: true })
        
        logIt("INFO", "Update is Installed!")
        logIt("INFO", "Starting Plugin...")

        fs.writeFileSync('update.bat', `@Echo Off \ntitle ETS2 Dashboard Updater \necho Restarting TouchPortal \ntasklist /fi "ImageName eq javaw.exe" /fo csv 2>NUL | find /I "javaw.exe">NUL \nif "%ERRORLEVEL%"=="0" taskkill /F /IM javaw.exe \nping -n 5 localhost >nul \nstart "" "C:/ProgramData/Microsoft/Windows/Start Menu/Programs/Touch Portal/Touch Portal.lnk"`)
        require('child_process').exec('cmd /c update.bat', function(){
         });
        
        fs.writeFileSync('./config.json', `{\n "version": "${Version}"\n}`)
    }

    function Start() {
        exec('ets2_plugin.exe', function(err, data) {  
            console.log(err)
            console.log(data.toString());                       
        }); 
    }


}, 1500);



function logIt() {
    if(firstStart === 1) {
        fs.writeFileSync('./log.log', `\n --------SCRIPT STARTED--------`)
        firstStart = 0
    }
    var curTime = new Date().toISOString();
    var message = [...arguments];
    var type = message.shift();
    console.log(curTime,":",pluginId,":"+type+":",message.join(" "));
    fs.appendFileSync('./log.log', `\n${curTime}:${pluginId}:${type}:${message.join(" ")}`)
}

    