# ⚙️ Configuration & Settings

The plugin is highly customizable. You can configure it directly through Touch Portal's Settings tab, or for advanced tweaks, by modifying the JSON configuration files manually.

---

## 📱 Plugin Settings (Touch Portal Desktop)

These settings appear in the Touch Portal Desktop app once the plugin is installed. To access them, click the gear icon ⚙️ in Touch Portal and go to `Settings -> Plugins -> TP_ETS2_Plugin`.

| Setting Name | Description | Default |
| :--- | :--- | :--- |
| **Refresh_Interval** | Polling rate in milliseconds for game telemetry.<br>*(Lower = Smoother gauges, but higher CPU usage. Min: 50ms)* | `50` |
| **Currency** | Three-letter currency code used to calculate your job income.<br>*(e.g., EUR, USD, GBP)* | `EUR/USD` |
| **AutoUpdate** | Enable or disable the automatic new version check on startup. | `true` |
| **OfflineMode** | If true, disables all internet API requests (Auto-Updater and TruckersMP server fetching) to prevent errors when you have no connection. | `false` |
| **TruckersMP_Server** | The Server ID used to fetch TruckersMP server statuses.<br>*(e.g., '1' for Simulation 1)* | `1` |
| **PreRelease** | Opt-in to receive notifications for Beta/Pre-Release versions. | `false` |

> [!TIP]
> **Currency**: If you use ATS, the default currency is USD. If you use ETS2, the default currency is EUR.
---

## 💱 Supported Currencies
The plugin uses an internal reference file (`config/currency.json`) to convert the base game currency into your preferred local currency based on static exchange rates.

*Commonly used codes:*
- `EUR` (Euro)
- `USD` (United States Dollar)
- `GBP` (Pound Sterling)
- `CAD` (Canadian Dollar)
- `PLN` (Polish Złoty)
- `CZK` (Czech Koruna)
- `CHF` (Swiss Franc)
- `JPY` (Japanese Yen)

---

## 📐 Technical Units (User Preferences)

The plugin remembers your preferred units independently of the game settings. You can toggle these values live on your tablet using the [Plugin Actions](Data_Reference.md#-plugin-actions).

- **Speed**: `Kilometers` or `Miles`
- **Fluid Volumes**: `Liters`, `US Gallons`, or `UK Gallons`
- **Weight**: `Kilograms`, `Tons`, `US Pounds`, or `UK Pounds`
- **Temperature**: `Celsius` or `Fahrenheit`
- **Time Format**: `EU (24h)` or `US (12h AM/PM)`

---
<br/>

<div align="center">
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Home">⬅️ Previous: Home</a>
  &nbsp;&nbsp; | &nbsp;&nbsp;
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Pages">Next: Creating Dashboard Pages ➔</a>
</div>
