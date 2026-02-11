# ETS2 Dashboard Plugin Data

## Events

### Truck Events
*Note: These are events that can trigger Touch Portal Flow.*
*Note: Every Event starts with Nybo.ETS2.Truck.*Nybo.ETS2.*.* Nybo.ETS2.Game.* Nybo.ETS2.World.* Nybo.ETS2.Driver.* depends on the category of the event.*

| Event                     | Description                                           | Available Values      |
|---------------------------|:--------------------------------------------------------:|----------------------:|
| EngineOn                  | Triggers when the engine is turned on or off          | true/false            |
| ElectricOn                | Triggers when electronics are turned on or off        | true/false            |
| WipersOn                  | Triggers when wipers are turned on or off             | true/false            |
| ParkBrakeOn               | Triggers when parking brake is engaged or released    | true/false            |
| HazardLightsOn            | Triggers when hazard lights are turned on or off      | true/false            |
| TrailerAttached           | Triggers when a trailer is attached or detached       | true/false            |
| CargoLoaded               | Triggers when cargo is loaded or unloaded             | true/false            |


## States

### Game States

| State ID                             | Description                                           | Available Values      |
|--------------------------------------|:-----------------------------------------------------:|----------------------:|
| Nybo.ETS2.Game.ConnectedStatus       | Shows if you are Connected to the Game SDK            | true/false            |
| Nybo.ETS2.Game.GameType              | Shows the Game currently running                      | ETS2 / ATS            |
| Nybo.ETS2.Game.IsPaused              | Shows if the Game is Paused                           | true/false            |

### World States

| State ID                             | Description                                           | Available Values      |
|--------------------------------------|:-----------------------------------------------------:|----------------------:|
| Nybo.ETS2.World.Time                 | Shows the current ingame Time (Day X, HH:MM)          | Dynamic Text          |

### Driver States

| State ID                             | Description                                           | Available Values      |
|--------------------------------------|:-----------------------------------------------------:|----------------------:|
| Nybo.ETS2.Driver.NextRestTime        | Shows the time of the next required rest stop         | HH:MM                 |

### Gauge States (Dynamic Images)

| State ID                             | Description                                           | Available Values      |
|--------------------------------------|:-----------------------------------------------------:|----------------------:|
| Nybo.ETS2.Gauges.SpeedGauge          | Current Speed as a dynamic image                      | Image                 |
| Nybo.ETS2.Gauges.RPMGauge            | Current RPM as a dynamic image                        | Image                 |
| Nybo.ETS2.Gauges.FuelGauge           | Current Fuel level as a dynamic image                 | Image                 |

### Truck States

