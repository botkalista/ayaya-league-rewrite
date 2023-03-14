<template>
  <div class="ayaya-group" v-for="group of groups">
    <div class="sTitle">{{ group.title }}</div>
    <div class="allsettings">
      <div class="sContent" v-for="setting of group.settings">
        <div
          v-if="setting.type == 'none'"
          style="height: 32px; align-items: center; display: flex"
        >
          <div>{{ setting.text }}</div>
        </div>

        <div
          v-if="setting.type == 'text'"
          style="
            display: flex;
            width: 100%;
            height: 32px;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div>{{ setting.text }}</div>
          <div>{{ setting.value }}</div>
        </div>

        <setting-boolean v-if="setting.type == 'boolean'" :setting="setting">
        </setting-boolean>

        <setting-number v-if="setting.type == 'number'" :setting="setting">
        </setting-number>

        <setting-input v-if="setting.type == 'input'" :setting="setting">
        </setting-input>

        <setting-button v-if="setting.type == 'button'" :setting="setting">
        </setting-button>

        <!-- <div>{{ setting.text }}</div>
        <div v-if="setting.type == 'none'"></div>

        <div class="text" v-if="setting.type == 'text'">
          {{ setting.value }}
        </div>

        <div v-if="setting.type == 'number'">
          <el-input-number style="width: 110px" v-model="setting.value[2]" :min="setting.value[0]" :max="setting.value[1]" />
        </div>

        <div v-if="setting.type == 'boolean'">
          <el-switch size="default" v-model="setting.value"></el-switch>
        </div> -->
      </div>
    </div>
    <div class="sDesc" v-if="group.description">{{ group.description }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { SettingsGroup } from "../../../src/models/renderer/SettingsGroup";

import SettingInput from "./SettingInput.vue";
import SettingNumber from "./SettingNumber.vue";
import SettingBoolean from "./SettingBoolean.vue";
import SettingButton from "./SettingButton.vue";

export default defineComponent({
  components: { SettingInput, SettingNumber, SettingBoolean, SettingButton },
  name: "Group",
  props: { groups: Object as PropType<SettingsGroup> },
});
</script>

<style scoped>
.sTitle {
  color: var(--settings-color-group);
  padding: 5px 0 8px 32px;
  font-size: 16px;
}

.allsettings {
  border-radius: 14px;
  background-color: var(--setting-bg);
  margin-left: 16px;
  margin-right: 16px;
}

.sContent div {
  color: var(--settings-color-group);
  /* height: 20px; */
}

.sContent {
  color: var(--settings-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 9px;
  padding-bottom: 9px;
  font-size: 17px;
  margin: 0 16px;
}

.sContent:not(:last-child) {
  border-bottom: 1px solid #e6e6e6;
}

.sDesc {
  color: var(--settings-color-group);
  font-size: 14px;
  padding: 8px 16px 16px 32px;
}
</style>