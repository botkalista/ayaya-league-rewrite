import tsc from 'typescript';
import fs from 'fs';
import vm from 'vm';
import path from 'path';

import ScriptCore from '../ScriptCore';
import Drawer from '../Drawer';
import type { AyayaLeague } from '../AyayaLeague';

type Script = {
    path: string,
    source: string,
    enabled: boolean,
    vmScript: vm.Script,
    ctx: vm.Context,
    core: ScriptCore,
    lastHB: number,
    internalFunctions: {
        onTick?: (core: ScriptCore) => any,
        onLoad?: (core: ScriptCore) => any
    }
}

class ScriptsManager {

    public scripts: Script[] = [];
    public ayayaLeague: AyayaLeague;

    setAyayaLeague(ayayaLeague: AyayaLeague) {
        this.ayayaLeague = ayayaLeague;
    }

    private createCore(script: Script) {
        const core: ScriptCore = {
            game: this.ayayaLeague,
            drawer: Drawer,
            onTick: (script_onTick) => this.registerScriptTick(script, script_onTick)
        }
        return core;
    }

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
                lastHB: 0,
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


    isScriptResponsive(script: Script) {
        const now = Date.now();
        return script.lastHB > (now - 5000);
    }

    private onScriptStart(script: Script) {

        const core = this.createCore(script);
        script.core = core;
        script.internalFunctions.onLoad(core);

        // Beat
        setInterval(() => {
            script.lastHB = Date.now();
        }, 1000);

    }


    private registerScriptTick(script: Script, script_onTick) {
        script.internalFunctions.onTick = script_onTick;
    }
    private registerScriptLoad(script: Script, script_onLoad) {
        script.internalFunctions.onLoad = script_onLoad;
        this.onScriptStart(script);
    }

    private createScriptContext(script: Script) {
        const ctx = vm.createContext({
            console,
            __registerScriptLoad: (script_onLoad) => {
                this.registerScriptLoad(script, script_onLoad);
            }
        });
        return ctx;
    }


    private compileScript(source: string) {
        const compilerOptions = tsc.getDefaultCompilerOptions();
        compilerOptions.module = tsc.ModuleKind.ES2020;
        compilerOptions.target = tsc.ScriptTarget.ES2016;
        compilerOptions.moduleResolution = tsc.ModuleResolutionKind.NodeNext;
        const transpiled = tsc.transpileModule(source, { compilerOptions });

        let jsSource = transpiled.outputText;

        // Remove types import
        jsSource = jsSource.replace(`import "../types/ScriptCoreTypes";`, '');

        // Register functions

        jsSource += `\n__registerScriptLoad(onLoad);`;

        return jsSource;
    }



}

const instanceScriptsManager = new ScriptsManager();
export default instanceScriptsManager;