| State ID                             | Description                                           | Available Values      |
|--------------------------------------|:-----------------------------------------------------:|----------------------:|
| Nybo.ETS2.Truck.Truck_Make           | Truck Brand / Manufacturer                            | Text                  |
| Nybo.ETS2.Truck.Model                | Truck Model Name                                      | Text                  |
| Nybo.ETS2.Truck.Speed                | Current Speed (Unit based on settings)                | Number (Text)         |
| Nybo.ETS2.Truck.EngineRPM            | Current Engine RPM                                    | Number (Text)         |
| Nybo.ETS2.Truck.Gear                 | Current Gear (D1, R1, N, 1, 2, etc.)                  | Text                  |
| Nybo.ETS2.Truck.CruiseControlOn      | Cruise Control status                                 | true/false            |
| Nybo.ETS2.Truck.CruiseControlSpeed   | Set Cruise Control Speed                              | Number (Text)         |
| Nybo.ETS2.Truck.Odometer             | Total distance driven                                 | Number (Text)         |
| Nybo.ETS2.Truck.EngineOn             | Engine status                                         | true/false            |
| Nybo.ETS2.Truck.ElectricOn           | Electronics status                                    | true/false            |
| Nybo.ETS2.Truck.WipersOn             | Wipers status                                         | true/false            |
| Nybo.ETS2.Truck.ParkBrakeOn          | Parking Brake status                                  | true/false            |
| Nybo.ETS2.Truck.MotorBrakeOn         | Engine Brake status                                   | true/false            |
| Nybo.ETS2.Truck.Retarder             | Retarder step (0, 1, 2, 3)                            | Number (Text)         |
| Nybo.ETS2.Truck.Fuel                 | Current Fuel amount                                   | Number (Text)         |
| Nybo.ETS2.Truck.FuelCapacity         | Maximum Fuel Capacity                                 | Number (Text)         |
| Nybo.ETS2.Truck.FuelConsumption      | Average Fuel Consumption                              | Number (Text)         |
| Nybo.ETS2.Truck.AdBlue               | Current AdBlue level                                  | Number (Text)         |
| Nybo.ETS2.Truck.OilTemp              | Oil Temperature (Unit based on settings)              | Text (e.g. 80 C°)     |
| Nybo.ETS2.Truck.WaterTemp            | Water Temperature (Unit based on settings)            | Text                  |
| Nybo.ETS2.Truck.wearEngine           | Engine Damage %                                       | Text (0-100%)         |
| Nybo.ETS2.Truck.wearTransmission     | Transmission Damage %                                 | Text                  |
| Nybo.ETS2.Truck.wearCabin            | Cabin Damage %                                        | Text                  |
| Nybo.ETS2.Truck.wearChassis          | Chassis Damage %                                      | Text                  |
| Nybo.ETS2.Truck.wearWheels           | Wheels Damage %                                       | Text                  |
| Nybo.ETS2.Truck.LightsDashboardOn    | Dashboard lights status                               | true/false            |
| Nybo.ETS2.Truck.LightsParkingOn      | Parking lights status                                 | true/false            |
| Nybo.ETS2.Truck.LightsBeamLowOn      | Low Beam lights status                                | true/false            |
| Nybo.ETS2.Truck.LightsBeamHighOn     | High Beam lights status                               | true/false            |
| Nybo.ETS2.Truck.LightsBeaconOn       | Beacon lights status                                  | true/false            |
| Nybo.ETS2.Truck.LightsBrakeOn        | Brake lights status                                   | true/false            |
| Nybo.ETS2.Truck.LightsReverseOn      | Reverse lights status                                 | true/false            |
| Nybo.ETS2.Truck.HazardLightsOn       | Hazard lights status                                  | true/false            |
| Nybo.ETS2.Truck.BlinkerLeftOn        | Left blinker status                                   | true/false            |
| Nybo.ETS2.Truck.BlinkerRightOn       | Right blinker status                                  | true/false            |

### Trailer States

| State ID                             | Description                                           | Available Values      |
|--------------------------------------|:-----------------------------------------------------:|----------------------:|
| Nybo.ETS2.Trailer.TrailerAttached    | Shows if a Trailer is currently attached               | true/false            |
| Nybo.ETS2.Trailer.TrailerName        | Name of the attached trailer                          | Text / "-"            |
| Nybo.ETS2.Trailer.TrailerChainType   | Type of trailer coupling (Single, Double, etc.)       | Text                  |
| Nybo.ETS2.Trailer.Wear               | Overall Trailer Damage                                 | Text (0-100%)         |
| Nybo.ETS2.Trailer.wearChassis        | Trailer Chassis Damage                                | Text                  |
| Nybo.ETS2.Trailer.wearWheels         | Trailer Wheels Damage                                 | Text                  |
| Nybo.ETS2.Trailer.Cargo              | Name of the loaded cargo                              | Text                  |
| Nybo.ETS2.Trailer.CargoID            | Internal ID of the cargo                              | Text                  |
| Nybo.ETS2.Trailer.CargoLoaded        | Is cargo currently loaded                             | true/false            |
| Nybo.ETS2.Trailer.CargoType          | Type of cargo                                         | Text                  |
| Nybo.ETS2.Trailer.CargoDamage        | Damage to the cargo                                   | Text (0-100%)         |
| Nybo.ETS2.Trailer.CargoMass          | Weight of the cargo (Unit based on settings)          | Text                  |

