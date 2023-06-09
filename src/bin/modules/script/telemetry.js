// Import Writing Modules
const fs = require(`fs`)
// Import Internet Modules
const http = require(`request`);
// Import System Modules
const { exec, execFile } = require(`child_process`)

const isRunning = (query, cb) => {
    exec('tasklist', (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}

let telemetry = ""
let telemetry_status_online = false
let telemetry_retry = 0

const telemetry_Server = async (path, logIt, timeout, refreshInterval) => {
    return new Promise(async (resolve, reject) => {

        async function CheckTelemetryEXE() {
            return new Promise(async (resolve) => {
                isRunning(`Ets2Telemetry.exe`, async (status) => {
                    resolve(status)
                })
            })    
        } 
        
        async function CheckTelemetryEXELoop() {
            for(var i = 0; Infinity; await timeout(100)) {
                if(await CheckTelemetryEXE() === true) {
                    telemetry_status_online = true
                } else {
                    telemetry_status_online = false
                    execFile(`${path}/server/Ets2Telemetry.exe`, function(err, data) {
                        if(telemetry_retry > 0) {
                            logIt("TELEMETRY", "ERROR", err)
                            logIt("TELEMETRY", "ERROR", data.toString())
                        } 
                    });
                    await timeout(1000)
                    telemetry_retry = 1
                }
            }
        }

        async function Telemetry() {
            for(var i = 0; Infinity; await timeout(refreshInterval)) {
                if(telemetry_status_online) {
                    http.get(`http://localhost:25555/api/ets2/telemetry`, async function(err, resp, body) {
                        var data = ``;
                        data = body
                        
                        if (err != null) {
                            telemetry_status_online = false
                            logIt("TELEMETRY", "WARN", `Telemetry Request Error! -> ${err}`)
                            telemetry_retry = 1
                            
                            await timeout(3000)
                            return
                        }
                        
                        try {
                            data = JSON.parse(data)
                            telemetry = JSON.stringify(data)
                            fs.writeFileSync(`${telemetry_path}/tmp.json`, `${telemetry}`, `utf8`)
                            telemetry_status_online = true
                        } catch (error) {
                            telemetry_status_online = false
            
                            logIt("TELEMETRY", "WARN", `Telemetry Data Error! -> ${err}`)

                            await timeout(3000)
                            return
                        }
                    })
                }
            }
        }

        CheckTelemetryEXELoop()
        Telemetry()

    })
}

    
module.exports = telemetry_Server