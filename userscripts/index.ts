import "../types/ScriptCoreTypes";
import type ScriptCore from 'ScriptCore';

function onLoad(core: ScriptCore) {
    console.log('Loaded');
    core.onTick(onTick);
}

function onTick(core: ScriptCore) {
    // console.log('onTick');
}
