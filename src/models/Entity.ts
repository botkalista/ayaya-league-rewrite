import type { AyayaLeague } from '../AyayaLeague';

import reader from '../components/Reader';
import { ReadableClass } from '../components/ReadableClass';
import { Offsets } from '../offsets';
import { Vector3, Vector2 } from './Vector';
export class Entity extends ReadableClass {

    constructor(address: number, public ayaya: AyayaLeague) { super(address); }

    get netId() { return this.readInt(Offsets.GObject_NetworkID); }

    get name() {
        const szName = this.readByte(Offsets.GObject_Name + 0x10);
        if (szName < 16) return this.readString(Offsets.GObject_Name);
        const ptrName = this.readInt(Offsets.GObject_Name);
        return reader.readString(ptrName);
    }

    get gamePos(): Vector3 { return Vector3.fromData(this.read(Offsets.GObject_Pos, 'VEC3')); }
    get screenPos(): Vector2 { return this.ayaya.worldToScreen(this.gamePos); }
    

}