<script setup lang="ts">
import type { ArticleMetadata } from "@/types/article";
import { computed } from "vue";

const { article, isShowUpdatedDate, isShowPlaceholder } = defineProps<{
  article: ArticleMetadata;
  isShowUpdatedDate: boolean;
  isShowPlaceholder: boolean;
}>();

const showedText = computed(() => {
  if (isShowPlaceholder) {
    return "●";
  }
  return isShowUpdatedDate ? article.updatedDate : article.createdDate;
});
</script>

<template>
  <div class="article-item">
    <router-link
      v-if="article.uuid"
      :to="{ path: '/article', query: { uuid: article.uuid } }"
      class="article-title">
      <div class="title-field" v-html="article.title"></div>
    </router-link>
    <span class="article-time">
      {{ showedText }}
    </span>
  </div>
</template>

<style>
.title-field > span {
  display: inline-block;
  /* 用 border 会让元素位移，换一个实现 */
  box-shadow: inset 0 0 0 1px silver;
  background: transparent;
}
.title-field:hover > span {
  text-decoration: underline;
}
</style>

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
  display: inline-block;
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
