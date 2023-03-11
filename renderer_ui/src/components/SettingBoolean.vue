<template>
  <div class="setting-boolean">
    <div>{{ setting.text }}</div>
    <el-switch v-model="setting.value" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { SettingBoolean } from "../../../src/models/renderer/SettingsGroup";

export default defineComponent({
  name: "SettingBoolean",
  props: { setting: Object as PropType<SettingBoolean> },
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