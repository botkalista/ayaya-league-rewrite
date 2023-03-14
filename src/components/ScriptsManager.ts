import tsc from 'typescript';
import fs from 'fs';
import vm from 'vm';
import path from 'path';

import ScriptCore from '../ScriptCore';
import Drawer from '../Drawer';
import type { AyayaLeague } from '../AyayaLeague';
import { SettingsGroup } from '../models/renderer/SettingsGroup';



type CoreCallback = (core: ScriptCore) => any;

type Script = {
    path: string,
    source: string,
    enabled: boolean,
    vmScript: vm.Script,
    ctx: vm.Context,
    core: ScriptCore,
    settings?: SettingsGroup[],
    exportedSettings?: boolean,
    heartbeat: {
        last: number,
        interval: NodeJS.Timer
    },
    internalFunctions: {
        onTick?: () => any,
        onLoad?: () => any,
        onUnload?: () => any
    }
}

class ScriptsManager {
    public scripts: Script[] = [];
    public ayayaLeague: AyayaLeague;

    setAyayaLeague(ayayaLeague: AyayaLeague) {
        this.ayayaLeague = ayayaLeague;
    }


    // Read scripts, compile them and add to this.scripts
    // Calls this.createScriptContext(script)
    loadScripts(dirPath: string) {

        const files = fs.readdirSync(dirPath);

        for (const fileName of files) {

            const filePath = path.join(dirPath, fileName);

            const fileContent = fs.readFileSync(filePath, 'utf8');

            const source = this.compileScript(fileContent);

            const vmScript = new vm.Script(source, { filename: filePath });

            const script: Script = {
                source, vmScript,
                path: filePath,
                enabled: true,
                ctx: undefined,
                heartbeat: {
                    interval: undefined,
                    last: 0,
                },
                core: undefined,
                internalFunctions: {}
            }

            const ctx = this.createScriptContext(script);
            script.ctx = ctx;

            this.scripts.push(script);

        }

        for (const script of this.scripts) {
            script.vmScript.runInContext(script.ctx);
        }

    }


    getAllSettings() {
        const settings: SettingsGroup[] = [];
        this.scripts.forEach(e => settings.push(...e.settings));
        return settings;
    }

    setSetting(setting: string, value: any) {
        for (const script of this.scripts) {
            for (const group of script.settings) {
                for (const sett of group.settings) {
                    if (sett.id == setting) {
                        (sett as any).value = value;
                        return;
                    }
                }
            }
        }
    }

    private createScriptContext(script: Script) {

        const me = this;

        function getCore() {
            if (script.core && script.core.game && script.core.game.internal) {
                return script.core;
            } else {

                const newCore: ScriptCore = {
                    game: me.ayayaLeague,
                    drawer: Drawer,
                }

                script.core = newCore;
            }
        }

        script.heartbeat.interval = setInterval(() => {
            script.heartbeat.last = Date.now();
        }, 1000);

        const ctx = vm.createContext({
            console,
            onLoad: (scriptOnLoad: CoreCallback) => {
                script.internalFunctions.onLoad = () => {
                    scriptOnLoad(getCore());

                }
            },
            onUnload: (scriptOnUnload: CoreCallback) => {
                script.internalFunctions.onUnload = () => {
                    scriptOnUnload(getCore());
                    clearInterval(script.heartbeat.interval);
                }
            },
            onTick: (scriptOnTick: CoreCallback) => {
                script.internalFunctions.onTick = () => {
                    scriptOnTick(getCore());
                }
            },
            exportSettings: (groups: SettingsGroup[]) => {
                if (script.exportedSettings) return;
                script.settings = groups;

                console.log('EXPORTING SETTINGS');

                console.log(groups);

                script.exportedSettings = true;
            },
            settings: {
                getSetting: (group_id: string, setting_id: string) => {
                    const group = script.settings.find(e => e.id == group_id);
                    const setting = group.settings.find(k => k.id == setting_id);
                    return setting;
                },
                getGroup: (group_id: string) => {
                    return script.settings.find(e => e.id == group_id);
                },
                getAllSettings: () => {
                    return script.settings;
                }
            }
        });

        return ctx;
    }

    isScriptResponsive(script: Script) {
        const now = Date.now();
        return script.heartbeat.last > (now - 5000);
    }

    private compileScript(source: string) {
        const compilerOptions = tsc.getDefaultCompilerOptions();
        compilerOptions.module = tsc.ModuleKind.ES2020;
        compilerOptions.target = tsc.ScriptTarget.ES2016;
        compilerOptions.moduleResolution = tsc.ModuleResolutionKind.NodeNext;
        const transpiled = tsc.transpileModule(source, { compilerOptions });

        let jsSource = transpiled.outputText;

        // Remove imports
        jsSource = jsSource.split('\n').filter(e => !e.trim().startsWith('import')).join('\n');

        return jsSource;
    }

}

const instanceScriptsManager = new ScriptsManager();
export default instanceScriptsManager;