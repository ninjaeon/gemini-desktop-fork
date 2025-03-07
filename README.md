# Gemini Desktop (Unofficial Enhanced Fork)

[![GitHub release (with filter)](https://img.shields.io/github/v/release/ninjaeon/gemini-desktop-fork?include_prereleases)](https://github.com/ninjaeon/gemini-desktop-fork/releases)

This is an enhanced, unofficial desktop client for Google Gemini, built upon the original [Gemini Desktop](https://github.com/nekupaw/gemini-desktop) by [nekupaw](https://github.com/nekupaw). This fork leverages the Electron framework to provide a cross-platform experience and introduces several improvements and new features.

<p align="center">
  <img src="screenshot.gif" alt="Gemini Desktop Demo" height="600">
</p>

**⚠️ Important Notes & Warnings:**

*   **Experimental AI-Generated Code:** This fork includes experimental, AI-generated code modifications that are **not yet manually reviewed**. Exercise caution and use at your own risk.
*   **Untested Platform:**  **Mac builds are currently untested.** Feedback for Mac builds are highly encouraged!
*   **Security Considerations:** The experimental nature and the absence of thorough code review might introduce security vulnerabilities or bugs. This version is **not recommended for production use** until further testing and human validation of the code.
*   **Future Archival:** This fork is intended to be temporary. Once the features developed here are merged into the parent [Gemini Desktop](https://github.com/nekupaw/gemini-desktop) repository, this fork will be archived.

## Key Features & Enhancements (Over Original)

*   **Updated Electron:** Upgraded to Electron v34.3.0 (Chromium 132.0.6834.210) for enhanced performance and security.
*   **Enhanced User Interface and Window Management:**
    *   **Resizable Window:**  Customize the application window size by dragging its edges.
    *   **Drag to Move Window:** Reposition the window by dragging from the top bar.
    *   **Improved Tray Icon Behavior:** Tray icon clicks now toggle window visibility for more intuitive control.
    *   **Safe Window Positioning:** Ensures the window opens within screen boundaries on first launch and position reset.
    *   **"Reset Window Position" Toggle:** Quickly restore the window to its default location via the system tray menu.
    *   **Manual Update Checker:** Added a "Check for Updates" button in the system tray to manually trigger update checks.
    *   **Context Menu:** Enabled a right-click context menu for enhanced functionality:
        *   Copy/Paste (text and images)
        *   Search with Google
        *   Copying links
        *   Select All
*   **External Link Handling:** All links now open in your default external web browser, improving navigation and user experience.

## Release Notes (Latest: v1.0.7-fork.5)

*   **Enhanced User Interface:** This release focuses on improving the user interface and overall user experience with several window management enhancements:
    *   **Improved Tray Icon Behavior:** Tray icon clicks now toggle the main window's visibility for more intuitive control.
    *   **Safe Window Positioning:** Ensures the application window opens within screen boundaries on first launch and after reset.
    *   **Resizable Window:** Users can now resize the application window by dragging its edges.
    *   **"Reset Window Position" Toggle:** Added a system tray menu toggle to quickly reset the window position.
    *   **Drag to Move Window:** Implemented drag-and-drop functionality from the top bar to move the window.
*   **Dependency Updates:**
    *   Upgraded Electron to **v34.3.0**
    *   Upgraded **electron-context-menu to v4.0.5**
    *   Upgraded **electron-store to v10.0.1**

*   ([View changes on GitHub](https://github.com/ninjaeon/gemini-desktop-fork/compare/v1.0.7-fork.4...v1.0.7-fork.5))

**Previous Release Highlights:**

*   **v1.0.7-fork.4:** Removed console error reporting, reverted about button to original repository, and cleaned up license.
*   **v1.0.7-fork.3:** Keybinding fix.
*   **v1.0.7-fork.2:** Enhanced security by removing a web security attribute, added manual update checker.
*   **v1.0.7-fork.1:** Electron upgrade, external link handling, context menu features.

## Installation

**Windows:**

1. Download `Gemini-Desktop-Setup-1.0.7-fork.5.exe` (installer) or `Gemini-Desktop-1.0.7-fork.5-win.zip` (portable).
2. Installer: Run the `.exe` file.
3. Portable: Unzip and run `Gemini-Desktop.exe`.

**macOS (Untested):**

1. Download `Gemini-Desktop-1.0.7-fork.5-arm64.dmg` or `Gemini-Desktop-1.0.7-fork.5-arm64-mac.zip`.
2. DMG: Open the `.dmg` and drag the app to your Applications folder.
3. ZIP: Unzip and drag the app to your Applications folder.

**Linux:**

1. Download the appropriate file:
    *   `Gemini-Desktop-1.0.7-fork.5.AppImage` (most distributions)
    *   `gemini-desktop-1.0.7-fork.5.x86_64.rpm` (RPM-based)
    *   `gemini-desktop_1.0.7-fork.5_amd64.deb` (Debian-based)
2. If needed, make the file executable (e.g., `chmod +x Gemini-Desktop-1.0.7-fork.5.AppImage`).
3. Run the file.

## Contributing

Contributions are welcome! If you encounter any issues, especially on macOS or Linux, please report them on the [Issues](https://github.com/ninjaeon/gemini-desktop-fork/issues) page. If you are interested in contributing code, please open a pull request.

## Disclaimer

This project is not affiliated with or endorsed by Google. It is an independent, community-driven effort to enhance the Gemini user experience.

## Credits

*   Original Gemini Desktop Client: [nekupaw](https://github.com/nekupaw/gemini-desktop)
