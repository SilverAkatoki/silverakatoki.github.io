<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

import searchIconUrl from "@/assets/icons/search.svg";
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";

const props = defineProps<{
  options: string[];
  modelValue?: string[];
  placeholder?: string;
}>();

const emit = defineEmits<{
  (event: "selected", payload: string[]): void;
  (event: "update:modelValue", payload: string[]): void;
}>();

const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();

const tagSearchText = ref("");
const selectedTags = ref<string[]>(props.modelValue ? [...props.modelValue] : []);
const visibleSelectedTagIndices = ref<number[]>([]);

const placeholderText = computed(() => props.placeholder ?? "请选择标签");
const tagOptions = computed(() => props.options ?? []);
const selectedTagSet = computed(() => new Set(selectedTags.value));

const arraysAreEqual = (a: string[], b: string[]): boolean =>
  a.length === b.length && a.every((value, index) => value === b[index]);

const emitSelection = (values: string[]) => {
  emit("selected", values);
  emit("update:modelValue", values);
};

watch(
  () => props.modelValue,
  newValue => {
    const normalized = Array.isArray(newValue) ? [...newValue] : [];
    if (!arraysAreEqual(normalized, selectedTags.value)) {
      selectedTags.value = normalized;
    }
  },
  { deep: true }
);

watch(
  tagOptions,
  options => {
    const optionSet = new Set(options);
    const filtered = selectedTags.value.filter(tag => optionSet.has(tag));
    if (!arraysAreEqual(filtered, selectedTags.value)) {
      selectedTags.value = filtered;
      emitSelection(filtered);
    }
  },
  { immediate: true }
);

const handleSelect = (tag: string) => {
  const next = [...selectedTags.value];
  const existingIndex = next.indexOf(tag);
  if (existingIndex === -1) {
    next.push(tag);
  } else {
    next.splice(existingIndex, 1);
  }
  selectedTags.value = next;
  emitSelection(next);
};

const showedTags = computed(() => {
  if (!tagSearchText.value) {
    return tagOptions.value;
  }
  const keyword = tagSearchText.value.toLowerCase();
  return tagOptions.value.filter(tag => tag.toLowerCase().includes(keyword));
});

const selectedTagsContainerRef = ref<HTMLElement | null>(null);
const measurementSelectedTagItem = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);

const updateVisibleSelections = async () => {
  await nextTick();

  const container = selectedTagsContainerRef.value;
  if (!container) return;

  const item = measurementSelectedTagItem.value;
  if (!item) return;

  const containerWidth = container.clientWidth;
  if (containerWidth === 0) return;
  // Dropdown is hidden when closed which temporarily reports width=0.

  const newVisibleIndices: number[] = [];
  let currentWidth = 0;

  selectedTags.value.forEach((value, index) => {
    item.textContent = value;
    const itemWidth = item.offsetWidth;

    if (currentWidth + itemWidth <= containerWidth) {
      newVisibleIndices.push(index);
      currentWidth += itemWidth;
    }
  });

  visibleSelectedTagIndices.value = newVisibleIndices;
};

watch(
  selectedTags,
  () => {
    void updateVisibleSelections();
  },
  { deep: true }
);

watch(
  () => isOpen.value,
  opened => {
    if (opened) {
      void updateVisibleSelections();
    }
  }
);

onMounted(() => {
  if (selectedTagsContainerRef.value) {
    resizeObserver.value = new ResizeObserver(() => {
      void updateVisibleSelections();
    });
    resizeObserver.value.observe(selectedTagsContainerRef.value);
  }
  void updateVisibleSelections();
});

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

const getItemDisplay = (item: number, index: number) => {
  const visibleCount = visibleSelectedTagIndices.value.length;
  const totalCount = selectedTags.value.length;

  if (
    visibleCount > 0 &&
    visibleCount < totalCount &&
    index === visibleCount - 1
  ) {
    return `+ ${totalCount - visibleCount + 1}`;
  }
  return selectedTags.value[item];
};

const isTagSelected = (tag: string) => selectedTagSet.value.has(tag);
</script>

<template>
  <div ref="containerRef" class="rule-selector">
    <button type="button" class="rule-selector-button" @click="toggleDropdown">
      <div ref="selectedTagsContainerRef" class="selected-rules-container">
        <template v-if="selectedTags.length > 0">
          <span
            v-for="(item, index) in visibleSelectedTagIndices"
            :key="`${item}-${selectedTags[item]}`"
            class="selected-rule-item">
            {{ getItemDisplay(item, index) }}
          </span>
        </template>
        <span v-else class="selected-rule-placeholder">
          {{ placeholderText }}
        </span>
      </div>
    </button>
    <div v-show="isOpen" class="dropdown-content">
      <div class="search-container">
        <div class="search-field">
          <img
            class="search-icon"
            :src="searchIconUrl"
            alt=""
            aria-hidden="true" />
          <input
            v-model="tagSearchText"
            class="search-input"
            type="search"
            placeholder="搜索" />
        </div>
      </div>
      <div class="tags-container">
        <div
          v-for="tag in showedTags"
          :key="tag"
          class="tag-item"
          :class="{ selected: isTagSelected(tag) }"
          @click="handleSelect(tag)">
          <span>{{ tag }}</span>
        </div>
      </div>
    </div>
  </div>
  <div :style="{ position: 'absolute', left: '-9999px' }">
    <span ref="measurementSelectedTagItem" class="selected-rule-item"></span>
  </div>
</template>

<style scoped lang="css">
.search-container {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 8px;
}

.search-field {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.6rem;
  top: 50%;
  width: 1rem;
  height: 1rem;
  pointer-events: none;
  transform: translateY(-50%);
}

.search-input {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0.2rem 0.6rem 0.2rem 2.1rem;
  font-size: 14px;
}

.search-input::-webkit-search-cancel-button {
  appearance: none;
}

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

.selected-rule-placeholder {
  font-size: 12px;
  color: #8c8c8c;
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 125%;
  background-color: #fff;
  border: 1px solid silver;
  border-radius: 3px;
  white-space: nowrap;
  z-index: 1;
  padding: 5px;
}

.tags-container {
  user-select: none;
  width: 100%;
  text-decoration: none;
  margin: 3px 3px;
  border-radius: 3px;
  padding: 0.2px 0.4rem;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 4px;
}

.tag-item {
  padding: 0px 10px;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  border-radius: 10px;
  background-color: #f5f5f5;
}

.tag-item.selected {
  background-color: #1a1a1a;
}

.tag-item > span {
  text-align: center;
  font-size: 14px;
  line-height: 1.5;
}

.tag-item.selected > span {
  color: white;
}
</style>
