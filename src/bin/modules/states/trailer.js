// Loading Module
const { logger } = require('../script/logger')
const pluginEvents = require('../script/emitter')

const trailerStates = async (TPClient, path, configs) => {
    const { config, userconfig } = configs
    
    var path2 = require('path')
    var moduleName = path2.basename(__filename).replace('.js','')
    let ModuleLoaded = false

    let trailer, cargo
    let TrailerAttached, TrailerAttachedOld
    let TrailerName, TrailerNameOld
    let TrailerChainType, TrailerChainTypeOld
    let Cargo, CargoOld
    let CargoID, CargoIDOld
    let CargoLoaded, CargoLoadedOld
    let CargoType, CargoTypeOld
    let CargoDamage, CargoDamageOld
    let CargoMass, CargoMassOld
    let wear, wearOld
    let wearWheels, wearWheelsOld
    let wearChassis, wearChassisOld
    
    let unit
    let weight, weightOld

    var states = []
    
	logger.info(`[MODULES] - [${moduleName}] Module loaded`)

	pluginEvents.on(`${moduleName}States`, (telemetry) => {
		// States
        states = []
            
        // Vars
        trailer = telemetry.trailer
        cargo = telemetry.cargo

        unit = userconfig.Basics.unit
        unit = unit.toLowerCase()

        weight = userconfig.Basics.weight

        TrailerAttached = trailer.attached
        TrailerName = trailer.name
        TrailerChainType = trailer.chainType

        Cargo = cargo.cargo
        CargoID = cargo.cargoId
    
        CargoType = trailer.cargo
        CargoLoaded = cargo.cargoLoaded
        CargoDamage = cargo.damage
        CargoMass = cargo.mass

        wear = trailer.wear
        wearWheels = trailer.wearWheels
        wearChassis = trailer.wearChassis

    
        if(TrailerAttached !== TrailerAttachedOld) {
            TrailerAttachedOld = TrailerAttached

            var data = {
                id: "Nybo.ETS2.Trailer.TrailerAttached",
                value: `${TrailerAttached}`
            }

            states.push(data)
        }

        if(TrailerName !== TrailerNameOld) {
            TrailerNameOld = TrailerName

            var data ={
                id: "Nybo.ETS2.Trailer.TrailerName",
                value: `${TrailerName}`
            }

            states.push(data)
        }

        if(TrailerChainType !== TrailerChainTypeOld) {
            TrailerChainTypeOld = TrailerChainType

            var data = {
                id: "Nybo.ETS2.Trailer.TrailerChainType",
                value: `${TrailerChainType}`
            }
            
            states.push(data)
        }

        if(Cargo !== CargoOld) {
            CargoOld = Cargo

            var data = {
                id: "Nybo.ETS2.Trailer.Cargo",
                value: `${Cargo}`
            }

            states.push(data)
        }

        if(CargoID !== CargoIDOld) {
            CargoIDOld = CargoID

            var data = {
                id: "Nybo.ETS2.Trailer.CargoID",
                value: `${CargoID}`
            }

            states.push(data)
        }

        if(CargoLoaded !== CargoLoadedOld) {
            CargoLoadedOld = CargoLoaded

            var data = {
                id: "Nybo.ETS2.Trailer.CargoLoaded",
                value: `${CargoLoaded}`
            }

            states.push(data)
        }

        if(CargoType !== CargoTypeOld) {
            CargoTypeOld = CargoType

            var data = {
                id: "Nybo.ETS2.Trailer.CargoType",
                value: `${CargoType}`
            }

            states.push(data)
        }

        if(CargoDamage !== CargoDamageOld) {
            CargoDamageOld = CargoDamage

            CargoDamage = Math.round(CargoDamage*100)

            var data = {
                id: "Nybo.ETS2.Trailer.CargoDamage",
                value: `${CargoDamage}%`
            }

            states.push(data)
        }
    
        if(CargoMass !== CargoMassOld || weight !== weightOld) {

            CargoMassOld = CargoMass

            switch (weight) {
                case 0:
                    CargoMass = Math.round(Math.floor(cargo.mass / 1000))
                    weight = "Tons"
                break

                case 1:
                    CargoMass = Math.round(Math.floor(cargo.mass / 1000 * 1.102311))
                    weight = "US Tons"
                break

                case 2:
                    CargoMass = Math.round(Math.floor(cargo.mass / 1000 * 0.9843065))
                    weight = "UK Tons"
                break

                case 3: 
                    CargoMass = Math.round(Math.floor(cargo.mass / 1000 * 2204.6226))
                    weight = "Pounds"
                break

                default:
                    CargoMass = "ERROR"
                break
            }

            var data = {
                id: "Nybo.ETS2.Trailer.CargoMass",
                value: `${CargoMass} ${weight}`
            }

            states.push(data)
        }

        if(wear !== wearOld) {
            wearOld = wear

            wear = Math.round(wear*100)

            var data = {
                id: "Nybo.ETS2.Trailer.Wear",
                value: `${wear}%`
            }

            states.push(data)
        }

        if(wearChassis !== wearChassisOld) {
            wearChassisOld = wearChassis

            wearChassis = Math.round(wearChassis*100)

            var data = {
                id: "Nybo.ETS2.Trailer.wearChassis",
                value: `${wearChassis}%`
            }

            states.push(data)
        }

        if(wearWheels !== wearWheelsOld) {
            wearWheelsOld = wearWheels

            wearWheels = Math.round(wearWheels*100)

            var data = {
                id: "Nybo.ETS2.Trailer.wearWheels",
                value: `${wearWheels}%`
            }

            states.push(data)
        }

        weightOld = weight

		
		try {
			if(states.length > 0) {
				TPClient.stateUpdateMany(states);
				logger.debug(`Module '${moduleName} refreshed with ${states.length} values`)
			}
		} catch (error) {
			logger.error(`[MODULE] ${moduleName} Error: ${error}`)
		}
	})
}
module.exports = trailerStates