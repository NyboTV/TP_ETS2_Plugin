# ETS2 Dashboard Plugin Data

## Events

### Truck Events

| Event                     | Description                                           | Available Values      |
|---------------------------|:--------------------------------------------------------:|----------------------:|
| EngineOn                  | Executes a user-defined function if the condition is met | true/false            |
| ElectricOn                | Executes a user-defined function if the condition is met | true/false            |
| WipersOn                  | Executes a user-defined function if the condition is met | true/false            |
| ParkBrakeOn               | Executes a user-defined function if the condition is met | true/false            |
| FuelWarningOn             | Executes a user-defined function if the condition is met | true/false            |
| AdBlueWarningOn           | Executes a user-defined function if the condition is met | true/false            |
| AirPressureWarningOn      | Executes a user-defined function if the condition is met | true/false            |
| OilPressureWarningOn      | Executes a user-defined function if the condition is met | true/false            |
| WaterTempWarningOn        | Executes a user-defined function if the condition is met | true/false            |
| BatteryVoltageWarningOn   | Executes a user-defined function if the condition is met | true/false            |
| BlinkerLeftActive         | Executes a user-defined function if the condition is met | true/false            |
| BlinkerRightActive        | Executes a user-defined function if the condition is met | true/false            |
| HazardLightsOn            | Executes a user-defined function if the condition is met | true/false            |
| LightsDashboardOn         | Executes a user-defined function if the condition is met | true/false            |
| TrailerAttached           | Executes a user-defined function if the condition is met | true/false            |
| CargoLoaded               | Executes a user-defined function if the condition is met | true/false            |


## States

### Game States

| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| ConnectedStatus           | Shows if you are Connected to an Game or not          | true/false            |
| GameType                  | Shows the Game that is Captured by the Server         | ETS2/ATS              |
| IsPaused                  | Shows you if the Game is Paused                       | true/false            |

### World States

| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| Time                      | Shows you the current ingame Time                     | Dynamic Text          |

### Driver States

| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| NextRestTime              | Shows you when the Driver has to Sleep                | Dynamic (Countdown)   |

### Gauge States

| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| SpeedGauge                | Shows your Speed as an Image                          | Dynamic Image         |
| RPMGauge                  | Shows your RPM as an Image                            | Dynamic Image         |
| FuelGauge                 | Shows your speed as an Image                          | Dynamic Image         |

### Truck States

| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| Truck_Make                | Shows you the Model Creator                           | Dynamic Text          |
| Model                     | Shows you the Model of the Truck                      | Dynamic Text          |
| CruiseControlSpeed        | Shows you the Cruise Control Speed                    | Dynamic Text          |
| CruiseControlOn           | Shows you if the Cruise Control is turned on          | true/false            |
|                           |                                                       |                       |
| Speed                     | Shows your current Speed                              | Dynamic Text          |
| EngineRPM                 | Shows your current RPM                                | Dynamic Text          |
| Gear                      | Shows your current Gear                               | Dynmaic Text          |
|                           |                                                       |                       |
| EngineOn                  | Shows if your Engine is on                            | true/false            |
| ElectricOn                | Shows if your Electric is on                          | true/false            |
| WipersOn                  | Shows if your Wipers are on                           | true/false            |
| ParkBrakeOn               | Shows if your ParkBrake is on                         | true/false            |
| MotorBrakeOn              | Shows if your MotorBrake is on                        | true/false            |
| Retarder                  | Shows on which Step the Retarder is                   | Dynamic Text [1,2,3]  |
|                           |                                                       |                       |
| Fuel                      | Shows your current Fuel                               | Dynamic Text          |
| AdBlue                    | Shows your current AdBlue                             | Dynamic Text          |
| AirPressure               | Shows your current Air Pressure                       | Dynamic Text          |
| OilTemp                   | Shows your current Oil Temperature                    | Dynamic Text          |
| WaterTemp                 | Shows your current Water Temperature                  | Dynamic Text          |
| BatteryVoltage            | Shows your current Battery Voltage                    | Dynamic Text          |
|                           |                                                       |                       |
| FuelCapacity              | Shows your Truck Fuel Capacity                        | Dynamic Text          |
|                           |                                                       |                       |
| FuelWarningOn             | Shows if your Fuel is Low                             | true/false            |
| AdBlueWarningOn           | Shows if your AdBlue is Low                           | true/false            |
| AirPressureWarning        | Shows if your Air Pressure is Low                     | true/false            |
| AirPressureEmergencyOn    | Shows if your Air Pressure is critical Low            | true/false            |     
| OilPressureWarning        | Shows if your Oil Pressure is critical Low/High       | true/false            |
| WaterTempWarningOn        | Shows if your Water Temperature is High               | true/false            |
| BatteryVoltageWarningOn   | Shows if your BatteryVoltage is low                   | true/false            |
|                           |                                                       |                       |
| BlinkerLeftActive         | Shows if your Blinker Left is Active                  | true/false            |
| BlinkerRightActive        | Shows if your Blinker Right is Active                 | true/false            |
| BlinkerLeftOn             | Shows if your Blinker Left is On                      | true/false            |
| BlinkerRightOn            | Shows if your Blinker Right is On                     | true/false            |
| HazardLightsOn            | Shows if your Hazard Lights are On                    | true/false            |
|                           |                                                       |                       |
| Wear Engine               | Shows the Damage of your Engine                       | Dynamic Text          |
| Wear Transmission         | Shows the Damage of your Transmission                 | Dynamic Text          |
| Wear Cabin                | Shows the Damage of your Cabin                        | Dynamic Text          |
| Wear Chassis              | Shows the Damage of your Chassis                      | Dynamic Text          |
| Wear Wheels               | Shows the Damage of your Wheels                       | Dynamic Text          |
|                           |                                                       |                       |
| LightsDashboardValue      | Shows the Value of the Dashboard                      | Dynamic Text          |
| LightsDashboardOn         | Shows if the Dashboard Light is On                    | true/false            |
| LightsParkingOn           | Shows if the Parking Lights are On                    | true/false            |
| LightsBeamLowOn           | Shows if the Beam Low Lights are On                   | true/false            |
| LightsBeamHighOn          | Shows if the Beam High Lights are On                  | true/false            |
| LightsAuxFrontOn          | Shows if the Fronts Extra Lights are On               | true/false            |
| LightsAuxRoofOn           | Shows if the Roof Extra Lights are On                 | true/false            |
| LightsBeaconOn            | Shows if the Beacons are On                           | true/false            |
| LightsBrakeOn             | Shows if the Brake Lights are On                      | true/false            |
| LightsReverseOn           | Shows if the Reverse Lights are On                    | true/false            |

