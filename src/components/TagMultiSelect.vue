<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";

import searchIconUrl from "@/assets/icons/search.svg";
import { useToggleDropdownMenu } from "@/composables/useToggleDropdownMenu";
const { containerRef, isOpen, toggleDropdown } = useToggleDropdownMenu();

const tags = ref(["aa", "bbabbb", "ccc", "ddddddd", "eeee", "fffff", "g"]);

const selectedTagIndices = ref<number[]>([]);
const showedSelectedTagIndices = ref<number[]>([]);

const tagSearchText = ref("");
const showedTags = computed(() => {
  if (!tagSearchText.value) {
    return tags.value;
  }
  return tags.value.filter(tag =>
    tag.toLowerCase().includes(tagSearchText.value.toLowerCase())
  );
});

const selectedTagsContainerRef = ref<HTMLElement | null>(null);
const measurementSelectedTagItem = ref<HTMLElement | null>(null);

const handleSelect = (idx: number) => {
  const index = selectedTagIndices.value.indexOf(idx);
  if (index === -1) {
    selectedTagIndices.value.push(idx);
  } else {
    selectedTagIndices.value.splice(index, 1);
  }
};

const resizeObserver = ref<ResizeObserver | null>(null);

onMounted(() => {
  if (selectedTagsContainerRef.value) {
    resizeObserver.value = new ResizeObserver(updateShowedOpinions);
    resizeObserver.value.observe(selectedTagsContainerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

const updateShowedOpinions = async () => {
  await nextTick();

  const container = selectedTagsContainerRef.value;
  if (!container) return;

  const item = measurementSelectedTagItem.value;
  if (!item) return;

  const containerWidth = container.clientWidth;
  if (containerWidth === 0) return;
  // 当下来菜单隐藏时，容器宽度为 0，跳过更新以保持上次有效布局。

  const newShowedIndices = [];
  let currentWidth = 0;

  for (const index of selectedTagIndices.value) {
    item.textContent = tags.value[index];
    const itemWidth = item.offsetWidth;

    if (currentWidth + itemWidth <= containerWidth) {
      newShowedIndices.push(index);
      currentWidth += itemWidth;
    } else {
      break;
    }
  }

  showedSelectedTagIndices.value = newShowedIndices;
};

watch(selectedTagIndices, updateShowedOpinions, { deep: true });

const getItemDisplay = (item: number, index: number) => {
  if (
    showedSelectedTagIndices.value.length < selectedTagIndices.value.length &&
    index === showedSelectedTagIndices.value.length - 1
  ) {
    return `+ ${selectedTagIndices.value.length - showedSelectedTagIndices.value.length + 1}`;
  }
  return tags.value[item];
};
</script>

<template>
  <div ref="containerRef" class="rule-selector">
    <button type="button" class="rule-selector-button" @click="toggleDropdown">
      <div ref="selectedTagsContainerRef" class="selected-rules-container">
        <span
          v-for="(item, index) in showedSelectedTagIndices"
          :key="index"
          class="selected-rule-item">
          {{ getItemDisplay(item, index) }}
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
          v-for="(tag, index) in showedTags"
          :key="index"
          class="tag-item"
          :class="{ selected: selectedTagIndices.includes(index) }"
          @click="handleSelect(index)">
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
  padding: 4px;
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
