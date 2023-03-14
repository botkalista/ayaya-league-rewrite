
export interface Injector {
    inject(processName: string, path: string): number;
    getFunctionAddress(handle: number, functionName: string): number;
    getLeaguePID(): number;
}

const injector: Injector = require("../build/Release/injector.node");
export default injector;