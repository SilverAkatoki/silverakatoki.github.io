<script setup lang="ts">
import { ref, watch } from "vue";

import { debounce } from "ts-debounce";
import SortRulesSelector from "@/components/SortRulesSelector.vue";
import FilterRulesSelector from "@/components/FilterRulesSelector.vue";
import searchIconUrl from "@/assets/icons/search.svg";

import { DEFAULT_SORT_STATE } from "@/types/sortRuleSelector";
import type { SortState } from "@/types/sortRuleSelector";

const title = ref("");
const sortState = ref<SortState>({ ...DEFAULT_SORT_STATE });

const emit = defineEmits<{
  submit: [title: string, sortState: SortState];
}>();

watch(
  [title, sortState],
  ([newTitle, newSortState]) => {
    debounce((currentTitle: string, currentSortState: SortState) => {
      emit("submit", currentTitle, currentSortState);
    }, 50)(newTitle, newSortState);
  },
  { immediate: true }
);
</script>

<template>
  <div class="articles-filter">
    <div class="tags-selector-container"></div>
    <div class="filter-container">
      <div class="search-container">
        <div class="search-field">
          <img
            class="search-icon"
            :src="searchIconUrl"
            alt=""
            aria-hidden="true"
          />
          <input
            v-model="title"
            class="search-input"
            type="search"
            placeholder="搜索文章标题"
          />
        </div>
      </div>
      <div class="rules-selector-container">
        <sort-rules-selector @sort-state="state => (sortState = state)" />
      </div>
      <div class="rules-selector-container">
        <filter-rules-selector />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.filter-container {
  flex: 1 1 320px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  --search-field-height: 1.75rem;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  width: 320px;
}

.search-label {
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.search-field {
  position: relative;
  display: flex;
  align-items: center;
  height: var(--search-field-height);
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 0.6rem;
  top: 50%;
  width: 1.1rem;
  height: 1.1rem;
  pointer-events: none;
  transform: translateY(-50%);
}

.search-input {
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0.3rem 0.6rem 0.3rem 2.1rem;
  font-size: 14px;
}

.search-input::-webkit-search-cancel-button {
  appearance: none;
}

.rules-selector-container {
  display: flex;
  align-items: stretch;
  height: var(--search-field-height);
}

.rules-selector-container.disabled {
  pointer-events: none;
  color: #7a7a7a;
}
</style>
