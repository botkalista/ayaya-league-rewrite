import mem from '../addons_cpp/mem/Mem';

class Reader {

    private attached: boolean = false;
    private handle: number;
    private baseAddress: number;

    constructor() { }

    attach(pName: string) {
        if (this.attached) return;
        const processes = mem.getProcesses()
        const targetProcess = processes.filter(e => e.szExeFile.startsWith(pName))[0];
        if (!targetProcess) throw Error('Error finding process');
        const process = mem.openProcess(targetProcess.szExeFile);
        this.handle = process.handle;
        this.baseAddress = process.modBaseAddr;
        this.attached = true;
    }

    findPattern(pattern: string) {
        const address = mem.findPattern(this.handle, pattern, 0x0);
        return address;
    }

    read<T>(address: number, type: string, fromBase: boolean = false): T {
        return mem.readMemory(this.handle, (fromBase ? this.baseAddress : 0) + address, type);
    }

    readBuffer(address: number, size: number, fromBase: boolean = false) {
        return mem.readBuffer(this.handle, (fromBase ? this.baseAddress : 0) + address, size)
    }

    readByte(address: number, fromBase: boolean = false) {
        return this.read<number>(address, "byte", fromBase);
    }

    readFloat(address: number, fromBase: boolean = false) {
        return this.read<number>(address, "float", fromBase);
    }

    readInt(address: number, fromBase: boolean = false) {
        return this.read<number>(address, "int32", fromBase);
    }

    readString(address: number, fromBase: boolean = false) {
        return this.read<string>(address, "string", fromBase);
    }

}

const singletonReader = new Reader();

export default singletonReader;