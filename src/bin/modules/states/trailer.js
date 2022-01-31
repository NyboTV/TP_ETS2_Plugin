const trailerStates = async (TPClient, telemetry, logIt, timeout, config, userconfig) => {

    // Loading Module
    var path = require('path')
    var moduleName = path.basename(__filename)

    // Vars
    let trailer1 = telemetry.trailer1
    let cargo = telemetry.cargo

    let Location = config.location
    let TrailerAttached = trailer1.attached
    let TrailerName = trailer1.name
    let TrailerChainType = trailer1.chainType

    let CargoLoaded = cargo.cargoLoaded
    let CargoType = cargo.cargo
    let CargoDamage = Math.round(cargo.damage * 100)
    let CargoMass = ""

    if (Location === "mph") {
        CargoMass = Math.round(Math.floor(cargo.mass / 1000 * 1.102311))
    } else {
        CargoMass = Math.round(Math.floor(cargo.mass / 1000))
    }

    Weight = userconfig.Basics.Weight

    // Module Stuff
    var states = [
        {
            id: "Nybo.ETS2.Dashboard.TrailerAttached",
            value: `${TrailerAttached}`
        },
        {
            id: "Nybo.ETS2.Dashboard.TrailerName",
            value: `${TrailerName}`
        },
        {
            id: "Nybo.ETS2.Dashboard.TrailerChainType",
            value: `${TrailerChainType}`
        },

        {
            id: "Nybo.ETS2.Dashboard.CargoLoaded",
            value: `${CargoLoaded}`
        },
        {
            id: "Nybo.ETS2.Dashboard.CargoType",
            value: `${CargoType}`
        },
        {
            id: "Nybo.ETS2.Dashboard.CargoDamage",
            value: `${CargoDamage}`
        },
        {
            id: "Nybo.ETS2.Dashboard.CargoMass",
            value: `${CargoMass} ${Weight}`
        },
    ]

    try {
        TPClient.stateUpdateMany(states);
    } catch (error) {
        logIt("ERROR", `${moduleName}States Error: ${error}`)
    }
}
module.exports = trailerStates