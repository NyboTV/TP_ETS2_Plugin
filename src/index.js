const fs = require('fs')
const fse = require('fs-extra')
const pluginId = 'TP_ETS2_Plugin_Updater';
const downloadRelease = require('download-github-release');
const AdmZip = require("adm-zip");
const http = require('http')
const https = require('https');
const sJSON = require('self-reload-json')
const publicIP = require('public-ip')
const replaceJSON = require('replace-json-property')
const ftp = require('basic-ftp')


let logs = false
let config = new sJSON('./config.json')
let firstsetup = false
let started = false
let error = false

const debugMode = process.argv.includes("--debug");

if(debugMode){
    started = true
} else {
    started = false
}

//Github Stuff
let user = config.github_Username
let repo = config.github_Repo
let repo_file = config.github_FileName

const index = async (error) => {
        try {
        
        let api_retry = 1
        let userid = ""
        let connected = false
        
        var LocalIP = await publicIP.v4()
        
        const APIHost = {
            ip: '147.189.171.174',
            port: 3000,
            method: 'POST'
        }
        
        const AutoUpdater = async (crash, api, inside_script) => {
            logIt("INFO", "Plugin is starting...")

            if(crash){
                logIt("ERROR", "Plugin Crashed!")
        
                const apioptions = {
                    hostname: APIHost.ip,
                    port: APIHost.port,
                    path: '/crash',
                    method: APIHost.method,
                    headers: {
                        'UserID': `${userid}`
                    }
                }
        
                const req = http.request(apioptions, res => {
        
                    res.on('data', async (d) => {
                    })
                })
        
                req.on('error', error => {
                    logIt("ERROR", "The Plugin Crashed after an Crash! (Wut?) The API is not reachable!")
                })
        
                req.end()
            }
        
            if(!crash){
                const connectionTest = async () => {
        
                    logIt("INFO", `Connecting to API... Try: ${api_retry}`)
                    
                    const apioptions = {
                        hostname: APIHost.ip,
                        port: APIHost.port,
                        path: '/connectionTest',
                        method: APIHost.method,
                        headers: {
                            "UserIP": `${LocalIP}`
                        }
                    }
                    
                    
                    const req = http.request(apioptions, res => {
                        res.on('data', async (d) => {
                            
                            const connected_api = async () => {
                                connected = true
                                logIt("INFO", "Connected to API.")
                                
                                userid = config.userid 
                                
                                api_retry = 1

                                if(userid === "" || userid === undefined){
                                    await userID()
                                    setup()
                                } else {
                                    setup()
                                }
                                
                            }
                            connected_api()
                        })
                    })

                    req.on('error', async (error) => {
                        
                        if(api_retry === 3) {
                            logIt("WARN", `Could not Connect to Server! ${api_retry}/3`)
    
                            await timeout(3)
    
                            let version = await Check_Version()
                            update(version);
                        } else {
                            logIt("ERROR", `Could not Connect to Server! ${api_retry}/3`)
                            logIt("INFO", `Retry in 3 Seconds...`)
    
                            await timeout(3)
    
                            api_retry = api_retry+1
                            connectionTest()
                            
                        }
                        
                    })
                    req.end()
                }
        
                const setup = async () => {
                    logIt("INFO", "Checking User DB on API")
                    const apioptions = {
                        hostname: APIHost.ip,
                        port: APIHost.port,
                        path: '/setup',
                        method: APIHost.method,
                        headers: {
                            'UserID': userid,
                            'api_error': api
                        }
                    }
                    const req = http.request(apioptions, res => {
                        res.on('data', async (d) => {
                            var data = JSON.parse(d)
                            if (data.error === true) {
                                await userID(true)
                                setup()
                            } else {
                                var version = await Check_Version()
                                update(version)
                            }
                        })
                    })
                    
                    req.on('error', async (error) => {
                        logIt("ERROR", `ERROR ON API -> ` + error)
                        AutoUpdater(false, true)
                    })
                    
                    req.end()
                }
        
                const update = async (LatestVersion) => {
        
                    let version = config.version
        
                    if(config.autoupdates) {
                        if(version === LatestVersion) {
                            if(connected) {
                                main()
                            } else {
                                start_plugin()
                                main()
                            }
                        } else {
                            await download(true)
                            extract()
                        }
                    } else {
                        if(version === "0.0.0") {
                            await download(true)
                            extract()
                        } else if(version === "update") {
                            if(version === LatestVersion) {
                                menu()
                            } else {
                                await download(true)
                                extract()
                            }
                        } else {
                            start_plugin()
                            if(connected && config.discordMessage) {
                                main()
                            }
                        }
                    }
                }
        
                const main = async (isError) => {
                    let localVersion = config.version
                    let github_Username = config.github_Username
                    let github_Repo = config.github_Repo
        
                    if(fs.existsSync('./restart.txt')) {
                        fs.unlinkSync('./restart.txt')
                        firstsetup = true
                    }
    
                    if(isError){
                        error = true
                    }
        
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
        
                        res.on('data', async (d) => {
                            var data = JSON.parse(d)
                            console.log(data)
                            if (data.update === "yes") {
                                await reinstall()
                                restart()
                            } else if (data.reinstall === "yes") {
                                await reinstall()
                                restart()
                            } else if (data.uploadLogs === "yes") {
                                await UploadLogs()
                                main()
                            } else {
                                logIt("ERROR", "API Error -> " + data)
                            }                            
                        })
                    })
        
                    req.on('error', async (error) => {
                        logIt("ERROR", `ERROR ON API -> ` + error)
                        AutoUpdater(false, true)
                    })
        
                    req.end()
                }
        
                if(!config.discordMessage) {
                    connected = false
                    update()
                } else {
                    if(api) {
                        logIt("ERROR", "API Connection Crashed!")
                        if(api_retry === 3) {
                            return;
                        } else {
                            connectionTest()
                        }
                    } else if(inside_script) {
                        main(true)
                    } else {
                        connectionTest()
                    }
                }
            }
        }
        if(error){
            AutoUpdater(false, false, true)
        } else {
            if(process.argv.includes("--ftp_test")) {
                UploadLogs()
            } else {
                if(config.version === "0.0.0") {
                    await Setup()
                }
                AutoUpdater(false, false, false)
            }
        }
        
        
        
        function start_plugin() {
    
            if(debugMode) {
            } else {
                setInterval(() => {
                    if(started === false) {
                        var exec = require('child_process').execFile;
                        exec('ets2_plugin.exe', function(error, data) { 
                            logIt("ERROR", error)
                            logIt("ERROR", data.toString())                       
                        });
                        started = true
                    }
                    TP()
                }, 3000);
            }
        }
        
        
        function Setup() {
            return new Promise(async(resolve,reject)=>{
                const firstSetup = async () => {
                    var vbs_file = 'dim result\nresult = msgbox("Do you want to use the Discord Bot Function? (You have to be on my Plugin Discord for this to Work! Link on my Github)", 4 , "Discord Bot")\nWScript.Stdout.WriteLine result'
                    
                    fs.writeFileSync('./tmp/tmp.vbs', `${vbs_file}`)
                    
                    const
                    spawn = require( 'child_process' ).spawnSync,
                    vbs = spawn( 'cscript.exe', [ './tmp/tmp.vbs', 'one' ] );
                    
                    result = vbs.stdout.toString()
                    result = result.split('\n')
                    result.splice(0,3)
                    result.splice(1)
                    result = result.toString()
                    result = result.split('\r')
                    result.splice(1)
                    result = result.toString()

                    if(result === "6") {
                        result = true
                    }
                    if(result === "7") {
                        result = false
                    }

                    logIt("INFO", `Discord Bot -> User decided: ${result}!`)
                    
                    replaceJSON.replace('./config.json', 'discordMessage', result)
                    
                    logIt("INFO", "Discord Bot Option has been Updated!")
                    
                    fs.unlinkSync('./tmp/tmp.vbs')

                    await timeout(1)
        
                    resolve();
                }
                firstSetup()
            })
        }
        
        function userID(error) {
            return new Promise(async(resolve,reject)=>{ 
                
                const test_userid = async (input_empty) => {
                    if(error === true) {
                        var vbs_file = 'Dim sInput\nsInput = InputBox("Your entered UserID is not Valid! Enter your Discord User ID (Not the #8888)")\nWScript.Stdout.WriteLine sInput'
                    } else if(input_empty) {
                        var vbs_file = 'Dim sInput\nsInput = InputBox("Input is Empty! Enter your Discord User ID (Not the #8888). Read Github to see how to get UserID")\nWScript.Stdout.WriteLine sInput'
                    } else {
                        var vbs_file = 'Dim sInput\nsInput = InputBox("First Installation: Enter your Discord User ID (Not the #8888). Read Github to see how to get UserID")\nWScript.Stdout.WriteLine sInput'
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
                    
                    if(!userid_config){
                        test_userid(true)
                    }
                    
                    await timeout(3)
                    
                    if(userid_valid){
                        logIt("WARN", "Entered UserID is not Valid! Retry...")
                        userID(true)
                    } else {
                        logIt("INFO", "Entered UserID is Valid!")
                        
                        replaceJSON.replace('./config.json', 'userid', `${userid}`)
                        
                        logIt("INFO", "UserID has been Updated!")
                        
                        resolve();                    
                    }
                    
                    fs.unlinkSync('./tmp/tmp.vbs')
                }
        
                test_userid()
            });
        }
        
        function download(update) {
            return new Promise(async(resolve,reject)=>{ 
                if(update){
                    const apioptions = {
                        hostname: APIHost.ip,
                        port: APIHost.port,
                        path: '/update',
                        method: APIHost.method,
                        headers: {
                            'UserID': `${userid}`
                        }
                    }
        
                    const req = http.request(apioptions, res => {
        
                        res.on('data', async (d) => {                        
                        })
                    })
        
                    req.on('error', async (error) => {
                        logIt("ERROR", `ERROR ON API -> ` + error)
                        AutoUpdater(false, true)
                    })
        
                    req.end()
                }
                
                var outputdir = './tmp'
                var leaveZipped = false
                
                logIt("INFO", "Downloading latest Version")
                
                downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped)
                .then(function() {
                    resolve();
                }).catch(function(err) {
                    logIt("ERROR", `Update Failed! Reason: ${err.message}`)
                });
                
                function filterRelease(release) {
                    return release.prerelease === false;
                    
                }
                
                function filterAsset(asset) {
                    return asset.name.indexOf(`${repo_file}`) >= 0;
                }
            });
        }
        
        function extract() {
            return new Promise(async(resolve,reject)=>{
                logIt("INFO", "New Downloaded Version is installing...")
                if(fs.existsSync('./tmp/ETS2_Dashboard_AutoUpdater.tpp')) {
                    if(connected === true) {
                        const apioptions = {
                            hostname: APIHost.ip,
                            port: APIHost.port,
                            path: '/extract',
                            method: APIHost.method,
                            headers: {
                                'UserID': userid
                            }
                        }
                        
                        const req = http.request(apioptions, res => {
                            res.on('data', async (d) => {
                            })
                        })
                        
                        req.on('error', async (error) => {
                            logIt("ERROR", `ERROR ON API -> ` + error)
                            AutoUpdater(false, true)
                        })
                        
                        req.end()
                        
                    }
                    
                    var LatestVersion = await Check_Version()
                    
                    logIt("INFO", `Update is installing Version ${LatestVersion}...`)
                    if(fs.existsSync('./tmp/ETS2_Dashboard_AutoUpdater.tpp')) { fse.renameSync('./tmp/ETS2_Dashboard_AutoUpdater.tpp', './tmp/ETS2_Dashboard.zip', { overwrite: true }) }
                    
                    var tmp_path = "./tmp/ETS2_Dashboard"
                    var server_folder = `server`
                    var images_folder = `images`
                    var entry_file = `entry.tp`
                    var config_file = `config.json`
                    var prestart_file = `prestart.exe`
                    var plugin_file = `ets2_plugin.exe`
                    var userconfig_file = `userSettings.json`
                    
                    await timeout(5)
        
                    try {
                        var zip = new AdmZip("./tmp/ETS2_Dashboard.zip");
                        zip.extractAllTo('./tmp/', true)
                        fs.unlinkSync('./tmp/ETS2_Dashboard.zip') 
                    } catch (error) {
                        logIt("WARN", "Error duing Extract Function! ")
                        AutoUpdater(false, false, true)
                    }
                    
                    if(fs.existsSync(`${tmp_path}/${server_folder}`))   { fse.moveSync(`${tmp_path}/${server_folder}`,      `./${server_folder}`,   { overwrite: true }) }
                    if(fs.existsSync(`${tmp_path}/${images_folder}`))   { fse.moveSync(`${tmp_path}/${images_folder}`,      `./${images_folder}`,   { overwrite: true }) }
                    if(fs.existsSync(`${tmp_path}/${entry_file}`))      { fse.moveSync(`${tmp_path}/${entry_file}`,         `./${entry_file}`,      { overwrite: true }) }
                    if(fs.existsSync(`${tmp_path}/${prestart_file}`))   { fse.moveSync(`${tmp_path}/${prestart_file}`,      `./${prestart_file}`,   { overwrite: true }) }
                    if(fs.existsSync(`${tmp_path}/${userconfig_file}`)) { fse.moveSync(`${tmp_path}/${userconfig_file}`,    `./${userconfig_file}`, { overwrite: true }) }
                    if(fs.existsSync(`${tmp_path}/${plugin_file}`))     { fse.moveSync(`${tmp_path}/${plugin_file}`,        `./${plugin_file}`,     { overwrite: true }) }
                    
                    let config = JSON.parse(fs.readFileSync('./config.json')) 
                    let version = LatestVersion
                    userid = config.userid
                    let discordMessage = config.discordMessage
                    
                    if(fs.existsSync(`${tmp_path}/${config_file}`))     { fse.moveSync(`${tmp_path}/${config_file}`,        `./${config_file}`,     { overwrite: true }) }

                    replaceJSON.replace('./config.json', 'version', `${version}`)
                    replaceJSON.replace('./config.json', 'userid', `${userid}`)
                    replaceJSON.replace('./config.json', 'discordMessage', discordMessage)

                    

                    await timeout(1)
        
                    restart()
        
                }
            })
        }
        
        function Check_Version() {
            logIt("INFO", "Checking Latest Version")
            let Check_Version_version = "" 
            return new Promise(async(resolve,reject)=>{  
                const options = {
                    hostname: 'api.github.com',
                    port: 443,
                    path: `/repos/${user}/${repo}/releases/latest`,
                    method: 'GET',
                    headers: {'user-agent': 'node.js'}
                }
                
                fs.writeFileSync('./tmp/updater.json', " ")
                https.get(options, (res) => {
                    res.on('data', async (d) => {
                        fs.appendFileSync('./tmp/updater.json', d)
                    });
                    
                }).on('error', (e) => {
                    console.error(e);
                })
                
                await timeout(2)
                
                try {
                    Check_Version_version = JSON.parse(fs.readFileSync("./tmp/updater.json")).tag_name
                    fs.unlinkSync('./tmp/updater.json')
                } catch (error) {
                    Version = "0.0.0"
                    logIt("ERROR", "Update Error: Couldnt get Version")
                    AutoUpdater(false, false, true)
                }
                
                logIt("INFO", `Latest Version: ${Check_Version_version}`)
                resolve(Check_Version_version)
            })
        }
    
        function reinstall() {
            logIt("INFO", "Reinstalling the Plugin...")
            return new Promise(async(resolve,reject)=>{ 
                replaceJSON.replace('./config.json', 'version', `update`)           
                resolve()
            })
        }
           
        function UploadLogs() {
            logIt("INFO", "Uploading the Logs...")
            return new Promise(async(resolve,reject)=>{

                var userid = JSON.parse(fs.readFileSync('./config.json')).userid
                
                const client = new ftp.Client()
                client.ftp.verbose = true
                try {
                    await client.access({
                        host: APIHost.ip,
                        port: "7005",
                        user: userid,
                        password: "test",
                        secure: false
                    })
                    await client.uploadFrom(`./logs/latest.log`, `./latest.log`)
                    await timeout(3)
                    resolve()
                }
                catch(err) {
                    console.log(err)
                }
                client.close()
                
            })
        }
        
        
        
        
        function timeout(seconds) {
            return new Promise(async(resolve,reject)=>{    
                seconds = `${seconds}000`
                seconds = Number(seconds)
                setTimeout(() => {
                    resolve();
                }, seconds);
            })
        }
        
        function restart() {
            fs.writeFileSync('./restart.txt', 'restart')
            process.exit()
        }
    } catch (error) {
        logIt("ERROR", error)
        index(true)
    }
}
index()


