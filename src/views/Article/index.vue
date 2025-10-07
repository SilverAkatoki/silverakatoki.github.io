<script setup lang="ts">
import { ref, watch } from "vue";

import { useRoute } from "vue-router";

import { useArticleContent } from "@/composables/useArticleContent";
import { articles as articleEntries } from "@/data/articles-index.json";

import type { ArticleMetadata } from "@/types/article";

const articleIndex = new Map<string, ArticleMetadata>(
  (articleEntries as ArticleMetadata[]).map(entry => [entry.uuid, entry])
);

const route = useRoute();
const loadError = ref<string | null>(null);

const { meta, sanitizedHtml, setArticleContent, clearArticleContent } =
  useArticleContent();

const resolvePostUrl = (uuid: string): string => {
  const base = import.meta.env.BASE_URL ?? "/";
  const baseUrl = new URL(base, `${window.location.origin}/`);
  return new URL(`posts/${uuid}.md`, baseUrl).toString();
};

const fetchArticle = async (uuid: string): Promise<void> => {
  loadError.value = null;

  const articleMetadata = articleIndex.get(uuid);

  if (!articleMetadata) {
    loadError.value = "未找到对应文章";
    clearArticleContent();
    return;
  }

  try {
    const postUrl = resolvePostUrl(uuid);

    const response = await fetch(postUrl);
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }

    const content = await response.text();

    setArticleContent({ metadata: articleMetadata, content });
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : "获取文章失败";
    clearArticleContent();
  }
};

watch(
  () => route.query.uuid as string,
  async newUuid => {
    if (!newUuid) {
      loadError.value = "未找到文章";
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
      <article class="markdown-body">
        <aside v-if="meta" class="article-meta-pane">
          <dl class="article-meta-list">
            <div class="article-meta-item">
              <dt class="article-meta-term">日期</dt>
              <dd class="article-meta-detail article-meta-date">
                {{ meta.date }}
              </dd>
            </div>
            <div class="article-meta-item">
              <dt class="article-meta-term">标签</dt>
              <dd class="article-meta-detail">
                <span v-for="tag in meta.tags" :key="tag" class="article-tag">
                  {{ tag }}
                </span>
                <span
                  v-if="meta.tags.length === 0"
                  class="article-meta-empty"
                >暂无标签</span>
              </dd>
            </div>
          </dl>
        </aside>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <section class="article-content" v-html="sanitizedHtml" />
      </article>
    </template>
  </main>
</template>

<style src="./index.css"></style>
