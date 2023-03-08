
import Reader from './components/Reader';
import * as StructureReader from './components/StructureReader';
import { Entity } from './models/Entity';
import { Vector2, Vector3 } from './models/Vector';
import { Offsets } from './offsets';
import math from 'math';
import { matrixToArray, worldToScreen } from './Utils';

type AyayaLeagueCache = {
    renderer: number,
    screen: Vector2,
    matrix: number[],
    gameTime: number
}

export class AyayaLeague {

    public cache: Partial<AyayaLeagueCache> = {};

    constructor() {
        const renderer = Reader.readInt(Offsets.Renderer, true);
        this.cache.renderer = renderer;
        const screen = new Vector2(Reader.readInt(renderer + Offsets.RendererWidth), Reader.readInt(renderer + Offsets.RendererHeight));
        this.cache.screen = screen;
    }

    initializeTick() {

        //TODO: Check if league is open
        const isOpen = true;
        if (!isOpen) return;

        const viewMatrix = StructureReader.readMatrix(Offsets.ViewMatrix);
        const projMatrix = StructureReader.readMatrix(Offsets.ViewMatrix + 0x40);
        const viewProjMatrix = math.multiply(viewMatrix, projMatrix);
        const matrix = matrixToArray(viewProjMatrix);
        
        this.cache.matrix = matrix;
        this.cache.gameTime = Reader.readFloat(Offsets.GameTime, true);
    }


    worldToScreen(gamePos: Vector3) { return worldToScreen(gamePos, this.cache.screen, this.cache.matrix); }

    get champions() { return StructureReader.readVTable(Reader.readInt(Offsets.HeroList, true)).map(e => new Entity(e, this)); }

    get minions() { return StructureReader.readVTable(Reader.readInt(Offsets.MinionList, true)).map(e => new Entity(e, this)); }

}