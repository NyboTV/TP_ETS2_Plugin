const fs = require('fs')
const fse = require('fs-extra')
const pluginId = 'TP_ETS2_Plugin';
const downloadRelease = require('download-github-release');
const AdmZip = require("adm-zip");
const replace = require('replace-in-file');
const http = require('http')
const https = require('https');

var retry = 1
var userid = ""
var connected = false
var started = false

var config = JSON.parse(fs.readFileSync('./config.json'))
github = config

var user = `${github.github_Username}`
var repo = `${github.github_Repo}`


if(!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs')
    fs.mkdirSync('./logs/updater')
    fs.mkdirSync('./logs/index')
}

if(!fs.existsSync('./tmp')) {
    fs.mkdirSync('./tmp')
}

const APIHost = {
    //ip: '147.189.171.174',
    ip: 'localhost',
    port: 3000,
    method: 'POST'
}

const autoupdater = async () => {

    try {        
        const reinstall = async () => {
            await download()

            var config = fs.readFileSync('./config.json')
            config = JSON.parse(config)
            
            var config3 = config.github_Username
            var config4 = config.github_Repo
            var config5 = config.github_FileName
            var Version = "reinstall"
            
            fs.writeFileSync('./config.json', `{\n "version": "${Version}",\n\n "github_Username": "${config3}",\n "github_Repo": "${config4}",\n "github_FileName": "${config5}",\n\n "userid": "${userid}"\n}`)
            
            await downloaded()
            api()
        }
        
        const api = async (firstsetup, error) => {
            try {

                if(firstsetup === true) {
                    firstsetup = "yes"
                } else {
                    logIt("INFO", "No Upgrade available. Starting Main Script...")
                    start()
                }
                
                var config = fs.readFileSync('./config.json')
                config = JSON.parse(config)
                var localVersion = config.version
                
                github_Username = config.github_Username
                github_Repo = config.github_Repo

                const apioptions = {
                    hostname: APIHost.ip,
                    port: APIHost.port,
                    path: '/',
                    method: APIHost.method,
                    headers: {
                        'UserID': `${userid}`,
                        'localVersion': `${localVersion}`,
                        'firstsetup': `${firstsetup}`,
                        'github_Username': `${github_Username}`,
                        'github_Repo': `${github_Repo}`,
                        'error': `${error}`
                    }
                }

                const req = http.request(apioptions, res => {

                    res.on('data', d => {
                        var data = JSON.parse(d)
                        if (data.download === "yes") {
                            download()
                        } else if (data.reinstall === "yes") {
                            reinstall()
                        }
                        
                    })
                })

                req.on('error', error => {
                    //console.error(error)
                    autoupdater()
                })

                req.end()

            } catch (error) {
                
                logIt("ERROR", error)
                setTimeout(() => {
                    api()
                }, 2000);
            }
        }

        const setup = async () => {
    
            var version = JSON.parse(fs.readFileSync('./config.json')).version
            if(version === "0.0.0") {
                const apioptions = {
                    hostname: APIHost.ip,
                    port: APIHost.port,
                    path: '/setup',
                    method: APIHost.method,
                    headers: {
                        'UserID': userid
                    }
                }
    
        
                const req = http.request(apioptions, res => {
        
                    res.on('data', d => {
                        var data = JSON.parse(d)
                        if (data.setup === "yes") {
                            api(true)
                        } else if (data.setup === "no") {
                            api()
                        } else if (data.error === true) {
                            userID(true)
                            setup()
                        }
                    })
                })
        
                req.on('error', error => {
                    //console.error(error)
                    autoupdater()
                })
        
                req.end()
            } else if(firstStart === true) {
                api(true)
            } else {
                api()
            }
    
        }

        const connectionTest = async () => {

            const publicIP = require('public-ip')

            var LocalIP = await publicIP.v4()

            const apioptions = {
                hostname: APIHost.ip,
                port: APIHost.port,
                path: '/connectionTest',
                method: APIHost.method,
                headers: {
                    "UserID": `${LocalIP}`
                }
            }
    
            logIt("INFO", "Connecting to API...")
    
            const req = http.request(apioptions, res => {
                
    
                res.on('data', d => {
                    var data = JSON.parse(d)

                    const connected_api = async () => {
                        connected = true
                        logIt("INFO", "Connected to API.")

                        userid = JSON.parse(fs.readFileSync('./config.json')).userid 
                        
                        if(userid === "" || userid === undefined){
                            userID()
                            start_plugin()
                        } else {
                            start_plugin()

                        }
                        
                    
    

                    }
                    connected_api()
                })
            })
    
            req.on('error', error => {
                //console.error(error)
                
                if(retry === 5) {
                    logIt("WARN", `Could not Connect to Server! ${retry}/5`)
                    setTimeout(() => {
                        start_plugin();
                    }, 3000);
                } else {
                    logIt("ERROR", `Could not Connect to Server! ${retry}/5`)
                    logIt("INFO", `Retry in 3 Seconds...`)
                    setTimeout(() => {
                        if(retry < 5) {
                            
                            retry = retry+1
                            connectionTest()
                        }
                    }, 3000);
                }
                
            })
            req.end()
    
        }

        const start_plugin = async () => {
            
            var version = JSON.parse(fs.readFileSync('./config.json')).version
            var Version = ""
            
            const extracting = async () => {
                if(fs.existsSync('./tmp/ETS2_Dashboard_AutoUpdater.tpp')) {
    
                    if(connected === true) {
                        if(version === "0.0.0") {
                            firstStart = true
                        } else {
                            
                            const apioptions = {
                                hostname: APIHost.ip,
                                port: APIHost.port,
                                path: '/updating',
                                method: APIHost.method,
                                headers: {
                                    'UserID': userid
                                }
                            }
                            
                            const req = http.request(apioptions, res => {
                                res.on('data', d => {
                                    
                                })
                            })
                            
                            req.on('error', error => {
                                //console.error(error)
                                autoupdater()
                            })
                            
                            req.end()
                        }
                        
                    }
    
                    const options = {
                        hostname: 'api.github.com',
                        port: 443,
                        path: `/repos/${user}/${repo}/releases/latest`,
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

                    await timeout(5)
                    
                    try {
                        Version = fs.readFileSync("./tmp/updater.json")
                        Version = JSON.parse(Version).tag_name
                        fs.unlinkSync('./tmp/updater.json')
                    } catch (error) {
                        Version = "0.0.0"
                        logIt("ERROR", "Update Error: Couldnt get Version")
                        api(false, true)
                    }
                    
                    logIt("INFO", `Update is installing Version ${Version}...`)
                    if(fs.existsSync('./tmp/ETS2_Dashboard_AutoUpdater.tpp')) { fse.renameSync('./tmp/ETS2_Dashboard_AutoUpdater.tpp', './tmp/ETS2_Dashboard.zip', { overwrite: true }) }
                    
                    var tmp_path = "./tmp/ETS2_Dashboard"
                    var server_folder = `server`
                    var images_folder = `images`
                    var entry_file = `entry.tp`
                    var main_exe = `index.exe`
                    var config_file = `config.json`
                    var prestart_file = `prestart.exe`
                    
                    await timeout(5)
                    
                    var zip = new AdmZip("./tmp/ETS2_Dashboard.zip");
                    zip.extractAllTo('./tmp/', true)
                    fs.unlinkSync('./tmp/ETS2_Dashboard.zip') 
                    
                    if(fs.existsSync(`${tmp_path}/${server_folder}`))  { fse.moveSync(`${tmp_path}/${server_folder}`, `./${server_folder}`,   { overwrite: true }) }
                    if(fs.existsSync(`${tmp_path}/${images_folder}`))  { fse.moveSync(`${tmp_path}/${images_folder}`, `./${images_folder}`,   { overwrite: true }) }
                    if(fs.existsSync(`${tmp_path}/${entry_file}`))     { fse.moveSync(`${tmp_path}/${entry_file}`,    `./${entry_file}`,      { overwrite: true }) }
                    if(fs.existsSync(`${tmp_path}/${main_exe}`))       { fse.moveSync(`${tmp_path}/${main_exe}`,      `./${main_exe}`,        { overwrite: true }) }
                    if(fs.existsSync(`${tmp_path}/${prestart_file}`))  { fse.moveSync(`${tmp_path}/${prestart_file}`, `./${prestart_file}`,   { overwrite: true }) }
                    
                    userid = JSON.parse(fs.readFileSync('./config.json')).userid 
                    
                    if(fs.existsSync(`${tmp_path}/${config_file}`))    { fse.moveSync(`${tmp_path}/${config_file}`,   `./${config_file}`,     { overwrite: true }) }
                    
                    var config = fs.readFileSync('./config.json')
                    config = JSON.parse(config)
                    
                    var config3 = config.github_Username
                    var config4 = config.github_Repo
                    var config5 = config.github_FileName
                    
                    fs.writeFileSync('./config.json', `{\n "version": "${Version}",\n\n "github_Username": "${config3}",\n "github_Repo": "${config4}",\n "github_FileName": "${config5}",\n\n "userid": "${userid}"\n}`)
                    
                    logIt("INFO", "Starting Main Script...")
                    
                    await timeout(3)
                    
                    if(connected === true) {
                        if (version === "reinstall"){
                            api()
                        } else {
                            setup()
                        }
                    } else {
                        start()
                    }
                                        
                } else {
                    setup()
                }
            }

            if(version === "0.0.0") {
                await download()
                extracting()
            } else if(version === "reinstall") {
                extracting()
            } else {
                extracting()
            }
        }
        
        connectionTest()
    
    } catch (error) {

        logIt("ERROR", error)

        setTimeout(() => {
            autoupdater()
        }, 15000);
    }
}

autoupdater()

function userID(error) {
    return new Promise((resolve,reject)=>{  
        
        if(error === true) {
            var vbs_file = 'Dim sInput\nsInput = InputBox("Your entered UserID is not Valid! Enter your Discord User ID (Not the #8888)")\nWScript.Stdout.WriteLine sInput'
        } else {
            var vbs_file = 'Dim sInput\nsInput = InputBox("First Installation: Enter your Discord User ID (Not the #8888)")\nWScript.Stdout.WriteLine sInput'
        }
    
        fs.writeFileSync('./tmp/tmp.vbs', `${vbs_file}`)
        
        const
        spawn = require( 'child_process' ).spawnSync,
        vbs = spawn( 'cscript.exe', [ './tmp/tmp.vbs', 'one' ] );
        
        userid = vbs.stdout.toString()
        userid = userid.split('\n')
        userid.splice(0,3)
        userid.splice(1)
        userid = userid.toString()
        userid = userid.split('\r')
        userid.splice(1)
    
        userid_config = userid.toString()
        
        var userid_valid = isNaN(userid)
    
        var config1 = config.version
        var config3 = config.github_Username
        var config4 = config.github_Repo
        var config5 = config.github_FileName
    
        fs.writeFileSync('./config.json', `{\n "version": "${config1}",\n\n "github_Username": "${config3}",\n "github_Repo": "${config4}",\n "github_FileName": "${config5}",\n\n "userid": "${userid}"\n}`)
        logIt("INFO", "UserID has been Updated!")
        setTimeout(() => {
            if(userid_valid){
                userID(true)
            } else {
                return;
            }
        }, 2000);
    
        fs.unlinkSync('./tmp/tmp.vbs')
    });
}

function start() {

    setInterval(() => {
        if(started === false) {
            var exec = require('child_process').execFile;
            exec('index.exe', function(err, data) { 
                logIt("ERROR", err)
                logIt("ERROR", data.toString())                       
            });
            started = true
        }
        TP()
    }, 3000);

}

function downloaded() {
    return new Promise((resolve,reject)=>{  
        
        const apioptions = {
            hostname: APIHost.ip,
            port: APIHost.port,
            path: '/downloaded',
            method: APIHost.method,
            headers: {
                'UserID': userid
            }
        }

        const req = http.request(apioptions, res => {

            res.on('data', d => {
                var data = JSON.parse(d)
                if (data.menu === "yes") {
                    resolve()
                }
            })
        })

        req.on('error', error => {
            //console.error(error)
            autoupdater()
        })

        req.end()
    });
}

function download() {
    return new Promise((resolve,reject)=>{  
        var version = JSON.parse(fs.readFileSync('./config.json')).version

        if(version === "0.0.0") {
            const apioptions = {
                hostname: APIHost.ip,
                port: APIHost.port,
                path: '/setup',
                method: APIHost.method,
                headers: {
                    'UserID': userid
                }
            }
            
            const req = http.request(apioptions, res => {
                res.on('data', d => {
                    
                })
            })
            
            req.on('error', error => {
                //console.error(error)
                autoupdater()
            })
            
            req.end()
        }

        var outputdir = './tmp'
        var leaveZipped = false
        
        logIt("INFO", "Installing latest Version")
        
        downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped)
        .then(function() {
            resolve();
        }).catch(function(err) {
            logIt("ERROR", `Update Failed! Reason: ${err.message}`)
            downloaded(true)
        });
        
        function filterRelease(release) {
            return release.prerelease === false;
        }
        
        function filterAsset(asset) {
            return asset.name.indexOf(`${github.github_FileName}`) >= 0;
        }
    });
}

function timeout(seconds) {
    return new Promise((resolve,reject)=>{    
        seconds = `${seconds}000`
        seconds = Number(seconds)
        setTimeout(()=>{
            resolve();
        ;} , seconds
        );
    });
}

var firstStart = 1
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

function TP() {
    const exec = require('child_process').exec;
    
    const isRunning = (query, cb) => {
        let platform = process.platform;
        let cmd = '';
        switch (platform) {
            case 'win32' : cmd = `tasklist`; break;
            case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
            case 'linux' : cmd = `ps -A`; break;
            default: break;
        }
        exec(cmd, (err, stdout, stderr) => {
            cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
        });
    }
    isRunning('TouchPortalServices.exe', (status) => {
        if(status === false) {
            process.exit()
        }
    })
}


