# Design Guide - TP ETS2 Plugin

You can customize the appearance of the gauges by editing the file `config/designs.json`.

> [!TIP]
> **Live Reloading**: The plugin reloads the `designs.json` every **5 seconds**. You don't need to restart the plugin to see your changes!

## Configuration File: `config/designs.json`

Each gauge type (`speed`, `rpm`, `fuel`) can be configured independently.

```json
{
  "speed": {
    "backgroundColor": "#1a1a1a",
    "borderColor": "#333",
    "tickColor": "#fff",
    "textColor": "#eee",
    "titleColor": "#aaa",
    "unitColor": "#888",
    "needleColor": "#ff3333",
    "redZoneColor": "#cc0000",
    "fontFamily": "Arial",
    "shape": "circle",
    "backgroundPattern": "none",
    "needleShape": "classic",
    "showNumber": true,
    "showLabel": true,
    "titleFontScale": 1.0,
    "unitFontScale": 1.0,
    "numberFontScale": 1.0,
    "scaleFontScale": 1.0,
    "tickWidthMajor": 3,
    "tickWidthMinor": 1,
    "needleWidthScale": 1.0
  },
  "rpm": { ... },
  "fuel": { ... }
}
```

## Options

### Colors
You can use Hex Codes (e.g., `#ff0000`), Names (`red`), or RGB (`rgb(255, 0, 0)`).

*   **backgroundColor**: Background color of the gauge.
*   **borderColor**: Color of the outer ring/border and the needle cap.
*   **tickColor**: Color of the marks (lines).
*   **textColor**: Color of the numbers on the scale.
*   **titleColor**: Color of the title (e.g., "SPEED").
*   **unitColor**: Color of the unit text (e.g., "km/h").
*   **needleColor**: Color of the needle.
*   **redZoneColor**: Color of the RPM red zone (only for RPM gauge).

### Visibility & Labels
*   **showNumber**: Set to `false` to hide the digital value in the center.
*   **showLabel**: Set to `false` to hide the Title and Unit text.

### Accessibility & Scaling
*   **fontFamily**: Font to use (e.g., "Arial", "Consolas").
*   **titleFontScale**: Multiplier for the Title font size.
*   **unitFontScale**: Multiplier for the Unit font size.
*   **numberFontScale**: Multiplier for the central digital value.
*   **scaleFontScale**: Multiplier for the numbers on the gauge scale.
*   **tickWidthMajor**: Thickness of the main ticks.
*   **tickWidthMinor**: Thickness of the smaller ticks.
*   **needleWidthScale**: Multiplier for the needle thickness and center cap.

### Style
*   **shape**: Shape of the gauge (`"circle"` or `"square"`).
*   **backgroundPattern**: Pattern for the background (`"none"`, `"grid"`, `"carbon"`).
*   **needleShape**: Shape of the needle (`"classic"` or `"sport"`).
