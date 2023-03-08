
import fs from 'fs';

const offsets: [string, string, number][] = [

    ['Client', '8B 0D ? ? ? ? 8A D8 85 C9', 0x3172B90],
    ['IsOpen', '', 0x814],
    ['HudInstance', '8B 0D ? ? ? ? 6A 00 8B ? ? E8 ? ? ? ? B0 01 ?', 0x18D4A3C],
    ['ZoomClass', '8D 4E 70 C7 05 ? ? ? ? ? ? ? ?', 0x316A6D8],
    ['ZoomAmount', '', 0x28],
    ['GameTime', 'F3 0F 11 05 ? ? ? ? 8B 49', 0x316B268],

    ['ObjectManager', '8B 0D ? ? ? ? 89 7C 24 14', 0x18D4A34],
    ['HeroList', '89 44 24 18 A1 ? ? ? ? 53 55', 0x18D4AD4],
    ['MissileList', '8B 0D ? ? ? ? 8D 44 24 1C 50', 0x3172B3C],

    ['Missile_StartPos', '', 0x2E0],
    ['Missile_EndPos', '', 0x2EC],
    ['Missile_SourceIndex', '', 0x2C4],
    ['Missile_DestinationIndex', '', 0x31c],
    ['Missile_SpellInfo', '', 0x0260],
    ['Missile_SpellDataMissileName', '', 0x18],

    ['SpellBook', '', 0x2250],

    ['SpellSlot_Instance', '', 0x4C8],
    ['SpellSlot_Level', '', 0x1c],
    ['SpellSlot_Time', '', 0x24],
    ['SpellSlot_Charges', '', 0x58],
    ['SpellSlot_SpellInfo', '', 0x120],
    ['SpellSlot_SpellInfoSpellData', '', 0x40],
    ['SpellSlot_SpellDataName', '', 0x6C],

    ['SpellEntry_Info', '', 0x8],
    ['SpellEntry_Slot', '', 0xC],
    ['SpellEntry_StartPos', '', 0x88],
    ['SpellEntry_EndPos', '', 0x94],
    ['SpellEntry_IsBasicA', '', 0xEC],

    ['SpellInfo_Name', '', 0x6C],
    ['SpellInfo_Data', '', 0x40],

    ['SpallData_Range', '', 0x3c0],
    ['SpallData_Radius', '', 0x3f8],
    ['SpallData_Speed', '', 0x44c],
    ['SpallData_Width', '', 0x474],

    ['MapInstance', 'FF 90 ? ? ? ? 8B 0D ? ? ? ? 89 88 ? ? ? ?', 0x18D4D88],

    ['Fn_GameUpdate', '', 0x324FA0],
    ['Fn_ObjectManagerUpdate', 'E8 ? ? ? ? E8 ? ? ? ? 6A 05', 0x2AC5D0],

    ['Fn_IsHero', 'E8 ? ? ? ? 83 C4 04 5B 84 C0', 0x18D2F0],
    ['Fn_IsMinion', '', 0x19F8C0],
    ['Fn_IsTurret', '', 0x19F9B0],
    ['Fn_IsMissile', '', 0x19F8E0],
    ['Fn_IsInhibitor', '', 0x19F820],
    ['Fn_IsNexus', '', 0x19F860],
    ['Fn_IsAlive', 'E8 ? ? ? ? 84 C0 74 2A 8D 8F ? ? ? ?', 0x17FEA0],

    ['Fn_IsNotWall', '', 0xA3F000],

    ['Fn_IssueOrder', '', 0x167340],
    ['Fn_NewIssueOrder', 'E8 ? ? ? ? 84 C0 74 13 C7 46 ? ? ? ? ?', 0x66BA80],
    ['Fn_NewCastSpell', '', 0x651C80],
    ['Fn_GetSpellState', '83 EC 14 8B 44 24 1C 55', 0x523610],
    ['Fn_GetBasicAttack', 'E8 ? ? ? ? 83 38 00 74 4B', 0x154310],
    ['Fn_SpoofGadget', '', 0xF7F0E3],

    ['Fn_GetStatTotal', '', 0x1C23B0],

    ['Fn_CompareFlags', 'E8 ? ? ? ? 84 C0 0F 84 ? ? ? ? 8A 43 DD', 0x15F1F0],
    ['Fn_OnCreateObject', 'E8 ? ? ? ? 8B 1D ? ? ? ? 8D 44 24 34', 0x2AB2C0],
    ['Fn_OnDeleteObject', 'E8 ? ? ? ? 8B 4E 20 85 C9 74 0F', 0x2A4990],

    ['Fn_WorldToScreen', '85 C0 74 0C 8B 40 04', 0xAAD8F0],
    ['Fn_PrintChat', 'E8 ? ? ? ? 8B 4C 24 20 C6 47 0D 01', 0x5EDE10],
    ['Fn_SendChat', 'A1 ? ? ? ? 56 6A FF', 0x2522330],

    ['Fn_GetHeightAtPos', 'E8 ? ? ? ? 8B 44 24 0C D9 18', 0xA4B8A0],

    ['Fn_GetAttackDelay', 'D9 9E ? ? ? ? 57 E8 ? ? ? ?', 0x1620A8],
    ['Fn_GetAttackCastDelay', 'E8 ? ? ? ? D9 9E ? ? ? ? 57 E8 ? ? ? ?', 0x2A3A60],

    ['Fn_GetBaseDrawPosition', 'E8 ? ? ? ? EB 07 8B 01', 0x156920],
    ['Fn_GetHealthBarPosition', ' 85 C0 74 0C 8B 40 04', 0x61A1E0],

    ['Fn_GetRespawnTimer', '83 EC 08 56 8B F1 57 8D 8E ? ? 00 00 E8', 0x1600A0],

    ['Fn_OnProcessSpellCast', 'E8 ? ? ? ? 85 C0 0F 94 44 24 ?', 0x54AA30],
    ['Fn_OnBuff', '53 55 8B 6C 24 0C 8B D9 55', 0x541E50],



    ['UnderMouseObject', '89 0D ? ? ? ? C7 41 ? ? ? ? ? C7 41 ? ? ? ? ?', 0x252230C],
    ['LocalPlayer', '8B 0D ? ? ? ? 81 C1 ? ? ? ? 8B 01 FF 50 10 39 43 34', 0x3172ABC],


    ['GObject_Index', '', 0x0008],
    ['GObject_Team', '', 0x0034],
    ['GObject_Name', '', 0x54],
    ['GObject_NetworkID', '', 0xB4],
    ['GObject_Pos', '', 0x01DC],
    ['GObject_Visibility', '', 0x0274],
    ['GObject_Health', '', 0xE7C],
    ['GObject_MaxHealth', '', 0xE8C],
    ['GObject_Mana', '', 0x29C],
    ['GObject_MaxMana', '', 0x2AC],
    ['GObject_Invulnerable', '', 0x3D4],
    ['GObject_Targetable', '', 0x0D04],
    ['GObject_RecallState', '', 0xD90],
    ['GObject_CombatType', '', 0x2268],
    ['GObject_AtkRange', '', 0x13a4],
    ['GObject_ChampionName', '', 0x2cf0],
    ['GObject_MovementSpeed', '', 0x139c]

]


