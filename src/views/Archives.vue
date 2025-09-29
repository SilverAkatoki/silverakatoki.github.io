<script setup lang="ts">
import { tags, archives } from "@/info.json";

interface Archive {
  uuid: string;
  title: string;
  dateStr: string;
}

const aaa: readonly Archive[] = [
  {
    uuid: "7d8f2d7e-001d-420c-a09a-4a0116423bc2",
    title: "测试文档 2",
    dateStr: "2025-09-30"
  },
  {
    uuid: "2cb96b50-fc55-4515-b1f4-d2603f02d86e",
    title: "测试文档 1",
    dateStr: "2025-09-29"
  }
];
</script>

<template>
  <div id="title_container">
    <p id="main_title">归档</p>
    <div id="archive-count-container">
      <span>银晓已经写了</span>
      <span id="archive-count">{{ Object.keys(archives).length }}</span>
      <span>篇文章</span>
    </div>
  </div>
  <div id="body_container">
    <div id="tags-container">
      <p id="tags-title">标签</p>
      <ul id="tags">
        <li v-if="tags.length === 0" id="tag-empty">空标签提示文本</li>
        <li v-for="tag in tags" :key="tag">
          <router-link :to="`/tags/${tag}`">{{ tag }}</router-link>
        </li>
      </ul>
    </div>
    <div id="archives">
      <p id="archives-title">文章目录</p>
      <div style="border-bottom: 2px solid #aaaaaa; margin-bottom: 1em" />
      <div id="archives-container">
        <div v-for="archive in aaa" :key="archive.title" class="archive-item">
          <router-link
            v-if="archive.uuid"
            :to="`/article/${archive.uuid}`"
            class="archive-title"
          >
            {{ archive.title }}
          </router-link>
          <span v-else class="archive-title">{{ archive.title }}</span>
          <span v-if="archive.dateStr" class="archive-time">
            {{ archive.dateStr }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全局样式已移至 style.css */

#body_container {
  margin-left: var(--body-container-margin);
  margin-right: var(--body-container-margin);
  min-height: 100%;
}

#title_container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#main_title {
  font-family: var(--font-family-serif);
  font-size: 42px;
  font-weight: bolder;
  margin: 20px;
  margin-bottom: 0;
}

#archive-count-container {
  display: flex;
}

#archive-count-container > span {
  margin: 2px;
}

#archive-count {
  font-weight: bold;
}

#tags-container {
  margin-top: 1em;
  margin-bottom: 1em;
  background-color: var(--background-gray);
  border: 2px solid var(--border-gray);
  border-radius: 5px;
}

#tags-title {
  margin: 5px;
  margin-bottom: 10px;
  font-size: x-large;
  font-weight: bold;
  letter-spacing: -2px;
}

#tags {
  margin: 5px;
  list-style: none;
}

#tags > li {
  display: inline;
  margin-right: 0.5em;
}

#tag-empty {
  font-style: italic;
  color: var(--text-gray);
}

#archives-title {
  margin: 5px;
  margin-top: 25px;
  margin-bottom: 5px;
  font-size: 30px;
  letter-spacing: 1px;
}

.archive-item {
  display: flex;
  position: relative;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  flex-direction: row;
  align-items: center;
}

.archive-item::before {
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

.archive-title {
  flex: 1;
  font-size: large;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 10px;
}

.archive-content {
  margin-left: 10px;
  margin-top: 5px;
}

.archive-time {
  margin-left: auto;
  margin-right: 2px;
  display: inline-block;
  color: var(--text-gray);
  align-self: flex-end;
  justify-self: center;
}
</style>
