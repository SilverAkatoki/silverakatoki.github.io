<script setup lang="ts">
import { onBeforeUnmount, ref, watch, onMounted, onUnmounted } from "vue";

import { useRoute } from "vue-router";

import ArticleToc from "@/components/common/ArticleToc.vue";
import { useArticleContent } from "@/composables/useArticleContent";
import { articles as articleEntries } from "@/data/articles-index.json";

import type { ArticleMetadata } from "@/types/article";

const articleIndex = new Map<string, ArticleMetadata>(
  (articleEntries as ArticleMetadata[]).map(entry => [entry.uuid, entry])
);

const route = useRoute();
const loadError = ref<string | null>(null);

const {
  meta,
  sanitizedHtml,
  tocTree,
  articleContentRef,
  setArticleContent,
  clearArticleContent
} = useArticleContent();

// 抓出脚注的跳转地址
const extractFootnoteTargetId = (anchor: HTMLAnchorElement): string | null => {
  const rawHash = anchor.hash || anchor.getAttribute("href") || "";
  if (!rawHash.startsWith("#") || rawHash.length <= 1) {
    return null;
  }

  try {
    return decodeURIComponent(rawHash.slice(1));
  } catch {
    return rawHash.slice(1);
  }
};

// 避免默认的跳转，会炸路由
// 井号被路由和跳转共用了
const handleFootnoteClick = (event: MouseEvent): void => {
  const eventTarget = event.target;
  if (!(eventTarget instanceof Element)) {
    return;
  }

  // 直接抓 DOM
  const anchor = eventTarget.closest<HTMLAnchorElement>(
    "a[data-footnote-ref], a[data-footnote-backref]" // 抓样式，要不然抓不到
  );
  if (!anchor) {
    return;
  }

  const targetId = extractFootnoteTargetId(anchor);
  if (!targetId || typeof window === "undefined") {
    return;
  }

  const destination = window.document.getElementById(targetId);
  if (!destination) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  destination.scrollIntoView({ behavior: "instant", block: "center" });
};

watch(
  articleContentRef,
  (element, previousElement) => {
    previousElement?.removeEventListener("click", handleFootnoteClick);
    element?.addEventListener("click", handleFootnoteClick);
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  articleContentRef.value?.removeEventListener("click", handleFootnoteClick);
});

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

const scrollPercent = ref<number>(0);

const updatedScrollPercent = () => {
  scrollPercent.value = Math.floor(
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
      100
  );
};

onMounted(() => document.addEventListener("scroll", updatedScrollPercent));
onUnmounted(() => document.removeEventListener("scroll", updatedScrollPercent));
</script>

<template>
  <main class="article">
    <p v-if="loadError" class="article-error">{{ loadError }}</p>
    <template v-else>
      <article class="markdown-body">
        <section class="article-body-content">
          <aside v-if="meta" class="article-meta-pane">
            <dl class="article-meta-list">
              <div class="article-meta-item">
                <dt class="article-meta-term">创建日期</dt>
                <dd class="article-meta-detail article-meta-date">
                  {{ meta.createdDate }}
                </dd>
              </div>
              <div class="article-meta-item">
                <dt class="article-meta-term">最近更新日期</dt>
                <dd class="article-meta-detail article-meta-date">
                  {{ meta.updatedDate }}
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
                    class="article-meta-empty">
                    暂无标签
                  </span>
                </dd>
              </div>
              <div
                v-if="meta.categories.length !== 0"
                class="article-meta-item">
                <dt class="article-meta-term">类别</dt>
                <dd class="article-meta-detail">
                  <span
                    v-for="category in meta.categories"
                    :key="category"
                    class="article-tag">
                    {{ category }}
                  </span>
                </dd>
              </div>
            </dl>
          </aside>

          <section
            ref="articleContentRef"
            class="article-content"
            v-html="sanitizedHtml"></section>
        </section>
        <aside class="article-right-sidebar">
          <!-- 不加对 tocTree 的判断会在目录没渲染完前弹个对 undefined 的访问出来 -->
          <div v-if="tocTree && tocTree[0]" class="article-toc-pane">
            <span
              style="
                display: flex;
                justify-content: space-between;
                align-items: start;
              ">
              <h2 class="toc-title">文章目录</h2>
              <span class="scroll-percent">{{ scrollPercent }}%</span>
            </span>
            <div>
              <ArticleToc :toc="tocTree" />
            </div>
          </div>
        </aside>
      </article>
    </template>
  </main>
</template>

<style src="./index.css"></style>
