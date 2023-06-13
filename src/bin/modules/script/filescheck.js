const fs = require('fs')

let missing = 0

const filescheck = async (path, cfg_path, logIt, timeout) => {
    return new Promise(async (resolve, reject) => {
        logIt("FILESCHECK", "INFO", "Checking for missing Files/Folders...")

        if(!fs.existsSync(`${cfg_path}/files.json`)) { missing = 1 } else {
            let Files = JSON.parse(fs.readFileSync(`${cfg_path}/files.json`))
            
            Files.forEach(element => {
                if(fs.existsSync(element)) {
                } else {
                    missing += 1
                }
            });
        }

        if(missing > 0) {
            resolve(missing)
        } else {
            logIt("FILESCHECK", "INFO", "Everything looks okay!")
            resolve(missing)
        }
    })
}

    
module.exports = filescheck