<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";

const props = defineProps<{
  options: string[];
  modelValue?: string[];
}>();

const emit = defineEmits<{
  (event: "selected", payload: string[]): void;
  (event: "update:modelValue", payload: string[]): void;
}>();

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();

const selectedValues = ref<string[]>(
  props.modelValue ? [...props.modelValue] : []
);
const visibleSelectionIndices = ref<number[]>([]);

const selectedRulesContainerRef = ref<HTMLElement | null>(null);
const measurementSelectedRuleItem = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);

const optionList = computed(() => props.options);
const selectedValueSet = computed(() => new Set(selectedValues.value));

const arraysAreEqual = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

watch(
  () => props.modelValue,
  newValue => {
    const normalized = Array.isArray(newValue) ? [...newValue] : [];
    if (!arraysAreEqual(normalized, selectedValues.value)) {
      selectedValues.value = normalized;
    }
  },
  { deep: true }
);

const emitSelection = (values: string[]) => {
  emit("selected", values);
  emit("update:modelValue", values);
};

const handleSelect = (option: string) => {
  const next = [...selectedValues.value];
  const existingIndex = next.indexOf(option);
  if (existingIndex === -1) {
    next.push(option);
  } else {
    next.splice(existingIndex, 1);
  }
  selectedValues.value = next;
  emitSelection(next);
};

const updateVisibleSelections = async () => {
  await nextTick();

  const container = selectedRulesContainerRef.value;
  if (!container) return;

  const item = measurementSelectedRuleItem.value;
  if (!item) return;

  const containerWidth = container.clientWidth;
  if (containerWidth === 0) return;
  // 当下拉菜单关闭时，不要重置宽度，否则会让标签省略失效

  const newVisibleIndices: number[] = [];
  let currentWidth = 0;

  selectedValues.value.forEach((value, index) => {
    item.textContent = value;
    const itemWidth = item.offsetWidth;

    if (currentWidth + itemWidth <= containerWidth) {
      newVisibleIndices.push(index);
      currentWidth += itemWidth;
    }
  });

  visibleSelectionIndices.value = newVisibleIndices;
};

watch(selectedValues, updateVisibleSelections, { deep: true });

onMounted(() => {
  if (selectedRulesContainerRef.value) {
    resizeObserver.value = new ResizeObserver(() => {
      void updateVisibleSelections();
    });
    resizeObserver.value.observe(selectedRulesContainerRef.value);
  }
  void updateVisibleSelections();
});

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

const getItemDisplay = (selectedIndex: number, loopIndex: number) => {
  const visibleCount = visibleSelectionIndices.value.length;
  const totalCount = selectedValues.value.length;

  if (
    visibleCount > 0 &&
    visibleCount < totalCount &&
    loopIndex === visibleCount - 1
  ) {
    return `+ ${totalCount - visibleCount + 1}`;
  }
  return selectedValues.value[selectedIndex];
};

const isOptionSelected = (option: string) => selectedValueSet.value.has(option);
</script>

<template>
  <div ref="containerRef" class="rule-selector">
    <button type="button" class="rule-selector-button" @click="toggleDropdown">
      <div ref="selectedRulesContainerRef" class="selected-rules-container">
        <template v-if="selectedValues.length > 0">
          <span
            v-for="(selectedIndex, index) in visibleSelectionIndices"
            :key="`${selectedIndex}-${selectedValues[selectedIndex]}`"
            class="selected-rule-item">
            {{ getItemDisplay(selectedIndex, index) }}
          </span>
        </template>
      </div>
    </button>
    <div v-show="isOpen" class="dropdown-content">
      <div
        v-for="(option, index) in optionList"
        :key="`${option}-${index}`"
        class="rule-item"
        @click="handleSelect(option)">
        <span>{{ option }}</span>
        <span v-show="isOptionSelected(option)">✓</span>
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
