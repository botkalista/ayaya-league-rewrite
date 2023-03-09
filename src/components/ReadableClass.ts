import reader from './Reader';

export abstract class ReadableClass {
    constructor(public address: number) { }
    read<T>(offset: number, type: string): T {
        return reader.read(this.address + offset, type, false);
    }
    readByte(offset: number) {
        return reader.read<number>(this.address + offset, "byte", false);
    }
    readInt(offset: number) {
        return reader.read<number>(this.address + offset, "int32", false);
    }
    readFloat(offset: number) {
        return reader.read<number>(this.address + offset, "float", false);
    }
    readString(offset: number) {
        return reader.read<string>(this.address + offset, "string", false);
    }
}