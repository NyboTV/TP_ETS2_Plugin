# TP_ETS2_Plugin

### Features

- Shows your Speed, RPM and Gear
- Shows the Currect Speedlimit
- Shows if your Blinkers are turned on
- Wipers, Engine Status, Electric Status Support
- And more!

How to Install
=============

Just download the ".tpp" File. It is located in the "Release/Plugin" Folder.
Go into your Touch Portal, Click on the Wrench and click on "Import Plugin".



### How to use

Create a new Page in your Touch Portal and create a new Button and go to "Events" Tab. Then add an "Dynamic Text Updater" and click on the "+". Search for your Text and have Fun!:
Now you have multiple ways to Display your Stuff.

One: (The easiest)

[![](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/.github/img/1618192488295.png)](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/.github/img/1618192488295.png)

Do something like this. It will display an Speedometer. Same with RPM.


Two:
You can setup your own images. Example: if RPM is 1500 Show this Pic and so on. Its kinda difficult but its Possible. If you wanna know how come to the Touch Portal Discord and ask in the #ets2-dashboard channel.




Values: (Value1 | Value2 | ...)

	Status_Connected =      "Disconnected | Connected"
    Game =                  "Nothing Found! | ETS2 | ATS"

    Speed =                 "0 (up to ∞)"
    RPM =                   "0 (up to ∞)"
    Gear =                  "N (up to ∞) | D1 (up to ∞)"

    Fuel =                  "0 (up to ∞)"
    FuelCap =               "0 (up to ∞)"

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
    
    
    CruiseControlOn =       "false | true"
    CruiseControlSpeed =    "0 (up to ∞)"
    Speedlimit =            "0 | 10 | 20 | 30 | ..."


Features comming soon:

- More Dashboard Designs
- MP Support
- Some small Details
- Some small Features

If you wanna your Design or your Feature inside this Plugin create an "Pull requests" with your Wish for an Design or Feature.

If you want to see how this Plugin is made check out my Twitch Channel: https://www.twitch.tv/lizard_und_nybo
