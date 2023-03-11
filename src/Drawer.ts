import type { BrowserWindow } from "electron";
import { Vector2 } from './models/Vector';

export class Drawer {
    private win: BrowserWindow;
    setWindow(win: BrowserWindow) { this.win = win; }

    private send(...args: any) {
        if (!this.win) return;
        this.win.webContents.send('action', args);
    }

    onTickStart() {
        this.send('onTickStart');
    }

    drawText(text: string, x: number, y: number, size?: number) {
        this.send('drawText', text, x, y, size);
    }
    drawTextAt(text: string, point: Vector2, size?: number) {
        this.drawText(text, point.x, point.y, size);
    }

    drawCircle(x: number, y: number, r: number, color?: number, fillColor?: number) {
        this.send('drawCircle', x, y, r, color, fillColor);
    }
    drawCircleAt(point: Vector2, r: number, color?: number, fillColor?: number) {
        this.drawCircle(point.x, point.y, r, color, fillColor);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, color?: number) {
        this.send('drawLine', x1, y1, x2, y2, color);
    }


}


const instance = new Drawer();
export default instance;