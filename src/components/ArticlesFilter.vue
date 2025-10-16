<script setup lang="ts">
import { ref, watch } from "vue";

import { debounce } from "ts-debounce";

const title = ref("");

const emit = defineEmits<{
  submit: [title: string];
}>();

watch(title, newValue => {
  debounce(newValue => {
    emit("submit", newValue);
  }, 50)(newValue);
});
</script>

<template>
  <div class="articles-filter">
    <div class="tags-selector-container"></div>
    <div class="filter-container">
      <div class="search-container">
        <div class="search-field">
          <input
            v-model="title"
            class="search-input"
            type="search"
            placeholder="搜索文章标题"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.filter-container {
  flex: 1 1 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem;
}

.search-label {
  font-size: 0.8rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.search-field {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.search-input {
  flex: 1 1 auto;
  padding: 0.45rem 0.65rem;
  font-size: 0.95rem;
}

.search-input::-webkit-search-cancel-button {
  appearance: none;
}

.search-button {
  padding: 0.45rem 0.9rem;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
}

.search-button:active {
  transform: translateY(1px);
}
</style>
