![Release](https://img.shields.io/github/v/release/NyboTV/TP_ETS2_Plugin)
![Release Date](https://img.shields.io/github/release-date/NyboTV/TP_ETS2_Plugin)

![MIT License](https://img.shields.io/github/license/NyboTV/TP_ETS2_Plugin)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FNyboTV%2FTP_ETS2_Plugin.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2FNyboTV%2FTP_ETS2_Plugin)
![Language](https://img.shields.io/github/languages/top/NyboTV/TP_ETS2_Plugin)
[![Requirements Status](https://requires.io/github/NyboTV/TP_ETS2_Plugin/requirements.svg?branch=master)](https://requires.io/github/NyboTV/TP_ETS2_Plugin/requirements/?branch=master)

![Downloads](https://img.shields.io/github/downloads/NyboTV/TP_ETS2_Plugin/total)
![Downloads Latest](https://img.shields.io/github/downloads/NyboTV/TP_ETS2_Plugin/latest/total)

![Issues](https://img.shields.io/github/issues/NyboTV/TP_ETS2_Plugin)
![Pull Requests](https://img.shields.io/github/issues-pr/NyboTV/TP_ETS2_Plugin)

# [TP_ETS2_Plugin](https://github.com/NyboTV/Tp_ETS2_Plugin/releases/latest/download/ETS2_Dashboard.tpp)

- [TouchPortal ETS2 Dashboard Plugin](#tp_ets2_plugin)
  - [Features](#features)
  - [Installation](#how-to-install)
  - [Support](#support)
  - [States](#plugin-states)
    - [Game States](#game-states)
    - [World States](#world-states)
    - [Driver States](#driver-states)
    - [Gauge States](#gauge-states)
    - [Truck States](#truck-states)
    - [Trailer States](#trailer-states)
    - [Job States](#job-states)
    - [Navigation States](#navigation-states)
    - [TruckersMP States](#truckersmp-states)
  - [AutoUpdater](#autoupdater)
  - [Settings](#settings)
  - [Features Comming Soon](#features-comming-soon)
  - [Todo](#todo)
  - [Issues](#issue-list)
  - [Your Feature](#your-feature)
  - [Changelog](#changelog)
  - [Authors](#authors)
  - [License](#license)

## Features

- Autoupdater

- Shows your Speed, RPM and Gear
- Shows the Currect Speedlimit
- Shows if your Blinkers are turned on
- Wipers, Engine Status, Electric Status Support
- Job Informations

- MP Support

- And more!


## How to Install

You need the [Touch Portal](https://www.touch-portal.com) Application

Installing
NOTE: The Default Plugin installation path is dictated by Touch Portal here: %APPDATA%\TouchPortal\plugins

1. Download the [Plugin](#download) file.
2. Open Touch Portal go to the Wrench and click on "Import plug-in"
3. Choose your downloaded .tpp File and click "Open"
4. After the Import you will see "Plug-in imported successful". Click on "ok"
5. Now restart the Touch Portal app
`NOTE: Make sure you fully close Touch Portal using System Tray icon to exit`

6. After TP is open again, TP will ask you, if you want to trust the Plugin. Click on "Trust always".
7. Now the Plugin is installed and you can create your first ETS2 Page!

`NOTE: The Plugin has an Auto Updater. As long as NyboTV dont say "Update on your own" in the Discord Channel, you dont need to Update this Plugin!`

## Download

AutoUpdater => [Download](https://github.com/NyboTV/Tp_ETS2_Plugin/releases/latest/download/ETS2_Dashboard.tpp)

Manual Install => [Download](https://github.com/NyboTV/Tp_ETS2_Plugin/releases/latest/download/ETS2_Dashboard_AutoUpdater.tpp)

## Support
You can get directly Support on the official TP Discord!

If you want to request a Function:
Feel free to create a "Pull Request"

If you have an Problem with my Script:
I would appreachate if you create an "Issue" on my Github. But i can give Support on the TP Discord too ;) 

## How to use

Im Creating an Wiki for you ;) But its not Online yet! Please wait!

## Plugin States

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
| CargoLoaded               | Shows if Cargo is Loaded                              | true/false            |
| CargoType                 | Shows what kind of Cargo is Loaded                    | Dynamic Text          |
| CargoDamage               | Shows the Cargo Damage                                | Dynamic Text          |
| CargoMass                 | Shows the Cargo Weight                                | Dynamic Text          |


### Job States

| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| JobIncome                 | Shows the Income of the Current Job                   | Dynamic Text          |
| JobRemainingTime          | Shows the Remaining Time of the Current Job           | Dynamic Text          |
| JobSourceCity             | Shows the Source City of the Current Job              | Dynamic Text          |
| JobSourceCompany          | Shows the Source Company of the Current Job           | Dynamic Text          |
| JobDestinationCity        | Shows the Destination City of the Current Job         | Dynamic Text          |
| JobDestinationCompany     | Shows the Destination Company of the Current Job      | Dynamic Text          |
| JobEstimatedDistance      | Shows the Estimated Distance of the Current Job       | Dynamic Text          |

### Navigation States
    
| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| SpeedLimit                | Shows the Speedlimit of the Road                      | Dynamic Text          |
| SpeedLimitSign            | Shows the Speedlimit of the Road as an Image          | Dynamic Image         |

### TruckersMP States

| State                     | Description                                           | Available Values      |
|---------------------------|:-----------------------------------------------------:|----------------------:|
| Servers                   | Shows you how many Servers are Online                 | Dynamic Text          |
| ServerName                | Shows you the Server Name of the selected Server      | Dynamic Text          |
| ServerPlayers             | Shows you all Online Players of the selected Server   | Dynamic Text          |
| ServerPlayerQueue         | Shows you all Players in queue of the selected Server | Dynamic text          |
| APIOnline                 | Shows you if the TruckersMP API is Online             | true/false            |


## Settings

### Server list
Enter the Number for following Server:

### ETS Server list
    0 => EU Sim 1
    1 => EU SIM 2
    2 => EU SIM 3
    3 => US SIM
    4 => SGP SIM
    5 => EU ARC
    6 => EU PM 
    7 => EU PM ARC

### ATS Server list
    8 => EU SIM 
    9 => US SIM
    10 => US ARC

These Server list is getting Updated by myself. So it might be Possible that this list is NOT Up2Date. 


### Interval
You can set your Own Refresh interval:

	Faster => needs more performance
    slower => Less performance


### AutoUpdater 

Fully new System! Just Install the Plugin and Insert your Discord ID into the Window :)
To get your User ID read this: [How to get UserID](#how-to-get-userid)

Because of the API from Discord you have to be on my Plugin Discord.
https://discord.gg/PvXJsxpGFe

You dont want that? No problem! The Plugin will ask you on first Startup if you want to use it! Just click no!

If the UserID Window says "UserID is not Valid" (but you know it is valid) then just go to my Config.json file inside the plugin folder
(%appdata%/TouchPortal/plugins/ETS2_Dashboard)
and copy your UserID into the '""' behind the "userid"
it should looks like this: - "userid": "123456789" -

After that please send the Log to me (The Dev) so i can fix the issue.

### How to get UserID
How to Find your Discord User ID
To find your user ID in Discord, you first need to enable developer mode, and then simply right click / tap your name and select Copy ID. Here’s how to do that in more detail:

1. Open Discord.
2. Enable Developer Mode by navigating to Advanced > Developer Mode in Discord’s settings.
3. Discord Developer Mode Switch.
5. On any Discord Server: Find your username in the list of users, right click it, and then select Copy ID. You can also do this from chat if you can locate yourself there.
6. Discord Copy User ID.
7. Paste (Ctrl+V) the ID into the Window of my Plugin.

## Features comming soon

- Full ATS Support
- Support Bot (For Faster Support)
- Some small Details
- Some small Features
- More Dashboard Designs

## Todo

1. Adding Support for your Designs
2. ATS Support
3. Add some more Informations
4. (Request more Features and it will be added here ;)

## Issue List

- Hazard Lights are not Working
- some small Refresh issues (its taking sometimes longer)
- Wipers not working

## Your Feature

If you wanna your Design or your Feature inside this Plugin create an "Pull requests" with your Wish for an Design or Feature.
If you want an new Option like: Fuel Gauge please look into this file: [ETS2 Telemetry Server](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/src/server/Ets2TestTelemetry.json)
All of these Values can be imported into the Script!

If you want to see how this Plugin is made check out my Twitch Channel: https://www.twitch.tv/lizard_und_nybo


# Changelog
```
### Changelog 0.6.0
- Added an Autoupdater
- Fixed some small Script Bugs

### Changelog 0.5.0
- New Server System
- Added new States for more Details on the Dashboard
- Fixed some Bugs
- Some Script improvements

### Changelog 0.4.6
- Added new Log System for better support
- Added new Error handling. If the Server gets closed, it will restart on his own.


Changelog has been Added in Update 0.4.6
```


# Authors
- **Nico** - Plugin Creator - [NyboTV](https://github.com/NyboTV)

## License

This project is licensed under the MIT - see the [LICENSE](LICENSE) file for details

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FNyboTV%2FTP_ETS2_Plugin.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FNyboTV%2FTP_ETS2_Plugin?ref=badge_large)

