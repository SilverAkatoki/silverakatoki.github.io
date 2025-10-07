<script setup lang="ts">
import { computed } from "vue";

import ArticleListItem from "@/components/ArticleListItem.vue";
import { articles } from "@/data/articles-index.json";

import type { ArticleMetadata } from "@/types/article";

const sortedArticles = computed<ArticleMetadata[]>(() =>
  [...articles].sort((x, y) => y.date.localeCompare(x.date))
);
</script>

<template>
  <div class="title_container">
    <p class="main_title">归档</p>
    <div class="article-count-container">
      <span>已经写了</span>
      <span class="article-count">{{ sortedArticles.length }}</span>
      <span>篇文章</span>
    </div>
  </div>
  <div class="body_container">
    <div class="articles">
      <p class="articles-title">文章目录</p>
      <div style="border-bottom: 2px solid #aaaaaa; margin-bottom: 1em" />
      <div class="articles-container">
        <article-list-item
          v-for="article in sortedArticles"
          :key="article.uuid"
          :article="article"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.body_container {
  margin-left: var(--body-container-margin);
  margin-right: var(--body-container-margin);
  min-height: 100%;
}

.title_container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main_title {
  font-family: "Source Han Serif CN VF";
  font-size: 42px;
  font-weight: bolder;
  margin: 20px;
  margin-bottom: 0;
}

.article-count-container {
  display: flex;
}

.article-count-container > span {
  margin: 2px;
}

.article-count {
  font-weight: bold;
}

.articles-title {
  margin: 5px;
  margin-top: 25px;
  margin-bottom: 5px;
  font-size: 30px;
  letter-spacing: 1px;
}
</style>
