# 🔧 Troubleshooting & Known Issues

If you are experiencing issues with the plugin or your dashboard pages, you've come to the right place. 

---

## 🚨 Common Problems

### 1. I don't see any Speedometer/Gauges, just white text
This means Touch Portal is trying to interpret the generated Base64 Image as plain text instead of rendering it visually. 
- **Fix**: In Touch Portal Designer, select your Gauge button. Ensure you have used the event **Values -> "Change visuals by plug-in state"** and set it to change the **Icon**. Do *not* put the Gauge State ID directly into the button's Text field.

### 2. Touch Portal is lagging or slow
The plugin sends a massive amount of data to Touch Portal very rapidly. If your Touch Portal Desktop application is stuttering or your tablet is freezing, the polling rate is too fast for your system or network.
- **Fix**: Open the Plugin Settings (`Settings -> Plugins -> TP_ETS2_Plugin`) and increase the **`Refresh_Interval`** from `50` to `200` or `500` milliseconds. This will slightly reduce gauge fluidity but drastically improve performance.

### 3. Game is running, but no data is appearing
Ensure that the Telemetry SDK was correctly installed during the initial setup prompt.
- **Fix**: The telemetry plugin (`scs-telemetry.dll`) must be placed inside your game's installation folder.
    1. Open your Touch Portal Plugins folder: `%appdata%\TouchPortal\plugins\TP_ETS2_Plugin\bin\scs-sdk-plugin\windows`
    2. Copy the file `scs-telemetry.dll`
    3. Navigate to your game installation (e.g. `C:\Program Files (x86)\Steam\steamapps\common\Euro Truck Simulator 2`)
    4. Go into the folder `bin\win_x64\plugins\` *(create the `plugins` folder if it does not exist)*
    5. Paste the `scs-telemetry.dll` inside.

---

## 🐛 Known (Minor) Bugs

- **Currency Switching Flicker**: Rapidly toggling between Currencies while a Job is active may cause the Income readout to flicker for a second while the internal conversion cache syncs.
- **Job Source/Destination Missing**: When you just finished a job and take a new one very rapidly, sometimes the Freight Market data takes a few seconds to update in the UI. 

---
<br/>

<div align="center">
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Plugin-Data-(Events,-States,-Action)">⬅️ Previous: Plugin Data Reference</a>
  &nbsp;&nbsp; | &nbsp;&nbsp;
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Home">Back to Home 🏠</a>
</div>
