import mem from './addons_cpp/mem/Mem';
import addon from './addons_cpp/injector/Injector';
import internal from './components/Internal';

import { BrowserWindow, app, screen, ipcMain } from 'electron';

import { AyayaLeague } from './AyayaLeague';
import Drawer from './Drawer';
import Reader from './components/Reader'
import path from 'path';

import ScriptsManager from './components/ScriptsManager';

app.whenReady().then(main);

function waitForLeagueOpen() {
    return new Promise(async resolve => {
        let leaguePID;
        do {
            leaguePID = addon.getLeaguePID();
            await new Promise(r => setTimeout(r, 2000));
        } while (leaguePID == 0)
        resolve(leaguePID);
    });
}

function waitForEnterGame(ayaya: AyayaLeague) {
    return new Promise<void>(async resolve => {
        let gameTime;
        do {
            gameTime = ayaya.gameTime;
            console.log({ gameTime });
            await new Promise(r => setTimeout(r, 2000));
        } while (gameTime <= 0)
        resolve();
    });
}



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

    console.log(screen.getPrimaryDisplay());

    win.setIgnoreMouseEvents(true, { forward: true });
    win.setAlwaysOnTop(true, 'screen-saver');


    ipcMain.on('set-ignore-mouse-events', (event, ignore: boolean, forward: boolean) => {
        BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(ignore, { forward })
    });

    ipcMain.on('size', (event) => {
        event.returnValue = screen.getPrimaryDisplay().bounds;
    });

    ipcMain.on('settings', (event) => {
        const settings = ScriptsManager.getAllSettings();
        event.returnValue = settings;
    });

    ipcMain.on('set-setting', (event, setting_id: string, value: any) => {
        ScriptsManager.setSetting(setting_id, value);
        event.returnValue = true;
    });

    // const file = path.join(__dirname, '../ui/index.html');
    // win.loadFile(file);


    async function start() {
        ScriptsManager.loadScripts(path.join(__dirname, '../userscripts'));


        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools({ mode: 'detach' });
        Drawer.setWindow(win);

        await waitForLeagueOpen();

        Reader.attach('League of Legends.exe');

        const inject = addon.inject("League of Legends.exe", "C:\\Users\\Emily\\source\\repos\\AyayaDLL\\Debug\\AyayaDLL.dll");
        await new Promise(r => setTimeout(r, 2000));

        const ayaya = new AyayaLeague();
        ScriptsManager.setAyayaLeague(ayaya);

        await waitForEnterGame(ayaya);
        await new Promise(r => setTimeout(r, 2000));

        internal.openPipe('myPipe', async () => {
            ScriptsManager.scripts.forEach(script => script.internalFunctions.onLoad?.());
            console.log('CORE LOOP')
            coreLoop();
        });
        function coreLoop() {
            ayaya.initializeTick();
            ScriptsManager.scripts.forEach(script => script.internalFunctions.onTick?.());
            setTimeout(() => coreLoop(), 320);
        }
    }

    start();


}




