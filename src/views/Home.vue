<script setup lang="ts">
import { ref, onMounted } from "vue";

import { siteInfo } from "@/info.json";
import { getRandomSentence } from "@/utils/dateUtils";

const randomSentence = ref<string>("");

onMounted(() => {
  randomSentence.value = getRandomSentence(siteInfo.titleSentences);
});
</script>

<template>
  <div class="title-container">
    <p class="main-title">阅狼集录</p>
    <p class="sub-title">银晓的博客</p>
    <p class="sentence">{{ randomSentence }}</p>
    <div class="time-info-container">
      <span class="time-label">上次更新</span>
      <span class="last-update-date">114-514</span>
      <span class="separator">|</span>
      <span class="time-label">距今</span>
      <span class="last-update-date-distance">1919</span>
      <span>天</span>
    </div>
  </div>
  <div class="body-container">
    <div class="readme-container">
      <p class="readme-title">README</p>
      <div class="readme-text">
        {{ siteInfo.readme }}
      </div>
      <div class="readme-divider" />
      <p class="friend-link-title">友链</p>
      <ul v-for="link in siteInfo.friendLink" :key="link.url" class="friend-links">
        <li class="friend-link-item">
          <a :href="link.url" title="前往他的博客">{{ link.name }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
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
  font-family: var(--font-family-serif);
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
  color: var(--text-gray);
}

.time-info-container {
  display: flex;
}

.time-info-container > span {
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
  background-color: var(--background-gray);
  border: 2px solid var(--border-gray);
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
  border-bottom: 2px solid var(--border-gray);
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
