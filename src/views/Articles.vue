<script setup lang="ts">
import { computed, ref } from "vue";

import ArticleSearchPanel from "@/components/ArticleSearchPanel.vue";
import ArticleSummaryItem from "@/components/ArticleSummaryItem.vue";
import TagExplorerPanel from "@/components/TagExplorerPanel.vue";
import { articles } from "@/data/articles-index.json";
import {
  DEFAULT_SORT_STATE,
  SortKeys,
  type SortState
} from "@/types/sortRuleSelector";

import type { ArticleMetadata } from "@/types/article";


const titlePattern = ref<string>("");
const sortState = ref<SortState>({ ...DEFAULT_SORT_STATE });
// 默认值要深拷贝一个出来

const isShowUpdatedDate = computed<boolean>(() => {
  const { sortProperty } = sortState.value;
  return (
    sortProperty === SortKeys.DEFAULT || sortProperty === SortKeys.UPDATED_DATE
  );
});


const HIGHLIGHT_TAG_PATTERN = /<span>(.*?)<\/span>/gi; // 这是负责清理高亮的正则

// 转义正则特殊字符
// 要不然输个 \w 进去就报错
const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

  const highlightRegex = new RegExp(escapeRegExp(keyword), "gi"); // 这是标记高亮元素的正则

  return normalizedArticles.map(metadata => ({
    ...metadata,
    title: metadata.title.replace(
      highlightRegex,
      match => `<span>${match}</span>`
    )
  }));
});

const sortedArticles = computed<ArticleMetadata[]>(() => {
  const items = [...filtratedArticles.value];
  const { sortDirection, sortProperty } = sortState.value;

  // 默认按照由新到旧的更新日期排
  if (sortProperty === SortKeys.DEFAULT) {
    return items.sort((a, b) => b.updatedDate.localeCompare(a.updatedDate));
  }

  const direction = sortDirection === "ASC" ? 1 : -1;
  if (SortKeys.CREATED_DATE === sortProperty) {
    return items.sort(
      (a, b) => direction * a.createdDate.localeCompare(b.createdDate)
    );
  } else if (SortKeys.UPDATED_DATE === sortProperty) {
    return items.sort(
      (a, b) => direction * a.updatedDate.localeCompare(b.updatedDate)
    );
  } else {
    throw Error("Invalid sort property");
  }
});

const handleFilterSubmit = (
  newTitlePattern: string,
  newSortState: SortState
) => {
  sortState.value = { ...newSortState }; // 一定记得开新对象
  titlePattern.value = newTitlePattern;
};
</script>

<template>
  <div class="title_container">
    <p class="main_title">归档</p>
  </div>
  <div class="body_container">
    <tag-explorer-panel style="margin-bottom: 1.5em;" />
    <div class="filter-container">
      <article-search-panel @submit="handleFilterSubmit" />
      <div class="article-count-container">
        <span v-if="titlePattern === ''">已经写了</span>
        <span v-else>已筛选出</span>
        <span class="article-count">{{ sortedArticles.length }}</span>
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
        <article-summary-item
          v-for="article in sortedArticles"
          :key="article.uuid"
          :article="article"
          :is-show-updated-date="isShowUpdatedDate"
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
  margin-top: 0.25em;
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
