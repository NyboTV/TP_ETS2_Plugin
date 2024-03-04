// Loading Module
const fs = require('fs')
const https = require('https')
const { logger } = require('../script/logger')
const sJSON = require(`self-reload-json`)
const timeout = require('../script/timeout')

const gameStates = async (TPClient, path, configs) => {
    const { config, userconfig } = configs

    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    var states = []
    
    var offline = false

    let module = new sJSON(`${path}/config/usercfg.json`)
    refreshInterval = config.refreshInterval

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(refreshInterval), configLoop++) {
            if(module.Modules.truckersmpStates === false) {
                fs.writeFileSync(path+"/tmp/truckersMP_TMP.json", `{\n "response": { \n  "id": "false"\n }\n}`)
                if(ModuleLoaded === true) { logIt("MODULE", `${moduleName}States`, `Module unloaded`) }
                ModuleLoaded = false
            } else if(ModuleLoaded === false) { 
                logIt("MODULE", `${moduleName}States`, `Module loaded`)
                ModuleLoaded = true 
            }
        }
    }

    //Module Loop
    async function moduleloop () {
        for (var moduleLoop = 0; moduleLoop < Infinity; await timeout(refreshInterval * 200), moduleLoop++) {
            refreshInterval = config.refreshInterval
    
            if(ModuleLoaded === false) { 
                states = []
                if(offline === false) {
                    states = [
                        {
                        id: "Nybo.ETS2.TruckersMP.Servers",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.TruckersMP.ServerName",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.TruckersMP.ServerPlayers",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.TruckersMP.ServerPlayerQueue",
                        value: `MODULE OFFLINE` 
                        },
                        {
                        id: "Nybo.ETS2.TruckersMP.APIOnline",
                        value: `MODULE OFFLINE` 
                        }
                    ]
                    
                    TPClient.stateUpdateMany(states);
    
                    offline = true
                }
                continue
            } else 

            // Vars
            var Servers = ""
            var Server = ""
            var ServerName = ""
            var ServerPlayers = ""
            var ServerPlayerQueue = ""
            var APIOnline = ""
            
            var TruckersMPServer = Number(cfg_path.TruckersMP.TruckersMPServer)

			function IsJsonString(str) {
				try {
					JSON.parse(str);
				} catch (e) {
					return false;
				}
				return true;
			}

			https.get('https://api.truckersmp.com/v2/servers', (resp) => {
                
				var data = '';

				resp.on('data', (chunk) => {
					data += chunk;
				})

				resp.on('end', () => {

                    
                    if (IsJsonString(data) === true) {
                        data = JSON.parse(data)
                        
                        
						Servers = data.response.length
						Server = data.response[TruckersMPServer]


						ServerName = Server.shortname
						ServerPlayers = Server.players
						ServerPlayerQueue = Server.queue

                        Server = JSON.stringify(data)
                        
                        fs.writeFileSync(path+"/tmp/truckersMP_TMP.json", `${Server}`)

                        APIOnline = true
					} else {

						Servers = "TruckersMP API Error!"
						Server = "TruckersMP API Error!"

						ServerName = "TruckersMP API Error!"
						ServerPlayers = "TruckersMP API Error!"
						ServerPlayerQueue = "TruckersMP API Error!"

                        APIOnline = false
					}

                    states = [
                        {
                        id: "Nybo.ETS2.TruckersMP.Servers",
                        value: `${Servers}`
                    },
                    {
                        id: "Nybo.ETS2.TruckersMP.ServerName",
                        value: `${ServerName}`
                    },
                    {
                        id: "Nybo.ETS2.TruckersMP.ServerPlayers",
                        value: `${ServerPlayers}`
                    },
                    {
                        id: "Nybo.ETS2.TruckersMP.ServerPlayerQueue",
                        value: `${ServerPlayerQueue}`
                    },
                    {
                        id: "Nybo.ETS2.TruckersMP.APIOnline",
                        value: `${APIOnline}`
                    },
                    ]

                    offline = false
                
                    try {
                        TPClient.stateUpdateMany(states);                    
                    } catch (error) {
                        logIt("MODULE", `${moduleName}States`, `Error: ${error}`)
                    }
                })
            })
		}
	}
    
	configloop()
	moduleloop()
}


    
module.exports = gameStates