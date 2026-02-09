# Design Guide - TP ETS2 Plugin V2

You can customize the appearance of the gauges by editing the file `config/designs.json`.
The changes take effect after restarting the plugin.

## Configuration File: `config/designs.json`

```json
{
  "gauge": {
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
    "needleShape": "classic"
  }
}
```

## Options

### Colors
You can use Hex Codes (e.g., `#ff0000`), Names (`red`), or RGB (`rgb(255, 0, 0)`).

*   **backgroundColor**: Background color of the gauge.
*   **borderColor**: Color of the outer ring/border.
*   **tickColor**: Color of the marks (lines).
*   **textColor**: Color of the numbers (Speed, RPM).
*   **titleColor**: Color of the title (e.g., "RPM").
*   **unitColor**: Color of the unit text (e.g., "km/h").
*   **needleColor**: Color of the needle.
*   **redZoneColor**: Color of the RPM red zone (high RPM area).

### Style
*   **fontFamily**: Font to use (must be installed on the system, e.g., "Arial", "Consolas", "Verdana").
*   **shape**: Shape of the gauge.
    *   `"circle"`: Standard round gauge.
    *   `"square"`: Modern rounded-square gauge.
*   **backgroundPattern**: Texture/Pattern for the background.
    *   `"none"`: Solid color.
    *   `"grid"`: Technical grid pattern.
    *   `"carbon"`: Dark carbon-fiber style pattern.
*   **needleShape**: Shape of the needle.
    *   `"classic"`: Straight, simple needle.
    *   `"sport"`: Tapered, sharper needle styling.
