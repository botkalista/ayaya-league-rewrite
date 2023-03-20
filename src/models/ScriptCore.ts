import { AyayaLeague } from '../AyayaLeague';

import type { Drawer } from '../Drawer';
import { Vector2 } from './Vector';

import * as SettingsTypes from './renderer/SettingsGroup';

type AyayaLeagueOmit = 'cache' | 'initializeTick';

type CoreAyayaLeague = Omit<AyayaLeague, AyayaLeagueOmit>;

type DrawerOmit = 'setWindow' | 'onTickStart';

type CoreDrawer = Omit<Drawer, DrawerOmit>;

type CoreUtils = { getMousePosition(): Vector2 }

type ScriptCore = {
    drawer: CoreDrawer,
    game: CoreAyayaLeague,
    utils: CoreUtils
};

export default ScriptCore;