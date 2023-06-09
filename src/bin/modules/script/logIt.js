const fs = require('fs')

const pluginID = `TP_ETS2_Plugin`;
const debugMode = process.argv.includes("--debugging")
let dirpath = process.cwd()
let dirname = dirpath.includes(`\\src\\bin`)
if (debugMode) { path = `./src/bin`; /**/ cfg_path = path; /**/ telemetry_path = "./src/bin/tmp" } else { path = dirpath; /**/ cfg_path = path; /**/ telemetry_path = "./tmp"; }

let start = true

const logIt = async (module, type, message) => {
    
    if(start === true) {
        if(!fs.existsSync(`${path}/logs`)) return fs.mkdirSync(`${path}/logs`)
        fs.writeFileSync(`${path}/logs/latest.log`, "---Plugin Started---")
        start = false
    }

    let curTime = new Date().toISOString().
    replace(/T/, ` `).
    replace(/\..+/, ``)
    console.log(curTime, ":", pluginID, ": " + module + "-" + type + ":", message);
    fs.appendFileSync(`${path}/logs/latest.log`, `\n${curTime}:${pluginID}:${module}-${type}:${message}`)
}
    
module.exports = logIt