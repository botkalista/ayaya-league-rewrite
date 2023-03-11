
<template>
  <!-- <div class="settings" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
    <group :groups="groups"></group>
  </div> -->
  <div class="overlay" id="overlay"></div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import Group from "./components/Group.vue";

const state = reactive({
  groups: [],
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
  margin: auto;
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
