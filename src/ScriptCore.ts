import { AyayaLeague } from './AyayaLeague';

import type { Drawer } from './Drawer';

type AyayaLeagueOmit = 'cache' | 'initializeTick';

type CoreAyayaLeague = Omit<AyayaLeague, AyayaLeagueOmit>;

type DrawerOmit = 'setWindow' | 'onTickStart';

type CoreDrawer = Omit<Drawer, DrawerOmit>;

type onTickFunction = (core: ScriptCore) => any;

type ScriptCore = {
    drawer: CoreDrawer,
    game: CoreAyayaLeague,
    onTick: (onTickFunction) => any
};

export default ScriptCore;
