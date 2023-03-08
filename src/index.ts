import mem from './addons_cpp/mem/Mem';
import addon from './addons_cpp/injector/Injector';

// console.log(process.arch);

// const inject = addon.inject("EFCT_Target.exe", "C:\\Users\\Emily\\source\\repos\\AyayaDLL\\Debug\\AyayaDLL.dll");



import SigFinder from './components/SigFinder';

SigFinder.loadFile('F:\\LeagueReverse\\LeagueDumper-master\\Debug\\League of Legends_exe_PIDce4_League of Legends.exe_CE0000_x86.exe')


const client = '8B 0D ? ? ? ? 8A D8 85 C9'
const options = SigFinder.analyze(client);
const addr = SigFinder.findAddressFromSig(client, 0xCE0000, options);

console.log(options, addr);

console.log(addr.toString(16));

    // findSignature('8B 0D ? ? ? ? 81 C1 ? ? ? ? 8B 01 FF 50 10 39 43 34')

// const result = [];
// const base = 0x010052DA - 0xCE0000;
// for (let i = 0; i < 10; i++) {
//     const addr = base + i;
//     result.push(buffer.at(addr).toString(16));
// }

// console.log(result.join(' '));
