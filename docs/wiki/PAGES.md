# 📱 Dashboard Pages

The core of the **ETS2 Dashboard Plugin** is the ability to turn your tablet into an interactive secondary screen. You can either build a layout yourself or install pre-made dashboards from the community.

---

## 🏎️ Community Dashboards

<img src="https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/Pages/official/gargamosch/ats-ets2/preview/page1.jpg?raw=true" width="400">
<img src="https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/Pages/official/gargamosch/ats-ets2/preview/page2.jpg?raw=true" width="400">

The best way to get started is by installing a professional page layout created by our community members, like the **ATS & ETS2 Dashboard by Gargamosch**.

- 🔽 **Download Dashboard (.tpz2)**: [Click Here to Download](https://github.com/NyboTV/TP_ETS2_Plugin/blob/master/Pages/official/gargamosch/ats-ets2/ATS-ETS2.tpz2?raw=true)

*Instructions for Gargamosch’s Dashboard are available in multiple languages:*
- 🇬🇧 [English (EN)](https://raw.githubusercontent.com/NyboTV/TP_ETS2_Plugin/master/Pages/official/gargamosch/ats-ets2/readme/readme-en.pdf)
- 🇩🇪 [Deutsch (DE)](https://raw.githubusercontent.com/NyboTV/TP_ETS2_Plugin/master/Pages/official/gargamosch/ats-ets2/readme/readme-de.pdf)
- 🇪🇸 [Español (ES)](https://raw.githubusercontent.com/NyboTV/TP_ETS2_Plugin/master/Pages/official/gargamosch/ats-ets2/readme/readme-es.pdf)
- 🇫🇷 [Français (FR)](https://raw.githubusercontent.com/NyboTV/TP_ETS2_Plugin/master/Pages/official/gargamosch/ats-ets2/readme/readme-fr.pdf)
- 🇵🇹 [Português (PT)](https://raw.githubusercontent.com/NyboTV/TP_ETS2_Plugin/master/Pages/official/gargamosch/ats-ets2/readme/readme-pt.pdf)

*(Requires: Plugin Version 2.0+)*

---

## 🛠️ Building Your Own Page

If you prefer to build a custom dashboard from scratch, the plugin provides high-frequency telemetry states that you can bind to Touch Portal buttons.

### Adding Dynamic Text (e.g., Target City, Current Gear)
1. Select an empty Button in Touch Portal.
2. Go to the **Logic** tab on the left sidebar.
3. Click on **"Dynamic Text Updater"**.
4. Click the **"+"** icon inside the text field and select `TP_ETS2_Plugin`.
5. Browse the list and pick the state you want (e.g., `Nybo.ETS2.Job.JobDestinationCity`).
6. Click **Save**.

### Adding Visual Gauges (e.g., The Speedometer Visual)
Instead of text, some states generate interactive Base64 images (the needles move in real-time!).
1. Select an empty Button in Touch Portal.
2. Go to the **Values** tab.
3. Add a **"When plug-in state changes"** or **"When button state changes"** event trigger.
4. Set the trigger to watch the gauge state (e.g., `Nybo.ETS2.Gauges.SpeedGauge`).
5. Inside the "On Event" box, go to **Visuals** -> **"Change visuals by plug-in state"**.
6. Set it to **"Change the Icon with the value from the plug-in state"** and select the exact same gauge state again.

*Now, when the game updates the speed, the button's icon will instantly swap to the new image frame!*

---
<br/>

<div align="center">
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Settings">⬅️ Previous: Settings</a>
  &nbsp;&nbsp; | &nbsp;&nbsp;
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Design">Next: Customizing Gauge Designs ➔</a>
</div>
