# V5.1.5 - Linux Compatibility Fix

This update brings a critical fix for Linux users experiencing crashes on startup.

## 🛠️ Build & System
- **Linux Native Dependency Bypass**: The plugin now intelligently detects Linux environments and falls back to pure JavaScript reading of the shared memory (`/dev/shm/SCSTelemetry`), bypassing the native C++ module. This permanently resolves the `invalid ELF header` crash on Linux while maintaining full compatibility.
