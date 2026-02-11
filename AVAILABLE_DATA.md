# Unused Telemetry Data

This is a list of data available from the TruckSim Telemetry SDK that is currently **NOT** mapped or used in the Touch Portal Plugin.

## 🚚 Truck Constants & Tech
- **Shifter Technicals**: `Forward Gear Ratios` (Array), `Reverse Gear Ratios` (Array).
- **H-Shifter Details**: `SlotGear`, `SlotHandlePosition`, `SlotSelectors`. (Base slots are mapped, but these technical internals are available).
- **Physical Wheel Info**: `Radius`, `Simulated`, `Powered`, `Liftable`, `Steerable` (Per wheel).

## 🛠️ Diagnostics
- **Detailed Damage**: Per-wheel damage (The collective average is mapped).

## 💼 Job & Events
- **Metadata IDs**: `City Destination ID`, `Company Destination ID`, `City Source ID`, `Company Source ID`. (Mapped for current job, but available in events).
- **Event Results**:
    - **Job Cancelled**: `Started`, `Finished`, `Penalty`.
    - **Job Delivered**: `Earned XP`, `Revenue`, `AutoLoaded`, `AutoParked`.

## 🎮 Raw Controls
> [!NOTE]
> **Raw Controls (User vs. Game Input)**:
> - **User Input**: Die direkten Rohwerte deiner Hardware (Lenkrad, Pedale, Tastatur). Wenn du das Gaspedal 50% durchdrückst, ist dieser Wert 0.5. (Aktuell gemappt).
> - **Game Input**: Der Wert, den das Spiel nach Anwendung aller Filter (Deadzone, Sensitivität, nicht-lineare Kurven, Lenkhilfen) tatsächlich für die Simulation nutzt. Es ist das, was der LKW im Spiel "fühlt". (Aktuell **nicht** gemappt).
