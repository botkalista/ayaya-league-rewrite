import { SettingBoolean } from "models/renderer/SettingsGroup";
import { exportSettings, onLoad, onTick, onUnload, settings } from "../types/ScriptCoreFn";


exportSettings([
    {
        id: 'core',
        title: 'Core',
        settings: [
            { id: 'active', type: 'boolean', text: 'Active', value: false },
            { id: 'exec', type: 'button', text: 'Execute' }
        ],
        description: 'Core script, used to test some settings',
    }
]);

onTick(core => {

    const active = settings.getSetting<SettingBoolean>('core', 'active')?.value;
    if (active) {
        core.game.internal.printChat('uwu')
    }

});