<script setup lang="ts">
import { ref, onMounted } from "vue";

import siteSettings from "@/data/site-settings.json";
import { calcDaysDiff, getRandomItem } from "@/utils/utils";

import Readme from "@/components/Readme.vue";
import ArticleListItem from "@/components/ArticleListItem.vue";

import type { FriendLink, SiteInfo } from "@/types/home";

import { articles } from "@/data/articles-index.json";

// 防止删干净后的处理
const siteInfo: SiteInfo = {
  titleSentences: siteSettings.siteInfo?.titleSentences ?? [],
  friendLink: Array.isArray(siteSettings.siteInfo?.friendLink)
    ? (siteSettings.siteInfo.friendLink as FriendLink[])
    : []
};

const randomSentence = ref<string>("");

const lastUpdateDate = articles[0].date; // 约定俗称列表里最前面的是最近写的内容
const latestArticles = articles.slice(0, 5);

const laatUpdateDateDiff = calcDaysDiff(lastUpdateDate);

onMounted(() => {
  randomSentence.value = getRandomItem(siteInfo.titleSentences);
});
</script>

<template>
  <div class="title-container">
    <p class="main-title">狼迹拾遗</p>
    <p class="sub-title">银晓的博客</p>
    <p class="sentence">{{ randomSentence }}</p>
    <div class="time-info-container">
      <span class="time-label">上次更新</span>
      <span class="last-update-date">{{ lastUpdateDate }}</span>
      <span class="separator">|</span>
      <span class="time-label">距今</span>
      <span class="last-update-date-distance">{{ laatUpdateDateDiff }}</span>
      <span>天</span>
    </div>
  </div>
  <div class="body-container">
    <div class="readme-container">
      <p class="readme-title">README</p>
      <div class="readme-text">
        <readme />
      </div>
      <div v-if="siteInfo.friendLink.length !== 0" class="readme-divider" />
      <p v-if="siteInfo.friendLink.length !== 0" class="friend-link-title">
        友链
      </p>
      <ul
        v-for="link in siteInfo.friendLink"
        :key="link.url"
        class="friend-links"
      >
        <li class="friend-link-item">
          <a :href="link.url" title="前往他的博客">{{ link.name }}</a>
        </li>
      </ul>
    </div>
    <div class="articles">
      <p class="articles-title">最新更新</p>
      <div style="border-bottom: 2px solid #aaaaaa; margin-bottom: 1em" />
      <div class="articles-container">
        <article-list-item
          v-for="article in latestArticles"
          :key="article.uuid"
          :article="article"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.articles-title {
  margin: 5px;
  margin-top: 25px;
  margin-bottom: 5px;
  font-size: 25px;
  letter-spacing: 1px;
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
  font-family: "Source Han Serif CN VF";
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
  margin: 10px;
  margin-bottom: 10px;
  font-size: x-large;
  font-weight: bold;
  letter-spacing: -2px;
}

.readme-text {
  margin: 10px;
}

.readme-divider {
  border-bottom: 2px solid var(--border-gray);
}

.friend-links {
  margin: 10px;
  list-style: none;
}

.friend-link-item {
  display: inline;
  margin-right: 2px;
}
</style>
