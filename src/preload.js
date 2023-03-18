const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('AyayaApi', {
    onAction: (cb) => ipcRenderer.on('action', cb),
    setMouseEvents: (ignore, forward) => ipcRenderer.send('set-ignore-mouse-events', ignore, forward),
    getSettings: () => {
        const result = ipcRenderer.sendSync('settings');
        return result;
    },
    getSize: () => ipcRenderer.sendSync('size'),
    reloadScripts: () => ipcRenderer.sendSync('reload-scripts'),
    changeSetting: (setting, value) => ipcRenderer.sendSync('set-setting', setting, value),
    requestThingsToDraw: () => ipcRenderer.sendSync('req-things-to-draw')
});