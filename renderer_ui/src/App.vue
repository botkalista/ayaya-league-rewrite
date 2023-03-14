
<template>
  <div
    class="settings"
    v-if="showSettings"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <group :groups="groups"></group>
  </div>

  <div class="overlay" id="overlay"></div>
  <div
    class="static-menu"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <el-button
      @click="showSettings = !showSettings"
      :plain="showSettings"
      type="primary"
      size="small"
    >
      Settings
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
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

    Drawer.createCanvas(function (p) {
      const sz = AyayaApi.getSize();
      const canvas = p.createCanvas(sz.width, sz.height);
      canvas.parent("overlay");
      p.noLoop();
    });
  },
  methods: {
    onMouseEnter() {
      AyayaApi.setMouseEvents(false, true);
    },
    onMouseLeave() {
      AyayaApi.setMouseEvents(true, true);
    },
  },
});
</script>



<style scoped>
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
  background: var(--settings-bg);
  border-radius: 16px;
  overflow-y: scroll;
  width: 400px;
  height: 600px;
  margin-left: auto;
  margin-right: 15px;
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
