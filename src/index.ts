console.log(process.arch, process.version)


import mem from './addons_cpp/mem/Mem';
import addon from './addons_cpp/injector/Injector';

// console.log(process.arch);
// const inject = addon.inject("EFCT_Target.exe", "C:\\Users\\Emily\\source\\repos\\AyayaDLL\\Debug\\AyayaDLL.dll");

import { BrowserWindow, app, screen } from 'electron';

import { AyayaLeague } from './AyayaLeague';
import Drawer from './Drawer';
import Reader from './components/Reader'
import path from 'path';

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
            preload: path.join(__dirname , '../ui/preload.js')
        },
    });

    win.setIgnoreMouseEvents(true, { forward: false });
    win.setAlwaysOnTop(true, 'screen-saver');
    win.webContents.openDevTools({ mode: 'detach' });

    const file = path.join(__dirname, '../ui/index.html');
    win.loadFile(file);
    Drawer.setWindow(win);

    // Reader.attach('League of Legends.exe');
    // const ayaya = new AyayaLeague();

    coreLoop();




    function coreLoop() {
        // ayaya.initializeTick();

        

        setTimeout(() => coreLoop(), 32);
    }

}