### Job States

| State ID                             | Description                                           | Available Values      |
|--------------------------------------|:-----------------------------------------------------:|----------------------:|
| Nybo.ETS2.Job.JobIncome              | Expected income (Converted to user currency)          | Text (e.g. $ 5,000)   |
| Nybo.ETS2.Job.JobRemainingTime       | Time left until deadline (Day D, HH:MM)               | Text / "Overdue"      |
| Nybo.ETS2.Job.JobSourceCity          | Starting City                                         | Text                  |
| Nybo.ETS2.Job.JobSourceCompany       | Shipping Company                                      | Text                  |
| Nybo.ETS2.Job.JobDestinationCity     | Target City                                           | Text                  |
| Nybo.ETS2.Job.JobDestinationCompany  | Target Company                                        | Text                  |

### Navigation States
    
| State ID                             | Description                                           | Available Values      |
|--------------------------------------|:-----------------------------------------------------:|----------------------:|
| Nybo.ETS2.Navigation.SpeedLimit      | Current speed limit (Unit based on settings)          | Number (Text)         |
| Nybo.ETS2.Navigation.SpeedLimitSign  | Dynamic speed limit sign image                        | Image                 |
| Nybo.ETS2.Navigation.estimatedDistance| Distance to target                                    | Text (e.g. 450 KM)    |
| Nybo.ETS2.Navigation.estimatedTime    | Estimated time of arrival (Day D, HH:MM)              | Text                  |

### TruckersMP States

| State ID                             | Description                                           | Available Values      |
|--------------------------------------|:-----------------------------------------------------:|----------------------:|
| Nybo.ETS2.TruckersMP.Servers         | Total number of servers online                        | Number (Text)         |
| Nybo.ETS2.TruckersMP.ServerName       | Name of the selected TMP server                       | Text                  |
| Nybo.ETS2.TruckersMP.ServerPlayers    | Current player count on selected server               | Number (Text)         |
| Nybo.ETS2.TruckersMP.ServerPlayerQueue| Players in queue for selected server                  | Number (Text)         |
| Nybo.ETS2.TruckersMP.APIOnline       | Status of the TruckersMP API                          | true/false            |

### Settings Reflection States
*These states show the current configuration of the plugin.*

| State ID                             | Description                                           | Available Values      |
|--------------------------------------|:-----------------------------------------------------:|----------------------:|
| Nybo.ETS2.Setting.currencyUnit       | Active currency code                                  | e.g. EUR, USD         |
| Nybo.ETS2.Setting.speedUnit          | Active speed unit                                     | Kilometer / Miles     |
| Nybo.ETS2.Setting.fluidUnit          | Active fluid volume unit                              | Liters / Gallons      |
| Nybo.ETS2.Setting.weightUnit         | Active weight unit                                    | Tons / Pounds / etc.  |
| Nybo.ETS2.Setting.tempUnit           | Active temperature unit                               | Celsius / Fahrenheit  |
| Nybo.ETS2.Setting.fluidConUnit       | Active consumption unit                               | e.g. Liters / KM      |
| Nybo.ETS2.Setting.timeFormat         | Active time format                                    | EU / US               |


## Actions

| Action ID                 | Description                                           |
|---------------------------|:-----------------------------------------------------:|
| setting_speed             | Toggles between Kilometer and Miles                   |
| setting_fluid             | Toggles through Fluid units (Liter / US Gal / UK Gal) |
| setting_fluidCon          | Toggles through Consumption units                     |
| setting_weight            | Toggles through Weight units (kg / tons / pounds)     |
| setting_temp              | Toggles between Celsius and Fahrenheit                |
| setting_time              | Toggles between EU and US Time Format                 |