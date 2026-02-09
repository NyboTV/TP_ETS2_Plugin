<h1 align="center">ETS2 Dashboard</h1>

<div align="center">
  <strong>ETS2 Dashboard Plugin for Touch Portal</strong><br>
  A Plugin to show your Euro Truck Dashboard onto your Tablet<br>
  <sub>Powered by trucksim-telemetry & Node.js</sub>
</div>

<br>

<div align="center">
  <!-- License -->
  <a href="LICENSE">
    <img alt="GitHub license" src="https://img.shields.io/github/license/NyboTV/TP_ETS2_Plugin">
  </a>
  <!-- Downloads latest release -->
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/releases/latest">
    <img src="https://img.shields.io/github/downloads/NyboTV/TP_ETS2_Plugin/latest/total.svg" alt="latest download">
  </a>
</div>

<br>

## Features

- **Real-time Telemetry**: High-frequency data polling from ETS2/ATS.
- **Cross-Platform**: Support for Windows, Linux, and MacOS (Client-side).
- **Smart Installation**: Automatically detects your game path and installs the required SCS Telemetry DLL.
- **Native Gauges**: Generates Speed, RPM, and Fuel gauge images dynamically.
- **Job Info**: Live job data including income, destination, and deadlines.
- **Navigation**: Speed limits, estimated time, and distance.

<br>

## Installation

### Prerequisites
- **Touch Portal** installed and running.
- **Euro Truck Simulator 2** or **American Truck Simulator** installed.

### Setup Guide

1. **Download** the latest `.tpp` file from the [Releases Page](https://github.com/NyboTV/TP_ETS2_Plugin/releases).
2. Open **Touch Portal**, go to **Settings** -> **Plug-ins** -> **Import Plug-in**.
3. Select the downloaded `.tpp` file.
4. **Trust the Plugin**: If prompted "Do you trust this plugin?", select **"Trust Always"**.
5. **Restart Touch Portal**: This is crucial for the plugin to initialize correctly.
6. **First Run Setup**:  
   - Upon restart, the plugin will launch a Setup Wizard.
   - It will attempt to **auto-detect** your ETS2/ATS installation path.
   - Confirm the installation of the **SCS Telemetry DLL** (`scs-telemetry.dll`).
   - Choose your preferred units (km/h vs mph) to install the default Dashboard Page.

### Manual DLL Installation (If Auto-Install fails)
If the setup cannot find your game folder:
1. Copy the `scs-telemetry.dll` from the plugin folder (`%appdata%/TouchPortal/plugins/TP_ETS2_Plugin/bin/scs-sdk-plugin/windows/`).
2. Paste it into your game's plugin directory:  
   `[Steam Library]/steamapps/common/Euro Truck Simulator 2/bin/win_x64/plugins/`

<br>

## Configuration

The plugin creates a `config/cfg.json` file where you can tweak:
- `refreshInterval`: Polling rate in milliseconds (Default: 200).
- `OfflineMode`: Disable currency conversion if internet is unavailable.

<br>

## Documentation & Wiki

For detailed information on available States, Events, and Actions, please visit our **[GitHub Wiki](https://github.com/NyboTV/TP_ETS2_Plugin/wiki)** or check the `docs` folder included in this repository.

<br>

## Credits

- **NyboTV**: Plugin Creator
- **TruckSim-Telemetry**: Underlying Node.js library for reading memory.

<br>

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
