const {app, Tray, Menu, shell, BrowserWindow, globalShortcut, screen, ipcMain} = require('electron'),
      path = require('path'),
      Store = require('electron-store'),
      store = new Store();

let tray, gemini, closeTimeout, visible = true;

const exec = code => gemini.webContents.executeJavaScript(code).catch(console.error),
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
        icon: path.resolve(__dirname, 'icon.png'),
        show: getValue('show-on-startup', true),
        webPreferences: {
            contextIsolation: false,
            devTools: false,
            nodeIntegration: true,
            webviewTag: true,
            webSecurity: false,
            preload: path.join(__dirname, 'src/preload.js')
        }
    });

    gemini.loadFile('src/index.html').catch(console.error);

    gemini.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url).catch(console.error);
        return { action: 'deny' };
    });

    gemini.on('blur', () => {
        if (!getValue('always-on-top', false)) toggleVisibility(false);
    });

    gemini.webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    ipcMain.handle('get-local-storage', (event, key) => getValue(key));

    ipcMain.on('set-local-storage', (event, key, value) => {
        store.set(key, value);
        registerKeybindings();
    });

    ipcMain.on('close', event => {
        BrowserWindow.fromWebContents(event.sender).close();
    });

};

const createTray = () => {
    tray = new Tray(path.resolve(__dirname, 'icon.png'));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'About (GitHub)',
            click: () => shell.openExternal('https://github.com/nekupaw/gemini-desktop').catch(console.error)
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
                        preload: path.join(__dirname, 'components/setKeybindingsOverlay/preload.js')
                    }
                });
                dialog.loadFile('components/setKeybindingsOverlay/index.html').catch(console.error);
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
};

app.whenReady().then(() => {
    createTray();
    createWindow();
    registerKeybindings();
}).catch(console.error);