import SigFinder from '../components/SigFinder';
SigFinder.loadFile('F:\\LeagueReverse\\LeagueDumper-master\\Debug\\League of Legends_exe_PIDce4_League of Legends.exe_CE0000_x86.exe');

main()

function hex(num) {
    return `0x${num.toString(16).toUpperCase()}`;
}

function main() {

    //  const type = SigFinder.analyze('E8 ? ? ? ? EB 07 8B 01');
    //  console.log(type);
    //  const data = SigFinder.findAddressFromSig('E8 ? ? ? ? EB 07 8B 01', 0xCE0000, { ...type, debug: true });
    //  console.log(hex(data));
    //  console.log(hex(0x54AA30));

    // return
    // for (const offset of offsets) {

    //     const [name, sig, addr] = offset;

    //     if (sig.length == 0) continue;

    //     const result = SigFinder.analyze(sig)

    //     if (result) {
    //         const address = SigFinder.findAddressFromSig(sig, 0xCE0000, result);

    //         if (address == addr) {
    //             console.log('\t OK \t', name);
    //         } else {
    //             console.log('\t ERR \t', name, '\t\t', sig, '\t', hex(address), '\t', hex(addr));
    //         }

    //     } else {
    //         console.log('\t NOT \t', name, '\t', sig, '\t');
    //     }

    // }

    const result: string[] = ['export class Offsets {',];
    for (const offset of offsets) {
        const [name, sig, addr] = offset;
        result.push(`   static ${name} = ${hex(addr)};`);
    }
    result.push('}');
    fs.writeFileSync('src/offsets.ts', result.join('\n'));
}
