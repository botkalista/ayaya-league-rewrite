<template>
  <div class="setting-input">
    <div>{{ setting.text }}</div>
    <el-input
      :type="inputType"
      style="font-size: 16px"
      v-model="setting.value"
      spellcheck="false"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { SettingInput } from "../../../src/models/renderer/SettingsGroup";

export default defineComponent({
  name: "SettingInput",
  props: { setting: Object as PropType<SettingInput> },
  computed: {
    inputType() {
      return this.setting.multiline ? "textarea" : "text";
    },
  },
});
</script>

<style scoped>
.setting-input {
  margin: 3px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>