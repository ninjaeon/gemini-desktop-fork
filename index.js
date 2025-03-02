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
            owner: 'ninjaeon',
            repo: 'gemini-desktop-fork',
        });

        autoUpdater.on('error', (error) => {
            dialog.showMessageBox({
                type: 'error',
                title: 'Update Error',
                message: 'An error occurred while checking for updates.',
                detail: error ? error.message : 'Unknown error'
            });
        });

        autoUpdater.on('checking-for-update', () => {
            dialog.showMessageBox({
                type: 'info',
                title: 'Checking for Updates',
                message: 'Checking for new version...',
                buttons: ['OK']
            });
        });

        autoUpdater.autoDownload = false;
        autoUpdater.on('update-available', () => {
            dialog.showMessageBox({
                type: 'info',
                buttons: ['Update', 'Later'],
                title: 'Update Available',
                message: 'A new version is available. Would you like to update now?'
            }).then(({ response }) => {
                if (response === 0) {
                    autoUpdater.downloadUpdate();
                }
            });
        });

        autoUpdater.on('update-downloaded', () => {
            dialog.showMessageBox({
                type: 'info',
                buttons: ['Restart'],
                title: 'Update Ready',
                message: 'Update has been downloaded. The application will now restart to install the update.'
            }).then(() => {
                autoUpdater.quitAndInstall();
            });
        });

        autoUpdater.on('update-not-available', () => {
            dialog.showMessageBox({
                type: 'info',
                buttons: ['OK'],
                title: 'No Updates',
                message: 'You are running the latest version.'
            });
        });
    } catch (error) {
        dialog.showMessageBox({
            type: 'error',
            title: 'Update Error',
            message: 'An error occurred while setting up the auto updater.',
            detail: error ? error.message : 'Unknown error'
        });
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

    // Calculate a safe window position within screen bounds
    const calculateSafeWindowPosition = (winWidth, winHeight) => {
        const {width, height} = screen.getPrimaryDisplay().workArea;
        
        // Add padding to ensure window is fully visible
        const padding = 10;
        
        // Calculate position to place window on right side with padding
        const x = Math.max(padding, Math.min(width - winWidth - padding, width - winWidth - padding));
        const y = Math.max(padding, Math.min(height - winHeight - padding, height - winHeight - padding));
        
        return { x, y };
    };

    // Save window position
    const saveWindowPosition = () => {
        if (!gemini) return;
        
        const position = gemini.getPosition();
        const size = gemini.getSize();
        
        store.set('windowPosition', {
            x: position[0],
            y: position[1],
            width: size[0],
            height: size[1]
        });
    };

    // Reset window position to default
    const resetWindowPosition = () => {
        if (!gemini) return;
        
        const winWidth = 400, winHeight = 700;
        
        // Get safe default position
        const { x, y } = calculateSafeWindowPosition(winWidth, winHeight);
        
        // Set window position and size
        gemini.setPosition(x, y);
        gemini.setSize(winWidth, winHeight);
        
        // Remove saved position
        store.delete('windowPosition');
        
        // Show window if hidden
        if (!visible) {
            toggleVisibility(true);
        }
    };

    const createWindow = () => {
        const winWidth = 400, winHeight = 700;
        
        // Get safe default position
        const defaultPosition = calculateSafeWindowPosition(winWidth, winHeight);

        // Get saved position or use default
        const savedPosition = store.get('windowPosition', {
            x: defaultPosition.x,
            y: defaultPosition.y,
            width: winWidth,
            height: winHeight
        });

        gemini = new BrowserWindow({
            width: savedPosition.width || winWidth,
            height: savedPosition.height || winHeight,
            frame: false,
            movable: true,
            maximizable: false,
            resizable: true,
            skipTaskbar: true,
            alwaysOnTop: true,
            transparent: true,
            x: savedPosition.x,
            y: savedPosition.y,
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
            dialog.showMessageBox({
                type: 'error',
                title: 'Error loading index.html',
                message: 'Failed to load index.html.',
                detail: error ? error.message : 'Unknown error'
            });
        });

        gemini.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url).catch(error => {
                dialog.showMessageBox({
                    type: 'error',
                    title: 'Error opening external URL',
                    message: 'Failed to open external URL.',
                    detail: error ? error.message : 'Unknown error'
                });
            });
            return { action: 'deny' };
        });

        gemini.on('blur', () => {
            if (!getValue('always-on-top', false)) toggleVisibility(false);
        });

        // Save position when window is moved
        gemini.on('moved', saveWindowPosition);
        
        // Save size when window is resized
        gemini.on('resize', saveWindowPosition);

        // Save position before window is closed
        gemini.on('close', saveWindowPosition);

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
                        dialog.showMessageBox({
                            type: 'error',
                            title: 'Error opening GitHub page',
                            message: 'Failed to open GitHub page.',
                            detail: error ? error.message : 'Unknown error'
                        });
                    })
                },
                {
                    label: 'Check for Updates',
                    click: () => {
                        autoUpdater.checkForUpdates().catch(error => {
                            dialog.showMessageBox({
                                type: 'error',
                                title: 'Update Check Failed',
                                message: 'Failed to check for updates.',
                                detail: error ? error.message : 'Unknown error',
                                buttons: ['OK']
                            });
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
                            dialog.showMessageBox({
                                type: 'error',
                                title: 'Error loading setKeybindingsOverlay',
                                message: 'Failed to load setKeybindingsOverlay.',
                                detail: error ? error.message : 'Unknown error'
                            });
                        });
                        dialog.show();
                    }
                },
                {
                    label: 'Reset Window Position',
                    click: () => resetWindowPosition()
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
            dialog.showMessageBox({
                type: 'error',
                title: 'Error creating tray',
                message: 'Failed to create tray.',
                detail: error ? error.message : 'Unknown error'
            });
        }
    };

    app.whenReady().then(() => {
        try {
            createTray();
            createWindow();
            registerKeybindings();
        } catch (error) {
            dialog.showMessageBox({
                type: 'error',
                title: 'Error during app initialization',
                message: 'Failed to initialize the application.',
                detail: error ? error.message : 'Unknown error'
            });
        }
    }).catch(error => {
        dialog.showMessageBox({
            type: 'error',
            title: 'Error during app initialization',
            message: 'Failed to initialize the application.',
            detail: error ? error.message : 'Unknown error'
        });
    });
})();
