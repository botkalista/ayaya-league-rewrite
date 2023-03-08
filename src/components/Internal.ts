
import fs from 'fs';

enum Action {
    CALL_FUNCTION = 1,
}

enum Function {
    PRINT_CHAT = 1,
}

class Internal {

    pipe: fs.WriteStream;

    openPipe(pipeName: string = 'myPipe') {
        this.pipe = fs.createWriteStream(`\\\\.\\pipe\\${pipeName}`);
    }

    callFunction(fn: Function, args: any[]) {
        const payload = [Action.CALL_FUNCTION, fn];
        for (const arg of args) { payload.push(arg); }
        const buffer = Buffer.from(payload);
        this.pipe.write(buffer);
    }


}

const internal = new Internal();
export default internal;