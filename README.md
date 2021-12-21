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
6. Now you have to go into my Plugins Folder by pressing "Win+R" and type in: "%appdata%/Touchportal/plugins/ETS2_Dashboard"
7. Now go into "Server" and execute "Ets2Telemetry.exe". 
8. Now it should appear a Window. Press on Install.
9. Now restart the Touch Portal app
`NOTE: Make sure you fully close Touch Portal using System Tray icon to exit`
`NOTE: If you get an Window with an Warning Message: "ANother ETS2/ATS Telemtry Server instance is already running", Just Close it. It is just an Reminder. Ignore it. 

6. After TP is open again, TP will ask you, if you want to trust the Plugin. Click on "Trust always".
7. Now the Plugin is installed and you can create your first ETS2 Page!

`NOTE: The Plugin has an Auto Updater. As long as NyboTV dont say "Update on your own" in the Discord Channel, you dont need to Update this Plugin!`

## Download

AutoUpdater => [Download](https://github.com/NyboTV/Tp_ETS2_Plugin/releases/latest/download/ETS2_Dashboard.tpp)

Manual Install => [Download](https://github.com/NyboTV/Tp_ETS2_Plugin/releases/latest/download/ETS2_Dashboard_AutoUpdater.tpp)

## Support

You can get support directly on the official TP Discord!

If you would like to request a feature:
Feel free to make a "pull request"

If you have an issue with my script:
I'd be happy if you create an "issue" on my Github. But I can also give support in the TP Discord ;) 

## How to use

I'll create a wiki for you ;) But it's not online yet! Please wait!

For the available value "Dynamic Text" just create a "Dynamic Text Updater". (The "NextRestTime" is also a "Dynamic Text").

For "true/false" you need a "When the plug-in state (state) 'changes to' '(true/false)'".

For "Dynamic image" you need to use a "If the plug-in state (any state) 'does not change to' (just leave it blank)". 
and then "Change the 'Icon' with the value from the plug-in status 'SpeedGauge/RPMGauge/etc'"

Don't understand a single word? Just download the sample page and have a look at it

Download it here: [Download](https://github.com/NyboTV/TP_ETS2_Plugin/raw/master/Build/Releases/Dashboards/Example.tpz)
Just click on "Manage Page..." in the Touch Portal and then on "Import Page".


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

All settings are now available in the API! When you get a window asking "Do you want to use the Discord Bot feature", just click "Yes".


### AutoUpdater 

Completely new system! Just click "Yes" on the question: "Do you want to use the Discord Bot feature".
To get your user ID, read this: [How to get UserID](#how-to-get-userid).

Because of Discord's API, you need to be on my plugin Discord.
https://discord.gg/PvXJsxpGFe

Don't want to do that? No problem! The plugin will ask you if you want to use it the first time you start it! Just click no! But if you want to use the AutoUpdater function, then you have to set it to "True" in the Config! Go into the plugins folder (found in %appdata%/TouchPortal/plugins), then go into the "config.json" and set "autoupdates" to "true" 

If the UserID window shows "UserID is not Valid" (but you know it is valid), then just go to my config.json file in the plugin folder
(%appdata%/TouchPortal/plugins/ETS2_Dashboard)
and copy your UserID into the '""' behind "userid".
It should look like this: - "userid": "123456789" -

After that, please send the log to me (The Dev) so I can fix the problem.

### How to get UserID

Wait a minute. Why do I even need your UserID and why do you need to be in my Discord?
Well. Discord does not support sending messages to an unknown user. If you are not in my Discord or are friends with my bot (and it is not possible to add a bot as a friend).
Then the bot can't send you a message. So you can't change the settings or install new themes! That's why I need your UserID. To send YOU the messages and not a random user of the guild.

To find your user ID in Discord, you first need to enable developer mode and then simply right click / tap on your name and select Copy ID. Here you can learn how to do that in detail:

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

1. ATS Support
2. Add some more Informations
3. (Request more Features and it will be added here ;)

## Issue List

- Hazard Lights are not Working correctly

## Your Feature

If you want your design or feature in this plugin, create a "pull request" with your wishes for a design or feature.
If you want a new option, please look in this file: [ETS2 Telemetry Server](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/src/server/Ets2TestTelemetry.json)
All these values can be imported into the script!

If you want to see how this plugin is created, check out my Twitch Channel: https://www.twitch.tv/xnybo


# Changelog
```


### Changelog 1.4.3
- Bug Fix

### Changelog 1.4.2
- BETA: Refresh Rate Setting

### Changelog 1.4.1
- Bug Fix

### Changelog 1.4.0
- API finally on Public Server

### Changelog 1.3.8
- Skipping IP Grabbing Function for the API

### Changelog 1.3.7
- Bug Fix

### Changelog 1.3.6
- New API IP Refresh System + Bug Fixes

### Changelog 1.3.5
- New API System Update

### Changelog 1.3.4
- Community Design Support Release

### Changelog 1.3.3
- new API System + Bug Fixes

Please report any Bugs or Issues! Have fun using it!

### Changelog 1.3.2
- The TMP Settings was not working correctly. The Plugin Crashed if TMP was used.

### Changelog 1.3.1
- Bug Fixes

### Changelog 1.2.1
- Working on 1.3.0 

### Changelog 1.2.0
- Added Action Button to Change from US to EU / EU to US Location (Ex: MPH, Tons)

### Changelog 1.1.0
- Edited the ReadMe
- Added new States
- Fixed some States

### Changelog 1.0.0
- Added Fully new AutoUpdater
- Fully Reworked the Plugin

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

# Thanks to
- **Gitago** - He is an BIG help for fixing my Plugin! - He is Testing my Plugin and is reporting me what is not working
- **Pjiesco** - He is an BIG help for Updating my Plugin! - He fully Updated my API for the Plugin for me!

## License

This project is licensed under the MIT - see the [LICENSE](LICENSE) file for details

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FNyboTV%2FTP_ETS2_Plugin.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FNyboTV%2FTP_ETS2_Plugin?ref=badge_large)

