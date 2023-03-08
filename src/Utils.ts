import { Vector2, Vector3, Vector4 } from "./models/Vector";
import math from 'math';

export function worldToScreen(pos: Vector3, screenSize: Vector2, viewProjMatrix: number[]) {
    const out = Vector2.zero;
    const screen = screenSize.copy();
    const clipCoords = Vector4.zero;
    clipCoords.x = pos.x * viewProjMatrix[0] + pos.y * viewProjMatrix[4] + pos.z * viewProjMatrix[8] + viewProjMatrix[12];
    clipCoords.y = pos.x * viewProjMatrix[1] + pos.y * viewProjMatrix[5] + pos.z * viewProjMatrix[9] + viewProjMatrix[13];
    clipCoords.z = pos.x * viewProjMatrix[2] + pos.y * viewProjMatrix[6] + pos.z * viewProjMatrix[10] + viewProjMatrix[14];
    clipCoords.w = pos.x * viewProjMatrix[3] + pos.y * viewProjMatrix[7] + pos.z * viewProjMatrix[11] + viewProjMatrix[15];
    if (clipCoords.w < 1.0) clipCoords.w = 1;
    const m = Vector3.zero;
    m.x = clipCoords.x / clipCoords.w;
    m.y = clipCoords.y / clipCoords.w;
    m.z = clipCoords.z / clipCoords.w;
    out.x = (screen.x / 2 * m.x) + (m.x + screen.x / 2);
    out.y = -(screen.y / 2 * m.y) + (m.y + screen.y / 2);
    return out;
}

export function matrixToArray(matrix: math.Matrix): number[] {
    const result: number[] = [];
    for (let i = 0; i < matrix['_data'].length; i++) {
        for (let k = 0; k < matrix['_data'][i].length; k++) {
            const val: number = matrix['_data'][i][k];
            result.push(val);
        }
    }
    return result;
}