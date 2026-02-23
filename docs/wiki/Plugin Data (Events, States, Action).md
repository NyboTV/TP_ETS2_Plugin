# 📊 Plugin Data Reference (Events, States, Actions)

This page lists every single Event, State, and Action exposed by the Plugin to Touch Portal. 
When creating your buttons, you can search for the **State ID** directly in Touch Portal's "Values" or "Logic" menus.

---

## ⚡ Events (Triggers)

Events are instantaneous triggers that fire exactly when something happens in the game. You can use these in the **Values > "On Event"** tab of your Touch Portal buttons to start a flow (e.g., *When Engine turns on -> Play Sound*).

| Event Name | Description | Possible Values |
| :--- | :--- | :--- |
| **EngineOn** | Triggers when the truck engine is started or stopped. | `true` / `false` |
| **ElectricOn** | Triggers when the dashboard electronics/ignition is turned on or off. | `true` / `false` |
| **WipersOn** | Triggers when wipers are turned on or off. | `true` / `false` |
| **ParkBrakeOn** | Triggers when the parking brake is engaged or released. | `true` / `false` |
| **HazardLightsOn**| Triggers when hazard lights are toggled. | `true` / `false` |
| **TrailerAttached**| Triggers exactly when you connect or disconnect a trailer. | `true` / `false` |
| **CargoLoaded** | Triggers exactly when you load or unload your freight. | `true` / `false` |

---

## 📦 Data States

States hold current game data. They update continuously (e.g., every 200ms depending on your `Refresh_Interval`) and can be displayed as text on your buttons using the **Dynamic Text Updater**.

### 🎮 Game Settings & Connection
| State ID | Description | Output |
| :--- | :--- | :--- |
| `Nybo.ETS2.Game.ConnectedStatus` | Shows if the SDK is receiving telemetry | `true` / `false` |
| `Nybo.ETS2.Game.GameType` | The currently detected game | `ETS2` / `ATS` |
| `Nybo.ETS2.Game.IsPaused` | Is the game menu currently open? | `true` / `false` |
| `Nybo.ETS2.Setting.currencyUnit` | Selected settings currency code | `EUR`, `USD`, etc. |
| `Nybo.ETS2.Setting.speedUnit` | Selected speed unit | `Kilometer` / `Miles` |
| `Nybo.ETS2.Setting.fluidUnit` | Selected fluid volume unit | `Liters` / `Gallons` |
| `Nybo.ETS2.Setting.weightUnit` | Selected weight unit | `Tons` / `Pounds` etc. |
| `Nybo.ETS2.Setting.tempUnit` | Selected temperature unit | `Celsius` / `Fahrenheit` |
| `Nybo.ETS2.Setting.timeFormat` | Selected time format | `EU` / `US` |

### 🚚 The Truck
| State ID | Description | Output |
| :--- | :--- | :--- |
| `Nybo.ETS2.Truck.Truck_Make` | Truck Brand / Manufacturer | *Text* (e.g., `Scania`) |
| `Nybo.ETS2.Truck.Model` | Truck Model Name | *Text* |
| `Nybo.ETS2.Truck.Speed` | Current Speed *(Unit based on settings)* | *Text* (e.g., `85`) |
| `Nybo.ETS2.Truck.EngineRPM` | Current Engine RPM | *Text* (e.g., `1200`) |
| `Nybo.ETS2.Truck.Gear` | Current Gear *(D1, R1, N, 1, 2, etc.)* | *Text* |
| `Nybo.ETS2.Truck.Odometer` | Total distance driven on this chassis | *Text* (e.g., `45000`) |
| `Nybo.ETS2.Truck.CruiseControlSpeed`| Set Cruise Control Speed | *Text* |
| `Nybo.ETS2.Truck.CruiseControlOn` | Cruise Control status | `true` / `false` |
| `Nybo.ETS2.Truck.Retarder` | Retarder notch/step *(0, 1, 2, 3)* | *Text* |
| `Nybo.ETS2.Truck.EngineOn` | Engine running status | `true` / `false` |
| `Nybo.ETS2.Truck.ElectricOn` | Electronics/Ignition status | `true` / `false` |
| `Nybo.ETS2.Truck.WipersOn` | Wipers status | `true` / `false` |
| `Nybo.ETS2.Truck.ParkBrakeOn` | Parking Brake status | `true` / `false` |
| `Nybo.ETS2.Truck.MotorBrakeOn` | Engine Brake status | `true` / `false` |
| `Nybo.ETS2.Truck.Fuel` | Current Fuel amount *(Unit based on setting)* | *Text* |
| `Nybo.ETS2.Truck.FuelCapacity` | Maximum Fuel Tank Capacity | *Text* |
| `Nybo.ETS2.Truck.FuelConsumption` | Average Fuel Consumption | *Text* |
| `Nybo.ETS2.Truck.AdBlue` | Current AdBlue level | *Text* |
| `Nybo.ETS2.Truck.OilTemp` | Oil Temperature *(Unit based on setting)* | *Text* (e.g., `80 C°`) |
| `Nybo.ETS2.Truck.WaterTemp` | Water Temperature *(Unit based on setting)* | *Text* |

**Truck Damage (%)**
- `Nybo.ETS2.Truck.wearEngine`
- `Nybo.ETS2.Truck.wearTransmission`
- `Nybo.ETS2.Truck.wearCabin`
- `Nybo.ETS2.Truck.wearChassis`
- `Nybo.ETS2.Truck.wearWheels`

