
import Reader from './Reader';
import * as math from 'mathjs';

export function readVTable(address: number): number[] {
    const result: number[] = [];

    const aList = Reader.readInt(address + 0x4);
    const size = Reader.readInt(address + 0x8);

    for (let i = 0; i < size; i++) {
        result.push(Reader.readInt(aList + (i * 0x4)));
    }

    return result;

}

export function readMatrix(address: number): math.Matrix {

    const buffer = Reader.readBuffer(address, 64, true);

    const matrix = math.matrix([
        [
            buffer.readFloatLE(0 * 4), buffer.readFloatLE(1 * 4),
            buffer.readFloatLE(2 * 4), buffer.readFloatLE(3 * 4)
        ],
        [
            buffer.readFloatLE(4 * 4), buffer.readFloatLE(5 * 4),
            buffer.readFloatLE(6 * 4), buffer.readFloatLE(7 * 4)
        ],
        [
            buffer.readFloatLE(8 * 4), buffer.readFloatLE(9 * 4),
            buffer.readFloatLE(10 * 4), buffer.readFloatLE(11 * 4)
        ],
        [
            buffer.readFloatLE(12 * 4), buffer.readFloatLE(13 * 4),
            buffer.readFloatLE(14 * 4), buffer.readFloatLE(15 * 4)
        ]
    ]);
    return matrix;
}