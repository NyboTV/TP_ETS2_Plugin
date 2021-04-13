# TP_ETS2_Plugin

### Features

- Shows your Speed, RPM and Gear
- Shows the Currect Speedlimit
- Shows if your Blinkers are turned on
- Wipers, Engine Status, Electric Status Support

- MP Support

- And more!

How to Install
=============

You need "Touch Portal" and its Pro Version! 

Just download the ".tpp" File. It is located in the "Release/Plugin" Folder.
Go into your Touch Portal, Click on the Wrench and click on "Import Plugin".



### How to use

Create a new Page in your Touch Portal and create a new Button and go to "Events" Tab. Then add an "Dynamic Text Updater" and click on the "+". Search for the Value you want to Display and have Fun!:

If you want to setup an "State" then you have to do something like this: 
[Example](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/.github/img/1618332385969.png)

If you want to Setup an "Image/Icon" then you have to do something like this:
[Example](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/.github/img/1618192488295.png)


### Game States: ()

	Status_Connected =      "Disconnected | Connected"
    Game =                  "Nothing Found! | ETS2 | ATS"

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
    
### Game Icons:


    wawdad
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

- More User Friendly Interface in Touch Portal
- Some small Details
- Some small Features
- More Dashboard Designs

If you wanna your Design or your Feature inside this Plugin create an "Pull requests" with your Wish for an Design or Feature.

If you want to see how this Plugin is made check out my Twitch Channel: https://www.twitch.tv/lizard_und_nybo
