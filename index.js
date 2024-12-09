(async () => {
    const { app, Tray, Menu, shell, BrowserWindow, globalShortcut, screen, ipcMain, dialog } = await import('electron');
    const path = await import('path');
    const Store = (await import('electron-store')).default;
    const store = new Store();
    const { autoUpdater } = require('electron-updater');

    const contextMenu = await import('electron-context-menu');

    let tray, gemini, closeTimeout, visible = true;

    // Setup autoUpdater
    try {
        autoUpdater.setFeedURL({
            provider: 'github',
            owner: 'nekupaw',
            repo: 'gemini-desktop',
        });

        autoUpdater.on('error', (error) => {
            dialog.showErrorMessage('Error updating the app', error);
        });

        autoUpdater.on('checking-for-update', () => {
            // Checking for updates
        });

        autoUpdater.autoDownload = false;
        autoUpdater.on('update-available', () => {
            const response = dialog.showMessageBoxSync({
                type: 'info',
                buttons: ['Update', 'Later'],
                title: 'Update Available',
                message: 'A new update is available. Do you want to update now?'
            });
            if (response === 0) autoUpdater.downloadUpdate();
        });

        autoUpdater.on('update-downloaded', () => {
            dialog.showMessageBoxSync({
                type: 'info',
                buttons: ['Restart'],
                title: 'Update Ready',
                message: 'Update downloaded. Application will restart to apply updates.'
            });
            autoUpdater.quitAndInstall();
        });

        autoUpdater.on('update-not-available', () => {
            dialog.showMessageBoxSync({
                type: 'info',
                buttons: ['OK'],
                title: 'No Updates',
                message: 'No updates are available at the moment.'
            });
        });
    } catch (error) {
        dialog.showErrorMessage('Error setting up autoUpdater', error);
    }

    const exec = code => gemini.webContents.executeJavaScript(code),
        getValue = (key, defaultVal = false) => store.get(key, defaultVal);

    const toggleVisibility = action => {
        visible = action;
        if (action){
            clearTimeout(closeTimeout);
            gemini.show();
        } else closeTimeout = setTimeout(() => gemini.hide(), 400);
        gemini.webContents.send('toggle-visibility', action);
    };

    const registerKeybindings = () => {
        globalShortcut.unregisterAll();
        const shortcutA = getValue('shortcutA'),
            shortcutB = getValue('shortcutB');

        if (shortcutA) {
            globalShortcut.register(shortcutA, () => toggleVisibility(!visible));
        }

        if (shortcutB) {
            globalShortcut.register(shortcutB, () => {
                toggleVisibility(true);
                gemini.webContents.send('activate-mic');
            });
        }
    };

    const createWindow = () => {
        const {width, height} = screen.getPrimaryDisplay().bounds,
            winWidth = 400, winHeight = 700;

        gemini = new BrowserWindow({
            width: winWidth,
            height: winHeight,
            frame: false,
            movable: true,
            maximizable: false,
            resizable: false,
            skipTaskbar: true,
            alwaysOnTop: true,
            transparent: true,
            x: width - winWidth - 10,
            y: height - winHeight - 60,
            icon: path.default.resolve(__dirname, 'icon.png'),
            show: getValue('show-on-startup', true),
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                webviewTag: true,
                webSecurity: false,
                preload: path.default.join(__dirname, 'src/preload.js')
            }
        });

        gemini.loadFile('src/index.html').catch(error => {
            dialog.showErrorMessage('Error loading index.html', error);
        });

        gemini.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url).catch(error => {
                dialog.showErrorMessage('Error opening external URL', error);
            });
            return { action: 'deny' };
        });

        gemini.on('blur', () => {
            if (!getValue('always-on-top', false)) toggleVisibility(false);
        });

        ipcMain.handle('get-local-storage', (event, key) => getValue(key));

        ipcMain.on('set-local-storage', (event, key, value) => {
            store.set(key, value);
            registerKeybindings();
        });

        ipcMain.on('close', event => {
            BrowserWindow.fromWebContents(event.sender).close();
        });

        contextMenu.default({
            window: gemini,
            showInspectElement: false
        });

        // Apply context menu to webview contents
        gemini.webContents.on('did-attach-webview', (event, webContents) => {
            contextMenu.default({
                window: webContents,
                showInspectElement: false
            });
        });
    };

    const createTray = () => {
        try {
            tray = new Tray(path.default.resolve(__dirname, 'icon.png'));
            const contextMenu = Menu.buildFromTemplate([
                {
                    label: 'About (GitHub)',
                    click: () => shell.openExternal('https://github.com/nekupaw/gemini-desktop/').catch(error => {
                        dialog.showErrorMessage('Error opening GitHub page', error);
                    })
                },
                {
                    label: 'Check for Updates',
                    click: () => {
                        autoUpdater.checkForUpdates().catch(error => {
                            dialog.showErrorMessage('Error checking for updates', error);
                        });
                    }
                },
                {type: 'separator'},
                {
                    label: "Set Keybindings",
                    click: () => {
                        const dialog = new BrowserWindow({
                            width: 500,
                            height: 370,
                            frame: false,
                            maximizable: false,
                            resizable: false,
                            skipTaskbar: true,
                            webPreferences: {
                                contextIsolation: true,
                                preload: path.default.join(__dirname, 'components/setKeybindingsOverlay/preload.js')
                            }
                        });
                        dialog.loadFile('components/setKeybindingsOverlay/index.html').catch(error => {
                            dialog.showErrorMessage('Error loading setKeybindingsOverlay', error);
                        });
                        dialog.show();
                    }
                },
                {
                    label: 'Always on Top',
                    type: 'checkbox',
                    checked: getValue('always-on-top', false),
                    click: menuItem => store.set('always-on-top', menuItem.checked)
                },
                {
                    label: 'Show on Startup',
                    type: 'checkbox',
                    checked: getValue('show-on-startup', true),
                    click: menuItem => store.set('show-on-startup', menuItem.checked)
                },
                {type: 'separator'},
                {
                    label: 'Quit Gemini',
                    click: () => gemini.close()
                }
            ]);

            tray.setContextMenu(contextMenu);
            tray.on('click', () => toggleVisibility(true));
        } catch (error) {
            dialog.showErrorMessage('Error creating tray', error);
        }
    };

    app.whenReady().then(() => {
        try {
            createTray();
            createWindow();
            registerKeybindings();
        } catch (error) {
            dialog.showErrorMessage('Error during app initialization', error);
        }
    }).catch(error => {
        dialog.showErrorMessage('Error during app initialization', error);
    });
})();
