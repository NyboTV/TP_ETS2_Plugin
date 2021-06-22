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
  - [States](#game-states)
    - [Game States](#game-states)
    - [TruckersMP States](#truckersmp-states)
    - [Game Icons](#game-icons)
  - [AutoUpdater](#autoupdater)
  - [Settings](#settings)
  - [Features Comming Soon](#features-comming-soon)
  - [Todo](#todo)
  - [Issues](#issue-list)
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

Manual Install => [Download](https://github.com/NyboTV/Tp_ETS2_Plugin/releases/latest/download/ETS2_Dashboard.tpp)

## Support
You can get directly Support on the official TP Discord!

If you want to request a Function:
Feel free to create a "Pull Request"

If you have an Problem with my Script:
I would appreachate if you create an "Issue" on my Github. But i can get Support on the 

## How to use

Create a new Page in your Touch Portal and create a new Button and go to "Events" Tab. Then add an "Dynamic Text Updater" and click on the "+". Search for the Value you want to Display and have Fun!:

If you want to setup an "State" then you have to do something like this: 
![Example](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/.github/img/1618332385969.png)

If you want to Setup an "Image/Icon" then you have to do something like this:
![Example](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/.github/img/1618192488295.png)


### Game States

    Status_Connected =      "Disconnected | Connected"
    Game =                  "Nothing Found! | ETS2 | ATS"
    serverVersion =     "Shows the Server Version"

    SleepTime =             "Shows how long do you have until you have to sleep" (Idk yet in which format this is)
    pause =             "false | true"

    Speed =                 "0 (up to ∞)"   [Value is an Number!]
    RPM =                   "0 (up to ∞)"   [Value is an Number!]
    Gear =                  "N (up to ∞) | D1 (up to ∞)"

    Fuel =                  "0 (up to ∞)"   [Value is an Number!]
    FuelCap =               "0 (up to ∞)"   [Value is an Number!]
    
    CruiseControlOn =       "false | true"
    CruiseControlSpeed =    "0 (up to ∞)"
    Speedlimit =            "0 | 10 | 20 | 30 | ..."   [Value is an Number!]

    Engine =                "Off | On" (On 0.2.5 and lower its: "Off | Started")
    Electric =              "Off | On"
    Wipers =                "Off | On"
    
    parkBrakeOn =       "false | true"
    motorBrakeOn =      "false | true"
    batteryLow =        "false | true"
    oilLow =            "false | true"
    adblueLow =         "false | true"
    fuelLow =           "false | true"
    waterTempHigh =     "false | true"
    
    BlinkerRightOn =        "false | true"
    BlinkerLeftOn =         "false | true"
    HazardLightsOn =        "false | true"
    
    LightsParkingOn =       "Off | On"
    LightsBeamLowOn =       "Off | On"
    LightsBeamHighOn =      "Off | On"
    LightsBeaconOn =        "Off | On"
    LightsBrakeOn =         "Off | On"
    LightsDashboardOn =     "Off | On"
    
    truckType =         "Shows the Truck Model Name"
    
    TrailerAttached =       "Not Attached | Attached"
    TrailerMass =           "Shows the Mass from a Trailer in Ton
    trailerBodyType =   "Shows the Trailer Model name"

    cargoLoaded =       "false | true"
    cargo =             "Shows the loaded Cargo"
    cargoDamage =       "Shows the Cargo Damage"

    JobSourceCity =         "Shows the Job Source City
    JobSourceCompany =      "Shows the Job Source Company"
    JobDestinationCity =    "Shows the Job Destination City
    JobDestinationCompany = "Shows the Job Destination Company"


## TruckersMP States

    Servers =               "(Depends How many Servers are Online)"     [Value is an Number!]
    ServerName =            "(Selected Server Name)"                    [You can Select the Server in Settings! Server List is down below!]
    ServerPLayers =         "(How Many Players are Online)"              [Value is an Number!]
    ServerPlayerQueue =     "(Shows how many Players are in queue)"     [Value is an Number!]

## Game Icons

    SpeedGauge =            Shows your Speed as an Image
    RPMGauge =              Shows your RPM as an Image    
    FuelGauge =             Shows your speed as an Image



## Autoupdater

You can now activate the "Autoupdater" function.
Just go to your Plugin Settings and set the "Auto updater" to "true"

### Autoupdater Features

    - Auto Updater => Automaticly downloads the latest version of the Plugin and installs it.
    - TP path => If you installed TP on the default Path then dont touch this Setting! If you have it installed on another drive then copy the .exe Files Path and paste it in there like the Path inside the Setting.


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

If you changed the Refresh interval you have to restart Touch Portal

You can setup the Server you want to Display.

    See Server List which Number is which Server
    If you changed it you have to restart Touch Portal


### Auto Updater / Auto restart / Tp Path
Read [AutoUpdater](#autoupdater)


## Features comming soon

- ATS Support
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

If you wanna your Design or your Feature inside this Plugin create an "Pull requests" with your Wish for an Design or Feature.

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

