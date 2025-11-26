<script setup lang="ts">
import { ref } from "vue";

import { tags } from "@/data/tags.json";
const isExpanded = ref(false);
</script>

<template>
  <div class="artocle-tags-selector">
    <div class="header">
      <span class="title">总共有 {{ tags.length }} 个标签</span>
      <button class="toggle-btn" @click="isExpanded = !isExpanded">
        {{ isExpanded ? "关闭" : "展开" }}
        <span :class="['arrow', isExpanded ? 'up' : 'down']"></span>
      </button>
    </div>

    <div class="tags-container" :class="{ expanded: isExpanded }">
      <div v-for="tag in tags" :key="tag[0]" class="tag-item">
        <a href="#" class="tag-link">
          <span class="bullet"></span>
          {{ tag[0] }}
        </a>
        <span class="tag-count">({{ tag[1] }})</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.artocle-tags-selector {
  font-family: Arial, sans-serif;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  background-color: #f9f9f9;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  font-size: 16px;
  color: #333;
}

.toggle-btn {
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
}

.toggle-btn:hover {
  background-color: #e6f2ff;
}

.arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  margin-left: 4px;
}

.arrow.down {
  border-top: 4px solid #0066cc;
}

.arrow.up {
  border-bottom: 4px solid #0066cc;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  line-height: 28px;
  max-height: 28px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.tags-container.expanded {
  max-height: none;
}

.tag-item {
  display: flex;
}

.tag-count {
  margin-left: 2px;
  color: green;
  font-size: 14px;
  justify-content: center;
}

.tag-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #0066cc;
  font-size: 14px;
  white-space: nowrap;
}

.tag-link:hover {
  text-decoration: underline;
}

.bullet {
  width: 6px;
  height: 6px;
  background-color: #0066cc;
  border-radius: 50%;
  margin-right: 4px;
  flex-shrink: 0;
}
</style>
