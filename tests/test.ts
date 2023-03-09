import tsc from 'typescript';
import fs from 'fs';

import vm from 'vm';


const text = fs.readFileSync("F:\\ayaya-league-rewrite\\userscripts\\index.ts", 'utf8');


const compilerOptions = tsc.getDefaultCompilerOptions();
compilerOptions.module = tsc.ModuleKind.ES2020;
compilerOptions.target = tsc.ScriptTarget.ES2016;
compilerOptions.moduleResolution = tsc.ModuleResolutionKind.NodeNext;

const source = tsc.transpileModule(text, { compilerOptions });

const script = new vm.Script(
    source.outputText
        .replace(`import "../types/ScriptCoreTypes";`, '')
    + '\n registerFunctions(onLoad)'
    , {});

function registerFunctions(fn) {
    console.log(fn);
    fn();
}

const result = script.runInNewContext({ registerFunctions, console }, {});

console.log('RESULT:', result);