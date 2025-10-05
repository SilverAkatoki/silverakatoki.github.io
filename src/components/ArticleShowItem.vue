<script setup lang="ts">
import type { Article } from "@/type";

defineProps<{
  article: Article;
}>();
</script>

<template>
  <div class="article-item">
    <router-link
      v-if="article.uuid"
      :to="`/article/${article.uuid}`"
      class="article-title"
    >
      {{ article.title }}
    </router-link>
    <span v-else class="article-title">{{ article.title }}</span>
    <span class="article-time">
      {{ article.date }}
    </span>
  </div>
</template>

<style scoped>
.article-item {
  display: flex;
  position: relative;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  flex-direction: row;
  align-items: center;
}

.article-item::before {
  content: "";
  display: block;
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: #1b518a;
  border-radius: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.article-title {
  flex: 1;
  font-size: large;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 10px;
}

.article-content {
  margin-left: 10px;
  margin-top: 5px;
}

.article-time {
  margin-left: auto;
  margin-right: 2px;
  display: inline-block;
  color: var(--text-gray);
  align-self: flex-end;
  justify-self: center;
}
</style>
