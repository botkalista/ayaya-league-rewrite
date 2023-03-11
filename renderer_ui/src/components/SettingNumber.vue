<template>
  <div class="setting-number">
    <div>{{ setting.text }}</div>
    <el-input-number
      style="font-size: 16px"
      v-model="setting.value"
      :min="setting.min||0"
      :max="setting.max||100"
      :step="setting.step || 1"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { SettingNumber } from "../../../src/models/renderer/SettingsGroup";

export default defineComponent({
  name: "SettingNumber",
  props: { setting: Object as PropType<SettingNumber> },
});
</script>

<style scoped>
.setting-number {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>