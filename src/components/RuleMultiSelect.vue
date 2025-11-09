<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

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

const selectedOpinionIndices = ref<number[]>([]);
const showedSelectedOpinionIndices = ref<number[]>([]);

const selectedRulesContainerRef = ref<HTMLElement | null>(null);
const measurementSelectedRuleItem = ref<HTMLElement | null>(null);

const handleSelect = (idx: number) => {
  const index = selectedOpinionIndices.value.indexOf(idx);
  if (index === -1) {
    selectedOpinionIndices.value.push(idx);
  } else {
    selectedOpinionIndices.value.splice(index, 1);
  }
};

const resizeObserver = ref<ResizeObserver | null>(null);

onMounted(() => {
  if (selectedRulesContainerRef.value) {
    resizeObserver.value = new ResizeObserver(updateShowedOpinions);
    resizeObserver.value.observe(selectedRulesContainerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

const updateShowedOpinions = async () => {
  await nextTick();

  const container = selectedRulesContainerRef.value;
  if (!container) return;

  const item = measurementSelectedRuleItem.value;
  if (!item) return;

  const containerWidth = container.clientWidth;
  if (containerWidth === 0) return;
  // 当下来菜单隐藏时，容器宽度为 0，跳过更新以保持上次有效布局。

  const newShowedIndices = [];
  let currentWidth = 0;

  for (const index of selectedOpinionIndices.value) {
    item.textContent = opinions.value[index];
    const itemWidth = item.offsetWidth;

    if (currentWidth + itemWidth <= containerWidth) {
      newShowedIndices.push(index);
      currentWidth += itemWidth;
    } else {
      break;
    }
  }

  showedSelectedOpinionIndices.value = newShowedIndices;
};

watch(selectedOpinionIndices, updateShowedOpinions, { deep: true });

const getItemDisplay = (item: number, index: number) => {
  if (
    showedSelectedOpinionIndices.value.length <
      selectedOpinionIndices.value.length &&
    index === showedSelectedOpinionIndices.value.length - 1
  ) {
    return `+ ${selectedOpinionIndices.value.length - showedSelectedOpinionIndices.value.length + 1}`;
  }
  return opinions.value[item];
};
</script>

<template>
  <div ref="containerRef" class="rule-selector">
    <button type="button" class="rule-selector-button" @click="toggleDropdown">
      <div ref="selectedRulesContainerRef" class="selected-rules-container">
        <span
          v-for="(item, index) in showedSelectedOpinionIndices"
          :key="index"
          class="selected-rule-item">
          {{ getItemDisplay(item, index) }}
        </span>
      </div>
    </button>
    <div v-show="isOpen" class="dropdown-content">
      <div
        v-for="(option, index) in opinions"
        :key="index"
        class="rule-item"
        @click="handleSelect(index)">
        <span>{{ option }}</span>
        <span v-show="selectedOpinionIndices.includes(index)">✓</span>
      </div>
    </div>
  </div>
  <div :style="{ position: 'absolute', left: '-9999px' }">
    <span ref="measurementSelectedRuleItem" class="selected-rule-item"></span>
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
  overflow: hidden;
}

.selected-rules-container {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-left: 4px;
  gap: 4px;
  text-align: left;
  flex: 1 1 0;
  white-space: nowrap;
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
