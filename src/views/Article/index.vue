<script setup lang="ts">
import { ref, watch } from "vue";

import { useRoute } from "vue-router";

import { articles as articleEntries } from "@/articles-index.json";
import { useArticleContent } from "@/composables/useArticleContent";

import type { ArticleMetadata } from "@/types/article";

const articleIndex = new Map<string, ArticleMetadata>(
  (articleEntries as ArticleMetadata[]).map(entry => [entry.uuid, entry])
);

const route = useRoute();
const loadError = ref<string | null>(null);

const { sanitizedHtml, setArticleContent, clearArticleContent } = useArticleContent();

const fetchArticle = async (uuid: string): Promise<void> => {
  loadError.value = null;

  const articleMetadata = articleIndex.get(uuid);
  if (!articleMetadata) {
    clearArticleContent();
    loadError.value = "未找到对应记录";
    return;
  }

  try {
    const baseUrl = import.meta.env.BASE_URL ?? "/";
    const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const postUrl = `${normalizedBaseUrl}posts/${uuid}.md`;

    const response = await fetch(postUrl);
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const content = await response.text();

    setArticleContent({ metadata: articleMetadata, content });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : "读取文章失败";
    clearArticleContent();
  }
};

watch(
  () => route.params.uuid as string | undefined,
  async newUuid => {
    if (!newUuid) {
      loadError.value = "未找到对应的文章";
      clearArticleContent();
      return;
    }

    await fetchArticle(newUuid);
  },
  { immediate: true }
);
</script>

<template>
  <main class="article">
    <p v-if="loadError" class="article-error">{{ loadError }}</p>
    <template v-else>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <article class="markdown-body" v-html="sanitizedHtml" />
    </template>
  </main>
</template>

<style src="./index.css"></style>
