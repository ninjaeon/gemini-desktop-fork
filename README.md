```markdown
# Gemini Desktop (Unofficial Enhanced Fork)

[![GitHub release (with filter)](https://img.shields.io/github/v/release/ninjaeon/gemini-desktop-fork?include_prereleases)](https://github.com/ninjaeon/gemini-desktop-fork/releases)

This is an enhanced, unofficial desktop client for Google Gemini, built upon the original [Gemini Desktop](https://github.com/nekupaw/gemini-desktop) by [nekupaw](https://github.com/nekupaw). This fork leverages the Electron framework to provide a cross-platform experience and introduces several improvements and new features.

<p align="center">
  <img src="screenshot.gif" alt="Gemini Desktop Demo" height="600">
</p>

**⚠️ Important Notes & Warnings:**

*   **Experimental AI-Generated Code:** This fork includes experimental, AI-generated code modifications that are **not yet manually reviewed**. Exercise caution and use at your own risk.
*   **Untested Platforms:**  **Mac and Linux builds are currently untested.** Windows is the only verified working platform. Feedback and contributions for these platforms are highly encouraged!
*   **Security Considerations:** The experimental nature and the absence of thorough code review might introduce security vulnerabilities or bugs. This version is **not recommended for production use** until further testing and validation.
*   **Unconfirmed Updater:** The automatic updater's functionality is currently unconfirmed due to recent changes. It will be fully tested in the next release.
*   **Future Archival:** This fork is intended to be temporary. Once the features developed here are merged into the parent [Gemini Desktop](https://github.com/nekupaw/gemini-desktop) repository, this fork will be archived.

## Key Features & Enhancements (Over Original)

*   **Updated Electron:** Upgraded to Electron v33.3.0 (Chromium 130.0.6723.152) for enhanced performance and security.
*   **External Link Handling:** All links now open in your default external web browser, improving navigation and user experience.
*   **Context Menu:** Enabled a right-click context menu for:
    *   Copy/Paste (text and images)
    *   Search with Google
    *   Copying links
    *   Select All
*   **Manual Update Checker:** Added a "Check for Updates" button in the system tray to manually trigger update checks.

## Release Notes (Latest: v1.0.7-fork.4)

*   **Console Error Reporting Removed:** We've removed the console error reporting feature.
*   **About Button Reverted:** The "About" button now correctly redirects to the original repository.
*   **License Cleanup:** Removed the forker as a contributor in the project's license.
*   **Unconfirmed Updater:** Due to changes made to remove error reporting, the updater's functionality is unconfirmed until the next release. ([View changes on GitHub](https://github.com/ninjaeon/gemini-desktop-fork/compare/v1.0.7-fork.3...v1.0.7-fork.4))

**Previous Release Highlights:**

*   **v1.0.7-fork.3:** Keybinding fix.
*   **v1.0.7-fork.2:** Enhanced security by removing a web security attribute, added manual update checker.
*   **v1.0.7-fork.1:** Electron upgrade, external link handling, context menu features.

## Installation

**Windows:**

1. Download `Gemini-Desktop-Setup-1.0.7-fork.4.exe` (installer) or `Gemini-Desktop-1.0.7-fork.4-win.zip` (portable).
2. Installer: Run the `.exe` file.
3. Portable: Unzip and run `Gemini-Desktop.exe`.

**macOS (Untested):**

1. Download `Gemini-Desktop-1.0.7-fork.4-arm64.dmg` or `Gemini-Desktop-1.0.7-fork.4-arm64-mac.zip`.
2. DMG: Open the `.dmg` and drag the app to your Applications folder.
3. ZIP: Unzip and drag the app to your Applications folder.

**Linux (Untested):**

1. Download the appropriate file:
    *   `Gemini-Desktop-1.0.7-fork.4.AppImage` (most distributions)
    *   `gemini-desktop-1.0.7-fork.4.x86_64.rpm` (RPM-based)
    *   `gemini-desktop_1.0.7-fork.4_amd64.deb` (Debian-based)
2. If needed, make the file executable (e.g., `chmod +x Gemini-Desktop-1.0.7-fork.4.AppImage`).
3. Run the file.

## Contributing

Contributions are welcome! If you encounter any issues, especially on macOS or Linux, please report them on the [Issues](https://github.com/ninjaeon/gemini-desktop-fork/issues) page. If you are interested in contributing code, please open a pull request.

## Disclaimer

This project is not affiliated with or endorsed by Google. It is an independent, community-driven effort to enhance the Gemini user experience.

## Credits

*   Original Gemini Desktop Client: [nekupaw](https://github.com/nekupaw/gemini-desktop)
```
