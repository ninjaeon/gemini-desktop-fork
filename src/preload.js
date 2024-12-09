const { ipcRenderer, shell, contextBridge, webFrame } = require('electron');

// Handle window visibility
ipcRenderer.on('toggle-visibility', (e, action) => {
    document.querySelector('.view').classList.toggle('close', !action);
});

// Handle all link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="http"]');
    if (link !== null) {
        e.preventDefault();
        shell.openExternal(link.href).catch(() => {
            // Handle error silently or show user-friendly message if needed
        });
    }
});

// Intercept window.open calls
contextBridge.exposeInMainWorld('electron', {
    openExternal: (url) => {
        shell.openExternal(url).catch(() => {
            // Handle error silently or show user-friendly message if needed
        });
    }
});

// Handle new window events
webFrame.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url).catch(() => {
        // Handle error silently or show user-friendly message if needed
    });
    return { action: 'deny' };
});
