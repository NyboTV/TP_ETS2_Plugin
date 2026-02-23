# 🎨 Customizing Gauge Designs

Don't like the default colors of the Speedometer or RPM gauge? The plugin allows you to completely restyle the visual gauges by editing the local `config/designs.json` file.

> [!TIP]
> **Live Reloading**: The plugin reloads the `designs.json` every **5 seconds**. You don't need to restart the plugin to see your color changes happen in real-time on your tablet!

---

## 📝 The `designs.json` File

Located in `%appdata%/TouchPortal/plugins/ETS2_Dashboard/config/designs.json`.

You can configure each gauge type (`speed`, `rpm`, `fuel`) independently. Below is an example block:

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
...
```

---

## 🖌️ Available Style Properties

You can use standard Hex Codes (e.g., `#ff0000`), HTML Color Names (`red`), or RGB (`rgb(255, 0, 0)`) for all color values.

### Colors
| Property | Description |
| :--- | :--- |
| **`backgroundColor`** | Background color of the gauge face. |
| **`borderColor`** | Color of the outer ring/border and the needle cap. |
| **`tickColor`** | Color of the marker lines (ticks). |
| **`textColor`** | Color of the numbers along the circular scale. |
| **`titleColor`** | Color of the title text (e.g., "SPEED"). |
| **`unitColor`** | Color of the unit text (e.g., "km/h"). |
| **`needleColor`** | Color of the needle. |
| **`redZoneColor`** | Color of the RPM red zone *(Only available for the `rpm` gauge object)*. |

### Shapes & Patterns 
| Property | Valid Values | Description |
| :--- | :--- | :--- |
| **`shape`** | `"circle"`, `"square"` | Defines the outer shape of the gauge icon. |
| **`backgroundPattern`**| `"none"`, `"grid"`, `"carbon"` | Overlays a subtle texture onto the gauge background. |
| **`needleShape`** | `"classic"`, `"sport"` | Changes the geometric shape of the moving needle. |
| **`showNumber`** | `true`, `false` | Toggles the large digital value in the center bottom. |
| **`showLabel`** | `true`, `false` | Toggles the Title and Unit text visibility. |

### Typography & Sizing

You can tweak the thickness and fonts of elements using these multipliers:

- **`fontFamily`**: The system font to use (e.g., "Arial", "Consolas").
- **`titleFontScale`**: Multiplier for the Title font size *(e.g. 1.5)*.
- **`unitFontScale`**: Multiplier for the Unit font size.
- **`numberFontScale`**: Multiplier for the central digital value size.
- **`scaleFontScale`**: Multiplier for the numbers plotted on the gauge scale.
- **`tickWidthMajor`**: Thickness of the main, large ticks *(pixels)*.
- **`tickWidthMinor`**: Thickness of the smaller, intermediate ticks *(pixels)*.
- **`needleWidthScale`**: Multiplier for the needle thickness and its center cap.

---
<br/>

<div align="center">
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Pages">⬅️ Previous: Dashboard Pages</a>
  &nbsp;&nbsp; | &nbsp;&nbsp;
  <a href="https://github.com/NyboTV/TP_ETS2_Plugin/wiki/Plugin-Data-(Events,-States,-Action)">Next: Plugin Data Reference ➔</a>
</div>
