import fs from 'fs';

type FindMethod = 'DEFAULT' | 'RAW' | 'FUNCTION' | "DEFAULT2";

type FindOptions = { method?: FindMethod, skip?: number, debug?: boolean }
class SigFinder {
    buffer: Buffer;
    constructor() { }
    loadFile(path: string) { this.buffer = fs.readFileSync(path); }
    findSignature(signature: string) {
        let index = 0;
        const sigArray = signature.split(' ').map(e => {
            if (e == '?') return '?';
            return parseInt(e, 16);
        });
        for (let i = 0; i < this.buffer.length; i++) {
            let ok: boolean = true;
            for (let k = 0; k < sigArray.length; k++) {
                if (sigArray[k] == '?') continue;
                if (this.buffer.at(i + k) != sigArray[k]) { ok = false; break; }
            }
            if (ok == true) { index = i; break; }
        }
        return index;
    }
    groupPlaceholders(signature: string) {
        const groups = Array.from(signature.matchAll(/(\? )+/g))
        const result = groups.map(e => {
            return { index: signature.substring(0, e.index).split(' ').length - 1 }
        });
        return result;
    }
    findAddressFromSig(signature: string, baseAddress: number, options: FindOptions) {
        const res = this.findSignature(signature);
        if (res == 0) return -1;
        if (options.method == "RAW") {
            return res;
        } else if (options.method == "DEFAULT") {
            const groups = this.groupPlaceholders(signature);
            if (options.debug == true) console.log(groups);
            const skip = options.skip != undefined ? groups[options.skip].index : 0;
            if (options.debug == true) console.log('skip', skip);
            const addr = res + skip;
            if (options.debug == true) console.log('res', res.toString(16));
            if (options.debug == true) console.log('addr', addr.toString(16));
            const val = this.buffer.readInt32LE(addr) - baseAddress;
            if (options.debug == true) console.log('val', this.buffer.readInt32LE(addr).toString(16));
            if (options.debug == true) console.log('final', val.toString(16));
            return val;
        } else if (options.method == "FUNCTION") {
            const groups = this.groupPlaceholders(signature);
            if (options.debug == true) console.log(groups);
            const skip = options.skip != undefined ? groups[options.skip].index : 0;
            if (options.debug == true) console.log('skip', skip);
            const addr = res + skip;
            if (options.debug == true) console.log('res', res.toString(16));
            if (options.debug == true) console.log('addr', addr.toString(16));
            const val = this.buffer.readInt32LE(addr);
            if (options.debug == true) console.log('val', this.buffer.readInt32LE(addr).toString(16));
            if (options.debug == true) console.log('final', val.toString(16));
            return addr + 4 + val;
        } else {
            const addr = res + 2;
            const val = this.buffer.readInt32LE(addr) - baseAddress;
            return val;
        }
    }
    analyze(signature: string): FindOptions {

        // Simple DWORD
        const dword = signature.indexOf('8B 0D ?');
        if (dword > -1) {
            const groups = this.groupPlaceholders(signature);
            const group = groups.find(e => e.index >= dword);
            return { method: 'DEFAULT', skip: Math.max(groups.indexOf(group) - 1, 0) }
        }

        // MOV dword_00000000
        const dword_mov = signature.indexOf('C7 05 ?');
        if (dword_mov > -1) {
            const groups = this.groupPlaceholders(signature);
            const group = groups.find(e => e.index >= dword_mov);
            return { method: 'DEFAULT', skip: Math.max(groups.indexOf(group) - 1, 0) }
        }

        // MOV dword_00000000
        const dword_movss = signature.indexOf('F3 0F 11 05 ?');
        if (dword_movss > -1) {
            const groups = this.groupPlaceholders(signature);
            const group = groups.find(e => e.index >= dword_movss);
            return { method: 'DEFAULT', skip: Math.max(groups.indexOf(group) - 1, 0) }
        }

        // mov eax, dword_00000000
        const dword_mov_eax = signature.indexOf('A1 ?');
        if (dword_mov_eax > -1) {
            const groups = this.groupPlaceholders(signature);
            const group = groups.find(e => e.index >= dword_mov_eax);
            return { method: 'DEFAULT', skip: Math.max(groups.indexOf(group) - 1, 0) }
        }

        // mov call sub_000000
        const dword_call = signature.indexOf('E8 ?');
        if (dword_call > -1) {
            const groups = this.groupPlaceholders(signature);
            const group = groups.find(e => e.index >= dword_call);
            return { method: 'FUNCTION', skip: Math.max(groups.indexOf(group) - 1, 0) }
        }


    }
}
const instance = new SigFinder();

export default instance;