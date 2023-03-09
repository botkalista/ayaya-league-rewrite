import { AyayaLeague } from './AyayaLeague';

type AyayaLeagueOmit = 'cache' | 'initializeTick';

type CoreAyayaLeague = Omit<AyayaLeague, AyayaLeagueOmit>;


type onTickFunction = (core: ScriptCore) => any;

type ScriptCore = {
    game: CoreAyayaLeague,
    onTick: (onTickFunction) => any
};

export default ScriptCore;
