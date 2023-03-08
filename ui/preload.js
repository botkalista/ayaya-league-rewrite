const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('AyayaApi', {
    onAction: (cb) => ipcRenderer.on('action', cb)
});