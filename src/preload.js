const { ipcRenderer, shell } = require('electron');

// Handle window visibility
ipcRenderer.on('toggle-visibility', (e, action) => {
    document.querySelector('.view').classList.toggle('close', !action);
});

// Handle all link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.href && link.href.startsWith('http')) {
        e.preventDefault();
        shell.openExternal(link.href).catch(console.error);
    }
});

// Intercept window.open calls
window.open = (url) => {
    if (url && url.startsWith('http')) {
        shell.openExternal(url).catch(console.error);
    }
    return null;
};

// Handle new window events
window.addEventListener('new-window', (e) => {
    e.preventDefault();
    if (e.url && e.url.startsWith('http')) {
        shell.openExternal(e.url).catch(console.error);
    }
});
