---
trigger: always_on
---

## Knowledge Management & Self-Update

- **Saving Information**: If new critical information is discovered or the user requests to "remember" something, save it in a new file in `.agent/tmp/`.
- **File Format**:
  - Path: `.agent/tmp/(YYYY-MM-DD_HH-mm)-[type].md` (e.g., `2024-01-25_07-35-main.md`)
  - Content: Copy the **full content** of the respective rule file (`main.md`, `setup.md`, etc.), then append or update the new information within that copy.
- **Purpose**: This allows the user to identify which rule file needs updating and easily apply the changes.

## TP_ETS2_Plugin specific rules

- **Cross-Compilation (Windows/Linux/Mac)**:
  - This project uses a custom Node.js script (`scripts/build.js`) wrapping `pkg` to generate Touch Portal plugin packages (`.tpp`).
  - **CRITICAL**: Compiling the Linux/Mac versions requires WSL (`Windows Subsystem for Linux`). The script must wipe the local Windows `node_modules` and explicitly run `npm install` inside WSL (`wsl --exec bash -lic "npm install"`) to ensure the correct Linux-native C++ binaries (specifically `trucksim-telemetry`) are downloaded. This prevents "invalid ELF header" crashes.
  - Intermediate directories (`build` and `dist`) should be wiped upon successful compilation. Final artifacts go exclusively into the `Releases` folder.
  - The build script console output should focus on premium UI with animated spinners; suppressing noisy raw logs (like `npm install` and `tsc`).

- **Changelog & Release Notes**:
  - The `CHANGELOG.md` file is identical to the text used in the automated GitHub Releases. 
  - It must be kept strictly in **English**, as the user base is international.
  - It must be written from a **user perspective**, entirely avoiding deep technical jargon strings like "WSL", "Node", "ELF header", or `npm install`.

- **Extensive Logging Coverage**:
  - Widespread use of `logger.info(...)` and `logger.debug(...)` is strictly mandated across core services (`main.ts`, `TouchPortalService.ts`, `TelemetryService.ts`, `SetupService.ts`).
  - This granular logging must trace plugin startup, configuration reads, remote connection states, Touch Portal action payloads, Touch Portal setting updates, and internal module logic (retries, paths). This ensures maximum debuggability when end-users report crashes.

- **Architecture & State Management (Performance)**:
  - The `StateManager` (`src/services/StateManager.ts`) uses a strict diffing cache (`changedUpdatesOnly`). Data is ONLY sent to Touch Portal if the stringified value has actually changed, preventing network floods.
  - Telemetry payloads are massive. `StateManager.update()` intentionally uses shallow copies (`{ ...data.truck }`) for top-level objects instead of recursive deep-cloning to maintain 10 FPS real-time rendering performance.
  - All mapping logic must reside in dedicated `*Mapper` files (`src/mappers/`) which extract data from the raw telemetry snapshot and return `{ id: string, value: string }[]` arrays for Touch Portal.

- **Settings & UI Synchronization**:
  - TouchPortal dynamically pushes settings config changes via the `Settings` event, which the `TouchPortalService` syncs directly to `configService`.
  - Conversely, when actions are pressed on the tablet (e.g., `setting_speed`), `TouchPortalService` toggles the internal configuration, and the changes are immediately broadcasted back to the tablet via `mapSettingsStates()` to update visual UI toggles without waiting for the next telemetry poll.
