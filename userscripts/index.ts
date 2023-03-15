import { SettingBoolean } from "models/renderer/SettingsGroup";
import { exportSettings, onLoad, onTick, onUnload, settings } from "../types/ScriptCoreFn";


exportSettings([
    {
        id: 'core',
        title: 'Core',
        settings: [
            { id: 'active', type: 'boolean', text: 'Active', value: false },
            { id: 'exec', type: 'button', text: 'CLICK_ME', click: () => { console.log('Clicked') } }
        ],
        description: 'Core script, used to test some settings',
    }
]);

onLoad((core) => {
    console.log('LOADED');

})

onUnload(() => {
    console.log('UN-LOADED');
})

onTick(core => {
    const me = core.game.me;
    const pos = me.gamePos;
    core.drawer.drawCircle3dAt(pos, 300, 50, 0xFF0000);

    const active = settings.getSetting<SettingBoolean>('core', 'active')?.value;
    if (active) {
        core.game.internal.printChat('uwu')
    }

});