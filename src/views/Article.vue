<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";

import { archiveData } from "@/types";

const route = useRoute();
const router = useRouter();

const articlePath = computed(() => route.params.path as string);
const article = computed(() =>
  archiveData.find(item => item.path === articlePath.value)
);

const articleContent = ref<string>("");

onMounted(async () => {
  if (!article.value) {
    router.push("/404");
    return;
  }

  // 这里可以根据 path 加载实际的文章内容
  // 现在使用占位符内容
  articleContent.value = `
    <h2>这是文章内容的占位符</h2>
    <p>文章路径：${article.value.path}</p>
    <p>这里将显示实际的文章内容。</p>
    <p>可以是 Markdown 渲染后的 HTML，或者其他格式的内容。</p>

    <h3>示例章节</h3>
    <p>这是一个示例段落，展示了文章页面的样式。</p>

    <pre><code>// 代码示例
function example() {
  console.log("Hello, World!");
}</code></pre>

    <blockquote>
      这是一个引用块的示例。
    </blockquote>
  `;
});
</script>

<template>
  <div v-if="article" class="article-container">
    <div class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span class="article-date">{{ article.dateStr }}</span>
        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="article-tag">
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <div class="body-container">
      <div class="article-content-container">
        <div class="article-content" v-html="articleContent" />

        <div class="article-footer">
          <div class="navigation-links">
            <router-link to="/archives" class="back-link">
              ← 返回归档
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="error-container">
    <div class="body-container">
      <h1>文章未找到</h1>
      <p>抱歉，找不到您要查看的文章。</p>
      <router-link to="/archives">返回归档</router-link>
    </div>
  </div>
</template>

<style scoped>
:root {
  --body-container-margin: 35vh;
}

a:link {
  color: #1944ad;
  text-decoration: none;
}

a:visited {
  color: #170080;
}

a:hover {
  text-decoration: underline;
}

.article-container {
  min-height: 100vh;
}

.article-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2em 0;
  background-color: #f8f8f8;
  border-bottom: 2px solid #c0c0c0;
}

.article-title {
  font-family: 思源宋体;
  font-size: 36px;
  font-weight: bolder;
  margin: 0 2em;
  text-align: center;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1em;
  gap: 0.5em;
}

.article-date {
  color: #898989;
  font-size: 14px;
}

.article-tags {
  display: flex;
  gap: 0.5em;
  flex-wrap: wrap;
  justify-content: center;
}

.article-tag {
  background-color: #e8e8e8;
  padding: 0.2em 0.6em;
  border-radius: 3px;
  font-size: 12px;
  color: #555;
  border: 1px solid #c0c0c0;
}

.body-container {
  margin-left: var(--body-container-margin);
  margin-right: var(--body-container-margin);
  min-height: 100%;
}

.article-content-container {
  background-color: #f8f8f8;
  border: 2px solid #c0c0c0;
  border-radius: 5px;
  margin: 2em 0;
}

.article-content {
  padding: 2em;
  line-height: 1.8;
  font-size: 16px;
}

.article-content :deep(h2) {
  font-size: 24px;
  font-weight: bold;
  margin: 1.5em 0 0.8em 0;
  color: #333;
  border-bottom: 2px solid #c0c0c0;
  padding-bottom: 0.3em;
}

.article-content :deep(h3) {
  font-size: 20px;
  font-weight: bold;
  margin: 1.2em 0 0.6em 0;
  color: #444;
}

.article-content :deep(p) {
  margin: 1em 0;
  text-align: justify;
}

.article-content :deep(pre) {
  background-color: #f0f0f0;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
  padding: 1em;
  margin: 1em 0;
  overflow-x: auto;
  font-family: "Courier New", monospace;
  font-size: 14px;
}

.article-content :deep(code) {
  background-color: #f0f0f0;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: "Courier New", monospace;
  font-size: 14px;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #1944ad;
  padding-left: 1em;
  margin: 1em 0;
  color: #666;
  font-style: italic;
  background-color: #f9f9f9;
  padding: 1em;
  border-radius: 0 3px 3px 0;
}

.article-footer {
  border-top: 2px solid #c0c0c0;
  padding: 1.5em 2em;
}

.navigation-links {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-link {
  font-weight: bold;
  padding: 0.5em 1em;
  background-color: #fff;
  border: 1px solid #c0c0c0;
  border-radius: 3px;
  transition: background-color 0.3s;
}

.back-link:hover {
  background-color: #f0f0f0;
  text-decoration: none;
}

.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-container .body-container {
  text-align: center;
}

.error-container h1 {
  font-size: 36px;
  margin-bottom: 1em;
  color: #666;
}

.error-container p {
  font-size: 18px;
  margin-bottom: 2em;
  color: #888;
}

@media (max-width: 768px) {
  :root {
    --body-container-margin: 10vw;
  }

  .article-title {
    font-size: 28px;
    margin: 0 1em;
  }

  .article-content {
    padding: 1.5em;
    font-size: 15px;
  }

  .article-footer {
    padding: 1em 1.5em;
  }
}
</style>
