const fs = require('fs')

const filescheck = async (cfg_path, logger) => {
    return new Promise(async (resolve, reject) => {
        logger.info("[FILESCHECK] Checking for missing Files/Folders...")
        let missing = 0

        if(!fs.existsSync(`${cfg_path}/files.json`)) { missing = 1 } else {
            let Files = JSON.parse(fs.readFileSync(`${cfg_path}/files.json`))
            
            Files.forEach(element => {
                if(fs.existsSync(element)) {
                } else {
                    missing += 1
                    logger.error(`[FILESCHECK] MISSING ${element}`)
                }
            });
        }

        if(missing > 0) {
            resolve(missing)
        } else {
            logger.info("[FILESCHECK] Everything looks okay!")
            resolve(missing)
        }
    })
}

    
module.exports = filescheck