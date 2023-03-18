<template>
  <div class="overlay" id="overlay"></div>

  <div class="settings" v-if="showSettings" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <group :groups="groups"></group>

    <div class="base-settings">
      <div class="base-setting">
        <div class="reload">
          <el-button
            @click="reloadScripts()"
            style="width: 200px; border-radius: 8px"
          >Reload scripts</el-button>
        </div>
      </div>
    </div>
  </div>

  <div class="static-menu" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <el-button
      @click="showSettings = !showSettings"
      :plain="showSettings"
      type="primary"
      size="small"
    >Settings</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import Group from "./components/Group.vue";

const state = reactive({
  groups: [],
  showSettings: false,
});

declare module AyayaApi {
  function setMouseEvents(ignore: boolean, forward: boolean);
  function getSettings(): any;
  function getSize(): { x: number; y: number; width: number; height: number };
  function onAction(cb: (...args: any) => any): void;
  function reloadScripts(): any;
  function requestThingsToDraw(): any;
}

import Drawer from "./drawer";

export default defineComponent({
  components: { Group },
  data() {
    return state;
  },
  setup() {
    const settings = AyayaApi.getSettings();
    state.groups = settings;

    // console.log(state.groups);

    const render_fps_setting = state.groups[0].settings.find(
      (e) => e.id == "render_fps"
    );

    Drawer.createCanvas(
      function (p) {
        const sz = AyayaApi.getSize();
        const canvas = p.createCanvas(sz.width, sz.height + 40);
        canvas.parent("overlay");
      },
      function (p) {
        p.frameRate(parseInt(render_fps_setting.value));
        // console.log("START DRAW");
        AyayaApi.requestThingsToDraw();
        // Drawer.drawText(
        //   p.frameRate() + " " + render_fps_setting.value,
        //   200,
        //   200,
        //   20
        // );
        // console.log("END DRAW");
      }
    );

    AyayaApi.onAction((event, args) => {
      Drawer.clear();
      const actions = args;
      for (const action of actions) {
        const fn = action.splice(0, 1)[0];
        // console.log(Date.now(), fn);
        Drawer[fn](...action);
      }
    });
  },
  methods: {
    onMouseEnter() {
      AyayaApi.setMouseEvents(false, true);
    },
    onMouseLeave() {
      AyayaApi.setMouseEvents(true, true);
    },
    reloadScripts() {
      const newSettings = AyayaApi.reloadScripts();
      state.groups = newSettings;
    },
  },
});
</script>

<style scoped>
.base-settings {
  border-radius: 14px;
  background-color: var(--setting-bg);
  margin-left: 16px;
  margin-right: 16px;
}

.base-setting {
  color: var(--settings-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 9px;
  padding-bottom: 9px;
  font-size: 17px;
  margin: 0 16px;
}

.base-setting .reload {
  display: flex;
  justify-content: center;
  width: 100%;
}

.static-menu {
  position: absolute;
  top: 0px;
  left: 0px;
  width: max-content;
  height: max-content;
  padding: 5px;
  margin: 5px;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  /* background-color: rgba(0, 0, 0, 0.1); */
}

.settings {
  position: absolute;
  background: var(--settings-bg);
  border-radius: 16px;
  overflow-y: scroll;
  width: 400px;
  height: 600px;
  right: 15px;
  margin-top: 20vh;
  padding-top: 8px;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 16px;
}

::-webkit-scrollbar-thumb {
  background: #cccccc;
  background: hsl(224, 68%, 50%);
  border-radius: 16px;
}

::-webkit-scrollbar-track-piece:end {
  background: transparent;
  margin-bottom: 15px;
}

::-webkit-scrollbar-track-piece:start {
  background: transparent;
  margin-top: 15px;
}
</style>
