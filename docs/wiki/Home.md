# ETS2 Dashboard Plugin Wiki

Welcome to the ETS2 Dashboard Wiki! This documentation will help you understand all the features, states, and actions available in the plugin so you can create beautiful and functional Touch Portal pages.

## Navigation

- [Plugin Data (Events, States, Actions)](DATA.md)
  - [Events](DATA.md#events)
  - [States](DATA.md#states)
    - [Game States](DATA.md#game-states)
    - [World States](DATA.md#world-states)
    - [Driver States](DATA.md#driver-states)
    - [Gauge States](DATA.md#gauge-states)
    - [Truck States](DATA.md#truck-states)
    - [Trailer States](DATA.md#trailer-states)
    - [Job States](DATA.md#job-states)
    - [Navigation States](DATA.md#navigation-states)
    - [TruckersMP States](DATA.md#truckersmp-states)
  - [Actions](DATA.md#actions)
- [Settings & Configuration](SETTINGS.md)
  - [Supported Currencies](SETTINGS.md#supported-currencies)
- [Dashboard Pages](PAGES.md)
  - [Your Page](PAGES.md#own-page)
  - [User Pages](PAGES.md#user-pages)

---

## How to create a Button

### Dynamic Text (e.g., Gear or Speed)
1. Click on a Button in Touch Portal.
2. Go to the **Logic** tab in the left sidebar.
3. Select **"Dynamic Text Updater"**.
4. Click the **"+"** and navigate to `TP_ETS2_Plugin` to find the state you want (e.g., `Nybo.ETS2.Truck.Gear`).
5. Click **Save**.

### Gauges & Images (e.g., Speedometer)
1. Click on a Button in Touch Portal.
2. Go to the **Values** tab.
3. Add a **"When plug-in state changes"** or **"When button state changes"** event.
4. Set it to trigger when the gauge state (e.g., `Nybo.ETS2.Gauges.SpeedGauge`) changes.
5. In the "On Event" flow, go to **Visuals** -> **"Change visuals by plug-in state"**.
6. Set it to **"Change the Icon with the value from the plug-in state"** and select your gauge state.
