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
        } while (gameTime <= 5)
        resolve();
    });
}

let leagueState_open = false;

function main() {

    const win = new BrowserWindow({
        x: screen.getPrimaryDisplay().bounds.x,
        y: screen.getPrimaryDisplay().bounds.y,
        width: screen.getPrimaryDisplay().bounds.width,
        height: screen.getPrimaryDisplay().bounds.height + 40,
        transparent: true,
        frame: false,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, '../src/preload.js')
        },
        alwaysOnTop: true
    });

    console.log(screen.getPrimaryDisplay().bounds);

    win.setIgnoreMouseEvents(true, { forward: true });
    win.setAlwaysOnTop(true, "screen-saver");


    ipcMain.on('set-ignore-mouse-events', (event, ignore: boolean, forward: boolean) => {
        BrowserWindow.fromWebContents(event.sender).setIgnoreMouseEvents(ignore, { forward })
    });

    ipcMain.on('size', (event) => {
        event.returnValue = screen.getPrimaryDisplay().bounds;
    });

    ipcMain.on('settings', (event) => {
        const settings = ScriptsManager.getSettings();
        event.returnValue = settings;
    });

    ipcMain.on('set-setting', (event, script_path: string, key: string, value: any) => {
        ScriptsManager.changeSetting(script_path, key, value);
        event.returnValue = true;
    });

    ipcMain.on('reload-scripts', (event) => {
        ScriptsManager.reloadAll();
        const settings = ScriptsManager.getSettings();
        event.returnValue = settings;
    });

    ipcMain.on('openDevTools', () => {
        win.webContents.openDevTools({ mode: 'detach' });
    })

    ipcMain.on('req-things-to-draw', (event) => {
        // if (!leagueState_open) return event.returnValue = false;
        Drawer.onStartDraw();
        ScriptsManager.onDraw();
        const buffer = Drawer.onEndDraw();
        event.returnValue = buffer;
    });

    // const file = path.join(__dirname, '../ui/index.html');
    // win.loadFile(file);


    async function start(isRecall = false) {
        if (!isRecall) {
            ScriptsManager.loadScripts(path.join(__dirname, '../userscripts'));
            win.loadURL('http://localhost:5173')
            win.webContents.openDevTools({ mode: 'detach' });
            Drawer.setWindow(win);
        }
        console.log('Waiting for league...');
        await waitForLeagueOpen();

        Reader.attach('League of Legends.exe');

        const dll_path = path.join(__dirname, '../src/AyayaDLL.dll')
        console.log(dll_path);
        const inject = addon.inject("League of Legends.exe", dll_path);
        await new Promise(r => setTimeout(r, 1500));

        const ayaya = new AyayaLeague();
        ScriptsManager.setAyayaLeague(ayaya);
        Drawer.setAyayaLeague(ayaya);

        await waitForEnterGame(ayaya);
        await new Promise(r => setTimeout(r, 1000));

        internal.openPipe('myPipe', async () => {
            // ScriptsManager.scripts.forEach(script => script.internalFunctions.onLoad?.());
            console.log('CORE LOOP')
            win.setAlwaysOnTop(true, "screen-saver");
            logicLoop();
        });


        function logicLoop() {
            const isLeagueOpen = addon.getLeaguePID();
            if (isLeagueOpen == 0) {
                leagueState_open = false;
                return setTimeout(() => start(true), 1000);
            }
            ayaya.initializeTick();
            leagueState_open = true;
            // ScriptsManager.scripts.forEach(script => script.internalFunctions.onTick?.());
            setTimeout(() => logicLoop(), 30);
        }

    }

    start();


}




