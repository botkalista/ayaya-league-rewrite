import type { BrowserWindow } from "electron";
import { Vector2 } from './models/Vector';

class Drawer {
    private win: BrowserWindow;
    setWindow(win: BrowserWindow) { this.win = win; }

    private send(...args: any) {
        if (!this.win) return;
        this.win.webContents.send('action', args);
    }

    drawText(text: string, x: number, y: number) { this.send('drawText', text, x, y); }
    drawTextAt(text: string, point: Vector2) { this.drawText(text, point.x, point.y); }



}


const instance = new Drawer();
export default instance;