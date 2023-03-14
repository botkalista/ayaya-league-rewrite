<template>
  <div class="setting-boolean">
    <div>{{ setting.text }}</div>
    <el-switch @change="onChange(setting)" v-model="setting.value" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { SettingBoolean } from "../../../src/models/renderer/SettingsGroup";

declare module AyayaApi {
  function changeSetting(id: string, value: any);
}

export default defineComponent({
  name: "SettingBoolean",
  props: { setting: Object as PropType<SettingBoolean> },
  methods: {
    onChange(setting: SettingBoolean) {
      AyayaApi.changeSetting(setting.id, setting.value);
    },
  },
});
</script>

<style scoped>
.setting-boolean {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>