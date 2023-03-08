
export interface Mem {
    getProcesses(): any[];
    openProcess(name: string): any;
    readMemory(handle: number, address: number, type: string): any;
    findPattern(handle: number, pattern: string, flags: number): any;
    readBuffer(handle: number, address: number, size: number): Buffer;
}

const mem: Mem = require("memoryjs");

export default mem;