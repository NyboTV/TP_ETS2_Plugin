# Project is still in Progress. But it might take some Time until a new Version comes out

# TP_ETS2_Plugin

### Features

- Shows your Speed, RPM and Gear
- Shows the Currect Speedlimit
- Shows if your Blinkers are turned on
- Wipers, Engine Status, Electric Status Support
- Job Informations

- MP Support

- And more!

How to Install
=============

You need "Touch Portal" and its Pro Version! 

Just download the ".tpp" File. It is located in the "Release/Plugin" Folder.
Go into your Touch Portal, Click on the Wrench and click on "Import Plugin".

### Support
You can get directly Support on the official TP Discord!

If you want to request a Function:
Feel free to create a "Pull Request"

If you have an Problem with my Script:
I would appreachate if you create an "Issue" on my Github. But i can get Support on the 

### How to use

Create a new Page in your Touch Portal and create a new Button and go to "Events" Tab. Then add an "Dynamic Text Updater" and click on the "+". Search for the Value you want to Display and have Fun!:

If you want to setup an "State" then you have to do something like this: 
[Example](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/.github/img/1618332385969.png)

If you want to Setup an "Image/Icon" then you have to do something like this:
[Example](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/.github/img/1618192488295.png)


### Game States: ()

	Status_Connected =      "Disconnected | Connected"
    Game =                  "Nothing Found! | ETS2 | ATS"

    SleepTime =             "Shows how long do you have until you have to sleep" (Idk yet in which format this is)

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
    
    BlinkerRightOn =        "false | true"
    BlinkerLeftOn =         "false | true"
    HazardLightsOn =        "false | true"
    
    LightsParkingOn =       "Off | On"
    LightsBeamLowOn =       "Off | On"
    LightsBeamHighOn =      "Off | On"
    LightsBeaconOn =        "Off | On"
    LightsBrakeOn =         "Off | On"
    LightsDashboardOn =     "Off | On"
    
    TrailerAttached =       "Not Attached | Attached"
    TrailerMass =           "Shows the Mass from a Trailer in Ton

    JobSourceCity =         "Shows the Job Source City
    JobSourceCompany =      "Shows the Job Source Company"
    JobDestinationCity =    "Shows the Job Destination City
    JobDestinationCompany = "Shows the Job Destination Company"

## New Game States in 0.5.0

    serverVersion =     "Shows the Server Version"
    pause =             "false | true"
    truckType =         "Shows the Truck Model Name"
    parkBrakeOn =       "false | true"
    motorBrakeOn =      "false | true"
    batteryLow =        "false | true"
    oilLow =            "false | true"
    waterTempHigh =     "false | true"
    adblueLow =         "false | true"
    fuelLow =           "false | true"
    trailerBodyType =   "Shows the Trailer Model name"
    cargoLoaded =       "false | true"
    cargo =             "Shows the loaded Cargo"
    cargoDamage =       "Shows the Cargo Damage"
    

### Game Icons:

    SpeedGauge =            Shows your Speed as an Image
    RPMGauge =              Shows your RPM as an Image    
    FuelGauge =             Shows your speed as an Image


### TruckersMP States:

    Servers =               "(Depends How many Servers are Online)"     [Value is an Number!]
    ServerName =            "(Selected Server Name)"                    [You can Select the Server in Settings! Server List is down below!]
    ServerPLayers =         "(How Many Players are Online)"              [Value is an Number!]
    ServerPlayerQueue =     "(Shows how many Players are in queue)"     [Value is an Number!]


### Server list:
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


### Settings
You can set your Own Refresh interval:

	Faster => needs more performance
    slower => Less performance

If you changed the Refresh interval you have to restart Touch Portal

You can setup the Server you want to Display.

    See Server List which Number is which Server
    If you changed it you have to restart Touch Portal

## Features comming soon:

- ATS Support
- Some small Details
- Some small Features
- More Dashboard Designs

## Todo: 

1. ATS Support
2. Add some more Informations
3. (Request more Features and it will be added here ;)

## Issue List:

- Hazard Lights are not Working
- some small Refresh issues (its taking sometimes longer)

If you wanna your Design or your Feature inside this Plugin create an "Pull requests" with your Wish for an Design or Feature.

If you want to see how this Plugin is made check out my Twitch Channel: https://www.twitch.tv/lizard_und_nybo


# Changelog

### Changelog 0.5.0
- New Server System
- Added new States for more Details on the Dashboard
- Fixed some Bugs
- Some Script improvements

### Changelog 0.4.6
- Added new Log System for better support
- Added new Error handling. If the Server gets closed, it will restart on his own.


Changelog has been Added in Update 0.4.6
