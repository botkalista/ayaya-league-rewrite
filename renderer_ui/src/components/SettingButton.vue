<template>
  <div class="setting-button">
    <el-button
      @click="onClick(path, sid, setting)"
      style="width: 200px; border-radius: 8px;"
    >{{ setting.text }}</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { SettingButton } from "../../../src/models/renderer/SettingsGroup";

declare module AyayaApi {
  function changeSetting(path: string, key: string, value: any);
}
export default defineComponent({
  name: "SettingButton",
  props: {
    setting: Object as PropType<SettingButton>,
    path: String,
    sid: String,
  },
  methods: {
    onClick(path: string, sid: string, setting: SettingButton) {
      AyayaApi.changeSetting(path, sid, undefined);
    },
  },
});
</script>

<style scoped>
.setting-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>