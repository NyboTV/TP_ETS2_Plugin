# 🚀 Community Update: New Telemetry & Features

This update brings a massive expansion of available telemetry data and new visual components to the plugin. Here is a breakdown of what's new:

## 📊 New Gauges & Visualizations
I have added **7 new visualizations** to give you more insight into your truck's status:
- **Technical Gauges**:
    - **Air Pressure**: Real-time brake system pressure.
    - **Water Temperature**: Monitoring engine cooling.
    - **Oil Temperature & Pressure**: Keep an eye on engine health.
    - **Battery Voltage**: Electrical system status.
    - **AdBlue Level**: Monitoring your emission fluid.
- **Pedal Monitor**: A new bar-graph style display showing your live input for Throttle, Brake, and Clutch in one view.
- **Customization**: All new gauges are fully customizable in `designs.json` (Colors, Fonts, Scales).

## 🚛 Enhanced Job & Cargo Data
The `JobMapper` has been rebuilt to provide every detail about your current assignment:
- **Job Status**: Track if you are `OnJob`, if it's a `Special Transport`, and which `Market` (Freight, External, etc.) you are working in.
- **Advanced Cargo Info**:
    - Detailed `Cargo Name` and `Internal ID`.
    - `Cargo Loaded`: See if your trailer is actually full or empty.
    - `Cargo Damage`: Real-time percentage of damage to your load.
- **Masses & Units**: Everything is automatically converted to your preferred units (Tons, US Tons, UK Tons, or Pounds):
    - Total `Cargo Mass`.
    - `Unit Count` and `Unit Mass`.

## 👨‍✈️ Driver & Logistics
New fields to help you manage your driving sessions:
- **Fatigue System**: 
    - `Next Rest Time`: HH:MM until you need a break.
    - `Sleep State`: Dynamic text status (e.g., "Ausgeruht", "Müde", "Dringend Pause!").
- **Financials**: `Last Fine Amount` and `Fine Offence` reason are now available.
- **Input Monitor**: Digital percentage display for Throttle, Brake, and Clutch.

## ⚙️ Game Metadata
Enhanced system info for better troubleshooting and transparency:
- **Versions**: Track Game Version (Major/Minor), SDK Telemetry Version, and Plugin Revision.
- **Timestamps**: Raw data for Simulation Time, Render Time, and Telemetry Time for sync analysis.
- **Scaling**: Active simulation scale detection.

## 🧭 Navigation Improvements
- **Live ETA**: See your absolute arrival time (e.g., "Tue 14:45") based on in-game time.
- **Route Progress**: A new percentage indicator shows how much of your journey is completed.

## 🏗️ Multi-Trailer Support
- **Up to 3 Trailers**: Full support for B-Doubles, HCTs, and Triples.
- **Enhanced Metadata**: Individual Brand, Name, and License Plate info for each trailer.
- **Detailed Wear**: Track wear for Chassis, Wheels, and Body separately.

## 🚛 Enhanced Truck Data
- **Technical Precision**: Differential Ratio and Retarder Steps are now mapped.
- **Improved Indicators**: New `BlinkerState` combines all turn signal logic.
- **Identification**: Truck License Plates and Countries are now visible.
- **Auxiliary Lighting**: Full support for Front and Roof auxiliary lights.

## 🌍 World & Environment
- **Refined Organization**: Map Scale and Multiplayer Offset moved to World States.
- **Improved Time**: New `DayOfWeek` and absolute `NextRestStopTime` states.
- **Cleaner UI**: Added a standalone `TimeHHMM` state for simplified dashboards.

## ⚙️ Plugin Settings
- **Transparency**: You can now see and use the current `Refresh Interval`, `TruckersMP Server` status, and `Offline Mode` directly in Touch Portal as states.

## 🧹 Maintenance & Cleanups
- **Legacy Cleanup**: Removed outdated "Usage" states (CPU/Memory/Storage) that are no longer part of the plugin's scope.
- **Accuracy**: Fixed several telemetry property names and unit conversions (e.g., PSI to Bar) for 100% data accuracy.

