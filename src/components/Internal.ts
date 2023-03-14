
import fs from 'fs';

export enum Action {
    CALL_FUNCTION = 1,
}

export enum Function {
    PRINT_CHAT = 1,
}

class Internal {

    pipe: fs.WriteStream;

    openPipe(pipeName: string = 'myPipe', onOpen: () => any) {
        try {
            this.pipe = fs.createWriteStream(`\\\\.\\pipe\\${pipeName}`);
            this.pipe.on('open', onOpen)
        } catch (ex) {
            console.log('Trying to open pipe', pipeName);
            console.error('ERROR', ex)
        }
    }

    callPrintChat(msg: string) {
        if (this.pipe) {
            const buffer = Buffer.alloc(2 + 4 + 4 + msg.length + 1)
            let offset = 0;
            buffer.writeUInt8(Action.CALL_FUNCTION, offset++);
            buffer.writeUInt8(Function.PRINT_CHAT, offset++);
            buffer.writeFloatLE(0, offset);
            offset += 4;
            buffer.writeFloatLE(0, offset);
            offset += 4;
            buffer.write(msg, offset, msg.length, "utf8");
            offset += msg.length;
            buffer.writeUInt8(0, offset);

            console.log(buffer);
            this.pipe.write(buffer);
        }
    }

    callFunction(fn: Function, args: any[]) {
        if (this.pipe) {
            const payload = [Action.CALL_FUNCTION, fn];
            for (const arg of args) { payload.push(arg); }
            const buffer = Buffer.from(payload);
            this.pipe.write(buffer);
        }
    }


}

const internal = new Internal();
export default internal;