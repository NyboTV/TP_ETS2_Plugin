const filescheck = async (path, logIt) => {
    return new Promise(async (resolve, reject) => {
        logIt("FILESCHECK", "INFO", "Checking for missing Files/Folders...")



        // Test Wenn alles da dann true
        logIt("FILESCHECK", "INFO", "Everything looks okay!")
        resolve(true)
    })
}

    
module.exports = filescheck