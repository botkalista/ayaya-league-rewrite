import { AyayaLeague } from './AyayaLeague';

import type { Drawer } from './Drawer';

import * as SettingsTypes from './models/renderer/SettingsGroup';

type AyayaLeagueOmit = 'cache' | 'initializeTick';

type CoreAyayaLeague = Omit<AyayaLeague, AyayaLeagueOmit>;

type DrawerOmit = 'setWindow' | 'onTickStart';

type CoreDrawer = Omit<Drawer, DrawerOmit>;

type ScriptCore = {
    drawer: CoreDrawer,
    game: CoreAyayaLeague
};

export default ScriptCore;


//TODO: Move to types or models