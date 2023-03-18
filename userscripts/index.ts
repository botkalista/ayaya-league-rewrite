import { exportSettings, getMousePosition, onDraw, onLoad, onTick, onUnload, settings } from "../types/ScriptCoreFn";
import { SettingBoolean } from "models/renderer/SettingsGroup";


exportSettings([
    {
        id: 'core',
        title: 'Core',
        settings: [
            { id: 'active', type: 'boolean', text: 'Active', value: false },
            { id: 'exec', type: 'button', text: 'CLICK_ME', click: () => { console.log('Clicked') } },
            {
                id: 'render_fps', type: 'select', options: [
                    { text: '15', value: 15 },
                    { text: '30', value: 30 },
                    { text: '60', value: 60 },
                    { text: '90', value: 90 },
                ],
                text: 'Draw FPS',
                value: 60
            }
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


onDraw(core => {
    // core.drawer.drawCircle3dAt(core.game.me.gamePos, 300, 50, 0xFF0000);
    const active = settings.getSetting<SettingBoolean>('core', 'active')?.value;
    if (!active) return;
    const pos = getMousePosition();
    core.drawer.drawCircle(pos.x, pos.y, 200, 0xFF0000, 3);
    // core.drawer.drawText("TEST", 300, 300, 20);
});

onTick(core => {

});