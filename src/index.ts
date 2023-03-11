import mem from './addons_cpp/mem/Mem';
import addon from './addons_cpp/injector/Injector';

// const inject = addon.inject("EFCT_Target.exe", "C:\\Users\\Emily\\source\\repos\\AyayaDLL\\Debug\\AyayaDLL.dll");

import { BrowserWindow, app, screen, ipcMain } from 'electron';

import { AyayaLeague } from './AyayaLeague';
import Drawer from './Drawer';
import Reader from './components/Reader'
import path from 'path';

import ScriptsManager from './components/ScriptsManager';

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
            preload: path.join(__dirname, '../src/preload.js')
        },
    });

    win.setIgnoreMouseEvents(true, { forward: true });
    win.setAlwaysOnTop(true, 'screen-saver');
    win.webContents.openDevTools({ mode: 'detach' });

    ipcMain.on('set-ignore-mouse-events', (event, ignore: boolean, forward: boolean) => {
        BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(ignore, { forward })
    });

    ipcMain.on('size', (event) => {
        event.returnValue = screen.getPrimaryDisplay().bounds;
    });

    ipcMain.on('settings', (event) => {
        event.returnValue = [
            {
                title: 'test',
                settings: [
                    { text: 'Active', value: false, type: 'boolean' }
                ],
                description: 'test111'
            }];
    });

    // const file = path.join(__dirname, '../ui/index.html');
    // win.loadFile(file);
    win.loadURL('http://localhost:5173')
    Drawer.setWindow(win);

    // Reader.attach('League of Legends.exe');
    // const ayaya = new AyayaLeague();

    coreLoop();

    ScriptsManager.loadScripts(path.join(__dirname, '../userscripts'));

    function coreLoop() {
        // ayaya.initializeTick();

        ScriptsManager.scripts.forEach(script => script.internalFunctions.onTick(script.core));

        setTimeout(() => coreLoop(), 32);
    }

}




