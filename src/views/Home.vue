<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

import { lastUpdateDateStr, titleSentences, archiveData } from "@/types";
import { calculateDaysSince, getRandomSentence } from "@/utils/dateUtils";

const randomSentence = ref("");
const daysSinceUpdate = computed(() => calculateDaysSince(lastUpdateDateStr));

onMounted(() => {
  randomSentence.value = getRandomSentence(titleSentences);
});
</script>

<template>
  <div class="title-container">
    <p class="main-title">阅狼集录</p>
    <p class="sub-title">银晓的博客</p>
    <p class="sentence">{{ randomSentence }}</p>
    <div class="time-info-container">
      <p class="time-label">上次更新</p>
      <p class="last-update-date">{{ lastUpdateDateStr }}</p>
      <p class="separator">|</p>
      <p class="time-label">距今</p>
      <p class="last-update-date-distance">{{ daysSinceUpdate }}</p>
      <p>天</p>
    </div>
  </div>
  <div class="body-container">
    <div class="readme-container">
      <p class="readme-title">README</p>
      <div class="readme-text">
        这里写自述的话<br />
        换行<br />
        占位符<br />
        占位符<br />
        占位符<br />
        占位符<br />
        占位符<br />
        记得写项目展示，内嵌超链接
      </div>
      <div class="readme-divider" />
      <p class="friend-link-title">友链</p>
      <ul class="friend-links">
        <li class="friend-link-item">
          <a href="https://blog.wscraft.fun/" title="前往他的博客">Darksky</a>
        </li>
        <li class="friend-link-item">
          <a href="https://2hard4me.site/" title="前往他的博客">2hard4me</a>
        </li>
      </ul>
    </div>
    <ArticleList :articles="archiveData" title="最新文章" :max-items="5" />
  </div>
</template>

<style scoped>
:root {
  --body-container-margin: 35vh;
}

* {
  padding: 0;
  margin: 0;
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

.body-container {
  margin-left: var(--body-container-margin);
  margin-right: var(--body-container-margin);
  min-height: 100%;
}

.title-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.main-title {
  font-family: 思源宋体;
  font-size: 42px;
  font-weight: bolder;
  margin: 20px;
  margin-bottom: 0;
}

.sub-title {
  font-size: large;
  margin-top: 0;
}

.sentence {
  margin-top: 8px;
  font-style: italic;
  color: #898989;
}

.time-info-container {
  display: flex;
}

.time-info-container > p {
  margin: 2px;
}

.time-label {
  letter-spacing: 1px;
}

.separator {
  margin-left: 0.5em;
  margin-right: 0.5em;
}

.last-update-date,
.last-update-date-distance {
  font-weight: bold;
}

.readme-container {
  margin-top: 1em;
  margin-bottom: 1em;
  background-color: #f8f8f8;
  border: 2px solid #c0c0c0;
  border-radius: 5px;
}

.readme-title,
.friend-link-title {
  margin: 5px;
  margin-bottom: 10px;
  font-size: x-large;
  font-weight: bold;
  letter-spacing: -2px;
}

.readme-text {
  margin: 5px;
}

.readme-divider {
  border-bottom: 2px solid #c0c0c0;
}

.friend-links {
  margin: 5px;
  list-style: none;
}

.friend-link-item {
  display: inline;
  margin-right: 2px;
}
</style>
