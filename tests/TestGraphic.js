const { BrowserWindow, app, screen } = require("electron");

app.whenReady().then(main);

function main() {

    const win = new BrowserWindow({
        x: screen.getPrimaryDisplay().bounds.x,
        y: screen.getPrimaryDisplay().bounds.y,
        width: screen.getPrimaryDisplay().bounds.width,
        height: screen.getPrimaryDisplay().bounds.height,
        transparent: true,
        frame: false,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            // preload: path.join(__dirname, '../ui/preload.js')
        },
    });

    win.setIgnoreMouseEvents(true, { forward: false });
    win.setAlwaysOnTop(true, 'screen-saver');
    win.webContents.openDevTools({ mode: 'detach' });

   win.loadURL('http://localhost:5173');

}