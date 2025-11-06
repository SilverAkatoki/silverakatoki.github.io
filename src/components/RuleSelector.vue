<script setup lang="ts">
import { ref } from "vue";
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();

const opinions = ref([
  "规则 1",
  "规则 2",
  "规则 3",
  "规则 1",
  "规则 2",
  "规则 3",
  "规则 1",
  "规则 2",
  "规则 3"
]);
const selectedOpinions = ref<number[]>([]);

const handleSelect = (idx: number) => {
  const index = selectedOpinions.value.indexOf(idx);
  if (index === -1) {
    selectedOpinions.value.push(idx);
  } else {
    selectedOpinions.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="rule-selector" ref="containerRef">
    <button type="button" class="rule-selector-button" @click="toggleDropdown">
      <div class="selected-rules-container">
        <span
          v-for="idx in selectedOpinions"
          :key="idx"
          class="selected-rule-item"
          >{{ opinions[idx] }}</span
        >
      </div>
    </button>
    <div class="dropdown-content" v-show="isOpen">
      <div
        v-for="(option, index) in opinions"
        :key="index"
        class="rule-item"
        @click="handleSelect(index)"
      >
        <span>{{ option }}</span>
        <span v-show="selectedOpinions.includes(index)">✓</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.rule-selector {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}

.rule-selector-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  cursor: pointer;
  background: none;
  border: 1px solid #767676;
  border-radius: 2px;
}

.selected-rules-container {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: 4px;
  gap: 4px;
  text-align: left;
  flex: 1 1 0;
  width: auto;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
}

.selected-rule-item {
  display: inline-flex;
  padding: 0px 6px;
  border-radius: 2px;
  background-color: #ddd;
  color: #3b4256;
  font-size: 12px;
  line-height: 1.4;
  flex-shrink: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  min-width: 10em;
  background-color: #fff;
  border: 1px solid silver;
  border-radius: 3px;
  white-space: nowrap;
  z-index: 1;
}

.dropdown-content > div {
  user-select: none;
  color: black;
  text-decoration: none;
  display: block;
  margin: 3px 3px;
  border-radius: 3px;
  padding: 0.2px 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.rule-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rule-item > span {
  font-size: 14px;
}

.rule-item:hover {
  background-color: #eee;
}
</style>
