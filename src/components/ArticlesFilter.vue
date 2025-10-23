<script setup lang="ts">
import { ref, watch } from "vue";

import { debounce } from "ts-debounce";
import SortRulesSelector from "@/components/SortRulesSelector.vue";
import FilterRultsSelector from "@/components/FilterRultsSelector.vue";

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
          <svg
            class="search-icon"
            aria-hidden="true"
            focusable="false"
            data-prefix="far"
            data-icon="magnifying-glass"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              d="M368 208A160 160 0 1 0 48 208a160 160 0 1 0 320 0zM337.1 371.1C301.7 399.2 256.8 416 208 416C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208c0 48.8-16.8 93.7-44.9 129.1L505 471c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L337.1 371.1z"
            ></path>
          </svg>
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
      <div class="rules-selector-container disabled">
        <filter-rults-selector />
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
  fill: #7a7a7a;
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
