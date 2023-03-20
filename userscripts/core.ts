import "../types/ScriptTypes";
import type ScriptCore from "models/ScriptCore";
import type { IScript, Settings } from "../types/ScriptTypes";



export class CoreScript implements IScript {

    public title: string;
    public description: string;

    public settings = {
        active: { type: 'boolean', text: 'Active', value: true },
        render_fps: {
            type: 'select', text: 'Render FPS', options: [
                { text: '15', value: 15 },
                { text: '30', value: 30 },
                { text: '60', value: 60 },
                { text: '90', value: 90 },
            ], value: 60
        }
    } satisfies Settings;

    constructor() {
        this.title = 'Core';
        this.description = 'Core script, used to test some settings';
    }

    onLoad() {
        console.log('LOADED');
    }

    onUnload() {
        console.log('UNLOADED')
    }

    onDraw(core: ScriptCore) {
        // if (!core.game) return;
        // core.drawer.drawCircle3dAt(core.game.me.gamePos, 400, 50, 0xFF0000);
        // return;
        const active = this.settings.active.value;
        if (!active) return;
        const pos = core.utils.getMousePosition();
        core.drawer.drawCircle(pos.x, pos.y, 500, 0xFF0000, 8);
    }

}

// exportSettings([
//     {
//         id: 'core',
//         title: 'Core',
//         settings: [
//             { id: 'active', type: 'boolean', text: 'Active', value: false },
//             { id: 'exec', type: 'button', text: 'CLICK_ME', click: () => { console.log('Clicked') } },
//             {
//                 id: 'render_fps', type: 'select', options: [
//                     { text: '15', value: 15 },
//                     { text: '30', value: 30 },
//                     { text: '60', value: 60 },
//                     { text: '90', value: 90 },
//                 ],
//                 text: 'Draw FPS',
//                 value: 60
//             }
//         ],
//         description: 'Core script, used to test some settings',
//     }
// ]);

