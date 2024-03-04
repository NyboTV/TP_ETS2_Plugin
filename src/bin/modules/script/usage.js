// Import System Modules
const pid = require('pidusage')
const getFolderSize = require('get-folder-size')

const usage = async (TPClient, logIt, timeout) => {
    const dirpath = process.cwd()

    let cpu_usage = ""
    let cpu_usageOld = ""

    let mem_usage = ""
    let mem_usageOld = ""

    let storage_usage = ""
    let storage_usageOld = ""

    for (var i = 0; i < Infinity; await timeout(1500), i++) {
        pid(process.pid, async function(err, stats) {
            cpu_usage = Math.round(stats.cpu * 100) / 100 + "%"
            mem_usage = Math.round(stats.memory / 1024 / 1024) + " MB"

            getFolderSize(dirpath, function(err, size) {
                if (err) {
                    throw err;
                }


                storage_usage = size
                storage_usage = (storage_usage / 1000 / 1000).toFixed(2)
                if (storage_usage >= 1000) {
                    storage_usage = (storage_usage / 1000).toFixed(2) + " GB"
                } else {
                    storage_usage = storage_usage + " MB"
                }
            });
        })

        states = []
        
        if (cpu_usage !== cpu_usageOld) {
            cpu_usageOld = cpu_usage
            
            var data = {
                id: "Nybo.ETS2.Usage.CPU_Usage",
                value: `${cpu_usage}`
            }
            
            states.push(data)
        }
        
        if (mem_usage !== mem_usageOld) {
            mem_usageOld = mem_usage
            
            var data = {
                id: "Nybo.ETS2.Usage.MEM_Usage",
                value: `${mem_usage}`
            }
            
            states.push(data)
            
        }
        
        if (storage_usage !== storage_usageOld) {
            storage_usageOld = storage_usage
            
            var data = {
                id: "Nybo.ETS2.Usage.Storage_Usage",
                value: `${storage_usage}`
            }
            
            states.push(data)
            
        }
        
        try {
            if (states.length > 0) {
                TPClient.stateUpdateMany(states);
            }
        } catch (error) {
            logIt("USAGE", "ERROR", `Usage States Error: ${error}`)
            logIt("USAGE", "ERROR", `Usage States Error. Retry...`)
        }
    }
}

    
module.exports = usage