setInterval(() => {
    if(!debugMode) {
        Running()
    }
}, 3000);


if(!fs.existsSync('./logs')) { fs.mkdirSync('./logs') }
if(!fs.existsSync('./tmp')) { fs.mkdirSync('./tmp') }


function logIt() {
    if(!logs) {
        fs.writeFileSync('./logs/latest.log', `\n --------SCRIPT STARTED--------`)
        logs = true
    }
    
    let curTime = new Date().toISOString().
    replace(/T/, ' ').
    replace(/\..+/, '')
    var message = [...arguments];
    var type = message.shift();
    console.log(curTime,":",pluginId,":"+type+":",message.join(" "));
    fs.appendFileSync('./logs/latest.log', `\n${curTime}:${pluginId}:${type}:${message.join(" ")}`)
}

function Running() {
    const exec = require('child_process').exec;
    
    const isRunning = (query, cb) => {
        var platform = process.platform;
        var cmd = '';
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
    isRunning('start.exe', (status) => {
        if(status === false) {
            process.exit()
        }
    })
    
}

function TP() {
    const exec = require('child_process').exec;
    
    const isRunning = (query, cb) => {
        var platform = process.platform;
        var cmd = '';
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
    isRunning('ets2_plugin.exe', (status) => {
        if(status === false) {
            process.exit()
        }
    })
    
}