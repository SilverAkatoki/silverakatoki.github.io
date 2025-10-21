<script setup lang="ts">
import { computed, ref } from "vue";

import ArticleListItem from "@/components/ArticleListItem.vue";
import ArticlesFilter from "@/components/ArticlesFilter.vue";
import { articles } from "@/data/articles-index.json";

import type { ArticleMetadata } from "@/types/article";

const titlePattern = ref<string>("");

const HIGHLIGHT_TAG_PATTERN = /<span>(.*?)<\/span>/gi; // 全局且不区分大小写匹配
const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// 转义正则特殊字符
// 输个 \w 进去就爆了

const filtratedArticles = computed<ArticleMetadata[]>(() => {
  const keyword = titlePattern.value.trim();

  const normalizedArticles = articles
    .map<ArticleMetadata>(metadata => ({
      ...metadata,
      title: metadata.title.replace(HIGHLIGHT_TAG_PATTERN, "$1") // 清理以前的高亮
    }))
    .filter(metadata => metadata.title.includes(keyword));

  if (keyword === "") {
    return normalizedArticles;
  }

  const highlightRegex = new RegExp(escapeRegExp(keyword), "gi");

  return normalizedArticles.map(metadata => ({
    ...metadata,
    title: metadata.title.replace(
      highlightRegex,
      match => `<span>${match}</span>`
    )
  }));
});

const sortedArticles = computed<ArticleMetadata[]>(() =>
  // 先这样排着
  filtratedArticles.value.sort((x, y) =>
    y.updatedDate.localeCompare(x.updatedDate)
  )
);
</script>

<template>
  <div class="title_container">
    <p class="main_title">归档</p>
  </div>
  <div class="body_container">
    <div class="filter-container">
      <articles-filter @submit="value => (titlePattern = value)" />
      <div class="article-count-container">
        <span>已经写了</span>
        <span class="article-count">{{ articles.length }}</span>
        <span>篇文章</span>
      </div>
    </div>
    <div class="articles">
      <div
        style="
          border-bottom: 2px solid #aaa;
          margin-top: 25px;
          margin-bottom: 1em;
        "
      ></div>
      <div class="articles-container">
        <article-list-item
          v-for="article in sortedArticles"
          :key="article.uuid"
          :article="article"
        />
        <p v-if="sortedArticles.length === 0" class="empty-state">
          没有找到匹配的文章
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.body_container {
  margin-top: 2em;
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

  margin-bottom: 5px;
  font-size: 30px;
  letter-spacing: 1px;
}

.empty-state {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
}
</style>