**Truck Lighting (true/false)**
- `Nybo.ETS2.Truck.LightsDashboardOn`
- `Nybo.ETS2.Truck.LightsParkingOn`
- `Nybo.ETS2.Truck.LightsBeamLowOn`
- `Nybo.ETS2.Truck.LightsBeamHighOn`
- `Nybo.ETS2.Truck.LightsBeaconOn`
- `Nybo.ETS2.Truck.LightsBrakeOn`
- `Nybo.ETS2.Truck.LightsReverseOn`
- `Nybo.ETS2.Truck.HazardLightsOn`
- `Nybo.ETS2.Truck.BlinkerLeftOn`
- `Nybo.ETS2.Truck.BlinkerRightOn`

### 🏗️ Trailer & Cargo
| State ID | Description | Output |
| :--- | :--- | :--- |
| `Nybo.ETS2.Trailer.TrailerAttached` | Is a Trailer currently connected? | `true` / `false` |
| `Nybo.ETS2.Trailer.TrailerName` | Name of the attached trailer body | *Text* |
| `Nybo.ETS2.Trailer.TrailerChainType`| Type of trailer coupling *(Single, Double, etc.)*| *Text* |
| `Nybo.ETS2.Trailer.CargoLoaded` | Is freight currently loaded inside? | `true` / `false` |
| `Nybo.ETS2.Trailer.Cargo` | Name of the active shipment | *Text* |
| `Nybo.ETS2.Trailer.CargoType` | Type of cargo | *Text* |
| `Nybo.ETS2.Trailer.CargoMass` | Total Weight *(Unit based on setting)* | *Text* |
| `Nybo.ETS2.Trailer.Wear` | Overall Trailer Damage % | *Text* (0-100%) |
| `Nybo.ETS2.Trailer.CargoDamage` | Damage to the freight inside % | *Text* (0-100%) |

### 🗺️ Navigation & World
| State ID | Description | Output |
| :--- | :--- | :--- |
| `Nybo.ETS2.World.Time` | Ingame clock time *(Day X, HH:MM)* | *Text* |
| `Nybo.ETS2.Driver.NextRestTime` | Time until next mandatory sleep | *Text* (HH:MM) |
| `Nybo.ETS2.Navigation.SpeedLimit` | Current road speed limit *(Unit based on setting)* | *Text* |
| `Nybo.ETS2.Navigation.estimatedDistance`| GPS distance to target | *Text* (e.g., `450 KM`) |
| `Nybo.ETS2.Navigation.estimatedTime` | GPS estimated time of arrival | *Text* |
| `Nybo.ETS2.Job.JobIncome` | Expected payout *(Converted to user currency)* | *Text* (e.g., `$ 5,000`) |
| `Nybo.ETS2.Job.JobRemainingTime` | Deadline time left | *Text* / `"Overdue"` |
| `Nybo.ETS2.Job.JobSourceCity` | Starting City | *Text* |
| `Nybo.ETS2.Job.JobDestinationCity` | Target City | *Text* |

### 🎨 Visual Dynamic Gauges
Instead of Text, these state IDs provide real-time updating Base64 image frames. *Refer to the [Pages documentation](Pages.md) for how to use these.*

| State ID | Description |
| :--- | :--- |
| `Nybo.ETS2.Gauges.SpeedGauge` | Circular/Square visual Speedometer |
| `Nybo.ETS2.Gauges.RPMGauge` | Circular/Square visual RPM Tachometer |
| `Nybo.ETS2.Gauges.FuelGauge` | Circular/Square visual Fuel Level Needle |
| `Nybo.ETS2.Navigation.SpeedLimitSign` | Emulates the red circle Euro speed limit sign |

### 🌐 TruckersMP Multiplayer Status
| State ID | Description | Output |
| :--- | :--- | :--- |
| `Nybo.ETS2.TruckersMP.APIOnline` | Is the public TruckersMP API reachable? | `true` / `false` |
| `Nybo.ETS2.TruckersMP.Servers` | Total amount of MP servers online | *Text* |
| `Nybo.ETS2.TruckersMP.ServerName` | Name of your selected ID *(e.g. Simulation 1)* | *Text* |
| `Nybo.ETS2.TruckersMP.ServerPlayers`| Amount of players online on that server | *Text* |
| `Nybo.ETS2.TruckersMP.ServerPlayerQueue`| Players currently waiting in queue | *Text* |

---

## 🔘 Plugin Actions

Actions can be assigned to Touch Portal buttons to change Plugin parameters on the fly without entering the settings menu. Place them in the "On Pressed" section.

| Action Internal ID | Description |
| :--- | :--- |
| `setting_speed` | Toggles the speed unit between `Kilometers` and `Miles` |
| `setting_fluid` | Toggles through `Liters` / `US Gallons` / `UK Gallons` |
| `setting_fluidCon` | Toggles through fuel consumption calculation formats |
| `setting_weight` | Toggles through weight formats (`kg` / `tons` / `pounds` / etc.) |
| `setting_temp` | Toggles temperature formats (`Celsius` / `Fahrenheit`) |
| `setting_time` | Toggles time formats (`EU 24h` / `US 12h`) |

*(Note: Triggering these actions visually updates your tablet instantly via State Synchronization).*

---
<br/>

<div align="center">
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Design">⬅️ Previous: Customizing Gauge Designs</a>
  &nbsp;&nbsp; | &nbsp;&nbsp;
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Issues">Next: Troubleshooting ➔</a>
</div>
