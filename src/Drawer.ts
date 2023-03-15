import type { BrowserWindow } from "electron";
import type { AyayaLeague } from "./AyayaLeague";
import { Vector2, Vector3 } from './models/Vector';
import { getCircle3D } from "./Utils";

export class Drawer {
    private win: BrowserWindow;
    private ayaya: AyayaLeague;

    setWindow(win: BrowserWindow) { this.win = win; }
    setAyayaLeague(ayaya: AyayaLeague) { this.ayaya = ayaya; }

    private send(...args: any) {
        if (!this.win) return;
        this.win.webContents.send('action', args);
    }

    
    onDrawThings() {
        this.send('onDrawThings');
    }

    drawText(text: string, x: number, y: number, size?: number) {
        this.send('drawText', text, x, y, size);
    }
    drawTextAt(text: string, point: Vector2, size?: number) {
        this.drawText(text, point.x, point.y, size);
    }

    drawCircle(x: number, y: number, r: number, color?: number, weight: number = 3, fillColor?: number) {
        this.send('drawCircle', x, y, r, color, weight, fillColor);
    }
    drawCircleAt(point: Vector2, r: number, color?: number, weight: number = 3, fillColor?: number) {
        this.drawCircle(point.x, point.y, r, color, weight, fillColor);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, weight: number = 3, color?: number) {
        this.send('drawLine', x1, y1, x2, y2, weight, color);
    }

    drawCircle3d(x: number, y: number, z: number, r: number, points: number, color?: number, weight: number = 3) {
        const result = getCircle3D(new Vector3(x, y, z), points, r, this.ayaya.cache.screen, this.ayaya.cache.matrix)
        this.send('drawCircle3d', result, color, weight);
    }

    drawCircle3dAt(pos: Vector3, r: number, points: number, color?: number, weight: number = 3) {
        this.drawCircle3d(pos.x, pos.y, pos.z, r, points, color, weight);
    }



}


const instance = new Drawer();
export default instance;