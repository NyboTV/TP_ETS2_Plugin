# Settings

The plugin can be configured through Touch Portal's Settings tab or manually via the configuration files in the `config/` directory.

## Plugin Settings (Touch Portal)

These settings appear in the Touch Portal Desktop app once the plugin is installed.

| Setting Name        | Description                                                                 | Default |
|---------------------|-----------------------------------------------------------------------------|---------|
| Refresh_Interval    | Polling rate in milliseconds for game telemetry (Min: 50ms)                 | 200     |
| Currency            | Three-letter currency code for job income (e.g., EUR, USD, GBP)             | EUR     |
| AutoUpdate          | Enable or disable the automatic update check on startup                     | true    |
| OfflineMode         | If true, disables currency conversion to prevent errors when offline        | false   |
| TruckersMP_Server   | The Server ID for TruckersMP status updates (e.g. 1 for Simulation 1)       | 1       |
| PreRelease          | Enable checking for Pre-Release versions (Beta features)                    | false   |

---

## Configuration Files

For advanced users, you can manually edit the following files in `%appdata%/TouchPortal/plugins/ETS2_Dashboard/config/`:

### `cfg.json`
Stores core plugin behavior settings like `UpdateCheck`, `OfflineMode`, and the current `version`.

### `usercfg.json`
Stores user preferences for units and module toggles:
- **Basics**: Units for speed (Kilometer/Miles), fluids (Liter/Gallons), weight (Tons/Pounds), and temperature (Celsius/Fahrenheit).
- **Modules**: Allows disabling specific state tracking (e.g., `trailerStates`, `jobStates`) to save resources.

### `designs.json`
Allows you to customize the visual appearance of the dynamic gauges (Colors, Shapes, Patterns).

---

## Supported Currencies

The plugin uses an external API for currency conversion. Most world currencies are supported, including:

| Code | Name                 | Code | Name                 |
|------|----------------------|------|----------------------|
| EUR  | Euro                 | USD  | United States Dollar |
| GBP  | Pound Sterling       | CAD  | Canadian Dollar      |
| PLN  | Polish Złoty         | CZK  | Czech Koruna         |
| HUF  | Hungarian Forint     | SEK  | Swedish Krona        |
| CHF  | Swiss Franc          | JPY  | Japanese Yen         |

*Note: If `OfflineMode` is on, the plugin will assume 1:1 conversion or just show the base game currency.*

---

## Technical Units

- **Speed**: Kilometer per hour or Miles per hour.
- **Fluid**: Liters, US Gallons, or UK Gallons.
- **Weight**: Tons, US Tons, UK Tons, or Pounds (Lbs).
- **Temperature**: Celsius or Fahrenheit.