### Trailer States

| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| TrailerAttached           | Shows if an Trailer is Attached                       | true/false            |
| TrailerName               | Shows the Trailer Name (If one has an Name)           | Dynamic Text          |
| TrailerChainType          | Shows what kind of Trailer is it (Single, Double)     | Dynamic Text          |
|                           |                                                       |                       |
| Cargo                     | Shows loaded Cargo                                    | Dynamic Text          |
| Cargo ID                  | Shows loaded Cargo ID                                 | Dynamic Text          |
|                           |                                                       |                       |
| CargoLoaded               | Shows if Cargo is Loaded                              | true/false            |
| CargoType                 | Shows what kind of Cargo is Loaded                    | Dynamic Text          |
| CargoDamage               | Shows the Cargo Damage                                | Dynamic Text          |
| CargoMass                 | Shows the Cargo Weight                                | Dynamic Text          |
|                           |                                                       |                       |
| Wear Trailer              | Shows the Damage of the Trailer                       | Dynamic Text          |
| Wear Chassis              | Shows the Damage of the Trailer Chassis               | Dynamic Text          |
| Wear Wheels               | Shows the Damage of the Trailer Wheels                | Dynamic Text          |


### Job States

| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| JobIncome                 | Shows the Income of the Current Job                   | Dynamic Text          |
| JobRemainingTime          | Shows the Remaining Time of the Current Job           | Dynamic Text          |
| JobSourceCity             | Shows the Source City of the Current Job              | Dynamic Text          |
| JobSourceCompany          | Shows the Source Company of the Current Job           | Dynamic Text          |
| JobDestinationCity        | Shows the Destination City of the Current Job         | Dynamic Text          |
| JobDestinationCompany     | Shows the Destination Company of the Current Job      | Dynamic Text          |

### Navigation States
    
| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| SpeedLimit                | Shows the Speedlimit of the Road                      | Dynamic Text          |
| SpeedLimitSign            | Shows the Speedlimit of the Road as an Image          | Dynamic Image         |
| EstimatedDistance         | Shows the Estimated Distance                          | Dynamic Text          |
| EstimatedTime             | Shows the Estimated Time                              | Dynamic Text          |

### TruckersMP States

| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| Servers                   | Shows you how many Servers are Online                 | Dynamic Text          |
| ServerName                | Shows you the Server Name of the selected Server      | Dynamic Text          |
| ServerPlayers             | Shows you all Online Players of the selected Server   | Dynamic Text          |
| ServerPlayerQueue         | Shows you all Players in queue of the selected Server | Dynamic text          |
| APIOnline                 | Shows you if the TruckersMP API is Online             | true/false            |



## Actions

| Action                    | Description                                           |
|---------------------------|:-----------------------------------------------------:|
| Open/Close Settings       | Opens or Closes the Settings Menu                     |