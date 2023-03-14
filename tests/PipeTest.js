const fs = require('fs');

const pipe = fs.createWriteStream(`\\\\.\\pipe\\myPipe`);
pipe.on('open', () => {
    console.log('PIPE OPEN')
    // pipe.destroy();
    setTimeout(() => {
        const message = "hello";
        const buffer = Buffer.alloc(2 + 4 + 4 + message.length + 1)
        let offset = 0;
        buffer.writeUInt8(1, offset++);
        buffer.writeUInt8(1, offset++);
        buffer.writeFloatLE(10, offset);
        offset += 4;
        buffer.writeFloatLE(7, offset);
        offset += 4;
        buffer.write(message, offset, message.length, "utf8");
        offset += message.length;
        buffer.writeUInt8(0, offset);

        console.log(buffer);
        pipe.write(buffer);



    }, 1000);
})

function stringToBytes(msg) {
    return Buffer.from(msg, 'utf8');
}


function callFunction(fn, args) {
    const payload = [Action.CALL_FUNCTION, fn];
    for (const arg of args) { payload.push(arg); }
    const buffer = Buffer.from(payload);
    pipe.write(buffer);
}