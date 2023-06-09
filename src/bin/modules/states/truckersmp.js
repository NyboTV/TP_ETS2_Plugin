// Loading Module
const fs = require('fs')
const sJSON = require('self-reload-json')
const https = require('https')

const gameStates = async (TPClient, refreshInterval, telemetry_path, logIt, timeout, path, userconfig, plugin_settings) => {
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    // Json Vars
    let module = new sJSON(`${path}/config/usercfg.json`)

    var states = []

    var offline = false

    // Check if User De/activates Module
    async function configloop () {
        for (var configLoop = 0; configLoop < Infinity; await timeout(500), configLoop++) {
            if(module.Modules.truckersmpStates === false) {
                fs.writeFileSync(telemetry_path + "/truckersMP_TMP.json", `{\n "response": { \n  "id": "false"\n }\n}`)
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
            
            var TruckersMPServer = Number(userconfig.TruckersMP.TruckersMPServer)

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
                        
                        fs.writeFileSync(telemetry_path + "/truckersMP_TMP.json", `${Server}`)

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