---
*Check out the updated documentation and the new `designs.json` to start customizing your dashboard!*

## 📜 New State IDs (Raw List)
Here is a list of all new IDs you can use in Touch Portal:

### Trailer (N = 1, 2, or 3)
- `Nybo.ETS2.Trailer.Count` (Total attached trailers)
- `Nybo.ETS2.Trailer.TotalWear` (Average wear of all trailers)
- `Nybo.ETS2.Trailer.N.Attached` (Boolean)
- `Nybo.ETS2.Trailer.N.Name` / `Nybo.ETS2.Trailer.N.Brand`
- `Nybo.ETS2.Trailer.N.LicensePlate` / `Nybo.ETS2.Trailer.N.WearChassis`

### Truck
- `Nybo.ETS2.Truck.BlinkerState` ("Left", "Right", "Hazard", "Off")
- `Nybo.ETS2.Truck.LicensePlate` / `Nybo.ETS2.Truck.LicensePlateCountry`
- `Nybo.ETS2.Truck.DifferentialRatio` / `Nybo.ETS2.Truck.RetarderStepCount`
- `Nybo.ETS2.Truck.LightsAuxFrontOn` / `Nybo.ETS2.Truck.LightsAuxRoofOn`

### World
- `Nybo.ETS2.World.TimeHHMM` / `Nybo.ETS2.World.DayOfWeek`
- `Nybo.ETS2.World.NextRestStopTime`
- `Nybo.ETS2.World.MapScale` / `Nybo.ETS2.World.MultiplayerOffset`

### Settings
- `Nybo.ETS2.Setting.RefreshInterval`
- `Nybo.ETS2.Setting.TruckersMPServer`
- `Nybo.ETS2.Setting.OfflineMode`
- `Nybo.ETS2.Setting.AutoUpdate`

### Navigation
- `Nybo.ETS2.Navigation.ETA`
- `Nybo.ETS2.Navigation.Progress`
- `Nybo.ETS2.Navigation.estimatedTime` (Now in format: 0D, 00:00)

### Game
- `Nybo.ETS2.Game.VersionMajor`
- `Nybo.ETS2.Game.VersionMinor`
- `Nybo.ETS2.Game.TelemetryVersion`
- `Nybo.ETS2.Game.PluginRevision`
- `Nybo.ETS2.Game.Scale`
- `Nybo.ETS2.Game.TimeTelemetry`
- `Nybo.ETS2.Game.TimeSimulation`
- `Nybo.ETS2.Game.TimeRender`
- `Nybo.ETS2.Game.TimeMultiplayerOffset`

### Driver
- `Nybo.ETS2.Driver.NextRestTime`
- `Nybo.ETS2.Driver.SleepState`
- `Nybo.ETS2.Driver.LastFineAmount`
- `Nybo.ETS2.Driver.LastFineOffence`
- `Nybo.ETS2.Driver.InputThrottle`
- `Nybo.ETS2.Driver.InputBrake`
- `Nybo.ETS2.Driver.InputClutch`

### Gauges (Images)
- `Nybo.ETS2.Gauges.AirPressureGauge`
- `Nybo.ETS2.Gauges.WaterTempGauge`
- `Nybo.ETS2.Gauges.OilTempGauge`
- `Nybo.ETS2.Gauges.OilPressureGauge`
- `Nybo.ETS2.Gauges.BatteryGauge`
- `Nybo.ETS2.Gauges.AdBlueGauge`
- `Nybo.ETS2.Gauges.PedalMonitor`

### Job & Cargo
- `Nybo.ETS2.Job.OnJob`
- `Nybo.ETS2.Job.SpecialJob`
- `Nybo.ETS2.Job.Market`
- `Nybo.ETS2.Job.PlannedDistance`
- `Nybo.ETS2.Job.Cargo`
- `Nybo.ETS2.Job.CargoID`
- `Nybo.ETS2.Job.CargoMass`
- `Nybo.ETS2.Job.CargoLoaded`
- `Nybo.ETS2.Job.CargoDamage`
- `Nybo.ETS2.Job.UnitCount`
- `Nybo.ETS2.Job.UnitMass`
