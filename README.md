<h1 align="center">ETS2 Dashboard</h1>

<div align="center">
  <strong>ETS2 Dashboard Plugin for Touch Portal</strong><br>
  A Plugin to show your Euro Truck Dashboard onto your Tablet<br>
  <sub>Powered by trucksim-telemetry & Node.js || Available for Windows, Linux and MacOS</sub>
</div>

<br>

<div align="center">
  <!-- Version -->
  <a href="https://nybotv.github.io/TP_ETS2_Plugin/">
    <img src="https://badge.fury.io/gh/NyboTV%2FTP_ETS2_Plugin.svg" alt="website">
  </a>
  <!-- License -->
  <a href="LICENSE">
    <img alt="GitHub license" src="https://img.shields.io/github/license/NyboTV/TP_ETS2_Plugin">
  </a>
  <!-- Downloads total -->
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/releases">
    <img src="https://img.shields.io/github/downloads/NyboTV/TP_ETS2_Plugin/total.svg" alt="total download">
  </a>
  <!-- Downloads latest release -->
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/releases/latest">
    <img src="https://img.shields.io/github/downloads/NyboTV/TP_ETS2_Plugin/latest/total.svg" alt="latest download">
  </a>
</div>

<div align="center">
  <h3>
    <a href="https://nybotv.github.io/TP_ETS2_Plugin/">
      Website
    </a>
    <span> | </span>
    <a href="#features">
      Features
    </a>
    <span> | </span>
    <a href="CHANGELOG.md">
      Changelog
    </a><span> | </span>
    <a href="#setup-guide">
      Downloads
    </a>
    <span> | </span>
    <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki">
      Wiki
    </a>
    <span> | </span>
    <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Pages">
      Pages
    </a>
    <span> | </span>
    <a href="https://discord.gg/PvXJsxpGFe">
      Discord
    </a>
  </h3>
</div>
<br />

<h2 align="center">ETS2 Dashboard Plugin V2</h2>

## Features

- **Real-time Telemetry**: High-frequency data polling from ETS2/ATS.
- **Cross-Platform**: Support for Windows, Linux, and MacOS (Client-side).
- **Smart Installation**: Automatically detects your game path and installs the required SCS Telemetry DLL.
- **Native Gauges**: Generates Speed, RPM, and Fuel gauge images dynamically.
- **Job Info**: Live job data including income, destination, and deadlines.
- **Navigation**: Speed limits, estimated time, and distance.
- **Truck Information**: Detailed truck states, lights, damage, and wear.
- **TruckersMP**: Live information from TruckersMP servers.

If you want to see Planned Features, see [Roadmap](https://github.com/NyboTV/TP_ETS2_Plugin/projects/1)

<br>

## Download and Installation

| ![](https://raw.githubusercontent.com/wiki/ryanoasis/nerd-fonts/screenshots/v1.0.x/windows-pass-sm.png) |
|:---:|
| [![latest version](https://img.shields.io/github/downloads/NyboTV/TP_ETS2_Plugin/latest/total.svg)](https://github.com/NyboTV/TP_ETS2_Plugin/releases/latest) |

Want to see new features of the latest version? Please refer to [CHANGELOG](CHANGELOG.md).

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
- `UpdateCheck`: Enable or disable the automatic update check.

<br>

## Authors
- **Nico/Nybo** - Plugin Creator - [NyboTV](https://github.com/NyboTV)
- **Gargamosch** - Page Creator - [Discord: Gargamosch#6706]()

<br>

## Third Party Software
- **Funbit** - Original Telemetry Server - [Github](https://github.com/Funbit/ets2-telemetry-server)
- **mike-koch** - [OLD] Telemetry Server before 2.6.0 - [Github](https://github.com/mike-koch/ets2-telemetry-server)
- **PauloTNCunha** - [OLD] Telemetry Server since Version 2.6.0 - [Github](https://github.com/PauloTNCunha/TelemetryServer4)
- **TruckSim-Telemetry**: [NEW] Underlying Node.js library for reading memory. [Github](https://github.com/kniffen/TruckSim-Telemetry)

<br>

## Contributors
- **Gitago** - Help with Fixing the plugin! 
- **Pjiesco** - Help with updating the plugin!    

<br>

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2FNyboTV%2FTP_ETS2_Plugin.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2FNyboTV%2FTP_ETS2_Plugin?ref=badge_large)
