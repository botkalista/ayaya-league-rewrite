import tsc from 'typescript';
import fs from 'fs';
import vm from 'vm';
import path from 'path';

import addon from '../addons_cpp/injector/Injector';

import { Setting } from '../models/renderer/SettingsGroup';
import ScriptCore from '../models/ScriptCore';

import Drawer from '../Drawer';

import type { IScript } from '../../types/ScriptTypes';

import type { AyayaLeague } from '../AyayaLeague';
import { Vector2 } from '../models/Vector';


type Script = {
    path: string,
    source: string,
} & IScript

class ScriptsManager {
    public scripts: Script[] = [];
    public ayayaLeague: AyayaLeague;
    private lastDirPath: string;
    private core: ScriptCore;

    setAyayaLeague(ayayaLeague: AyayaLeague) {
        this.ayayaLeague = ayayaLeague;
    }


    // Read scripts, compile them and add to this.scripts
    loadScripts(dirPath: string) {
        this.lastDirPath = dirPath;
        const files = fs.readdirSync(dirPath);

        for (const fileName of files) {

            const filePath = path.join(dirPath, fileName);

            const fileContent = fs.readFileSync(filePath, 'utf8');

            const source = this.compileScript(fileContent);

            const scriptClass = eval(source);

            const script = new scriptClass();

            script.source = source;
            script.path = fileName;
            script.fullPath = filePath;

            this.scripts.push(script);

        }

        for (const script of this.scripts) {
            script.onLoad?.();
        }

    }

    private compileScript(source: string) {
        const noImportSource = source.split('\n').filter(e => !e.startsWith('import')).join('\n');
        const compilerOptions = tsc.getDefaultCompilerOptions();
        compilerOptions.module = tsc.ModuleKind.NodeNext;
        // compilerOptions.target = tsc.ScriptTarget.ESNext;
        // compilerOptions.moduleResolution = tsc.ModuleResolutionKind.NodeNext;
        const transpiled = tsc.transpileModule(noImportSource, { compilerOptions });

        let jsSource = transpiled.outputText;
        return jsSource;
    }

    reloadAll() {
        for (const script of this.scripts) {
            script.onUnload?.();
        }
        this.scripts.length = 0;
        this.loadScripts(this.lastDirPath);
    }

    private getCore() {
        if (this.core && this.ayayaLeague) return this.core;
        const core: ScriptCore = {
            game: this.ayayaLeague,
            drawer: Drawer,
            utils: {
                getMousePosition: () => {
                    const pos = addon.getMousePosition();
                    return new Vector2(pos.x, pos.y);
                }
            }
        };
        this.core = core;
        return this.core;
    }

    changeSetting(path: string, key: string, value: any) {

        const script = this.scripts.find(e => e.path == path);
        if (!script) return;

        const setting = script.settings[key];
        if (!setting) return;

        if (setting['value'] != undefined) setting['value'] = value;
    }

    getSettings() {
        const result = {};
        for (const script of this.scripts) {
            const { title, settings, description } = script;
            result[script.path] = { title, settings, description }
        }
        return result;
    }

    onDraw() {
        this.scripts.forEach(script => {
            script.onDraw(this.getCore());
        })
    }

}

const instanceScriptsManager = new ScriptsManager();
export default instanceScriptsManager;