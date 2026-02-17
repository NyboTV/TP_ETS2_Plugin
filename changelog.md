# V5.1.2 - High-Performance Gauges & Telemetry Expansion

This major update focuses on extreme performance optimizations and a massive expansion of the telemetry data available to Touch Portal.

## 🚀 Performance & Optimization
- **Extreme Render Throttling**: Massively reduced CPU and network load by implementing smart update rules.
  - **Fluid Gauges (Speed/RPM)**: High-priority updates (10 FPS) for smooth visuals.
  - **Technical Gauges**: Slow-changing values (Temps, Fluids, Pressure) update at 1-5 second intervals.
  - **Pedal Monitor**: Limited to 0.5 FPS (2s) to save bandwidth for mission-critical data.
- **Background Caching**: Static gauge elements (scales, ticks, labels) are now cached, reducing per-frame rendering load by ~90%.
- **Parallel Processing**: Telemetry mappers now run in parallel, minimizing latency.
- **StateManager Overhaul**: Replaced recursive deep-cloning with lightweight snapshots.

## 📈 New Features & Gauges
- **Comprehensive Gauge Suite**: Added 6 new visual round instruments:
  - **Air Pressure** (Bar)
  - **Water & Oil Temperature** (°C/°F)
  - **Oil Pressure** (Bar)
  - **Battery Voltage** (V)
  - **AdBlue Level** (%)
- **Pedal Monitor**: Real-time visual bars for Throttle, Brake, and Clutch.
- **Advanced Telemetry Tracking**:
  - **Economics**: Last Toll, Ferry, and Train payment amounts.
  - **Truck Tech**: Differential ratios, auxiliary light status (Front/Roof), and brake temperatures.
  - **Trailer Mastery**: Support for up to 3 individual trailers with detailed wear tracking (Chassis/Wheels/Body).
  - **World Context**: Day of week, absolute arrival times (ETA), and map scale tracking.

## 🛠️ Build & System
- **Intelligent Versioning**: Automated decimal roll-over logic (e.g., 5.0.9 -> 5.1.0).
- **Parity Build**: Unified packaging for Windows, Linux, and macOS.
- **State Reliability**: Fixed several consistency issues where data wouldn't reset after detaching trailers or finishing jobs.

---
**Note for Layout Creators**: We are currently hitting the practical limits of Touch Portal's network API. The implemented throttling is essential for stability. For best results, use the provided [Full Page Export](https://github.com/NyboTV/TP_ETS2_Plugin/tree/master/Pages) templates.
