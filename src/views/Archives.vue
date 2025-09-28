<script setup lang="ts">
import { archiveTags, archiveData, archiveCount, tagEmptyTip } from "@/types";
</script>

<template>
  <div id="title_container">
    <p id="main_title">归档</p>
    <div id="archive-count-container">
      <p>银晓已经写了</p>
      <p id="archive-count">{{ archiveCount }}</p>
      <p>篇文章</p>
    </div>
  </div>
  <div id="body_container">
    <div id="tags-container">
      <p id="tags-title">标签</p>
      <ul id="tags">
        <li v-if="archiveTags.length === 0" id="tag-empty">
          {{ tagEmptyTip }}
        </li>
        <li v-for="tag in archiveTags" :key="tag">
          <router-link :to="`/tags/${tag}`">{{ tag }}</router-link>
        </li>
      </ul>
    </div>
    <div id="archives">
      <p id="archives-title">文章目录</p>
      <div style="border-bottom: 2px solid #aaaaaa; margin-bottom: 1em" />
      <div id="archives-container">
        <div
          v-for="archive in archiveData"
          :key="archive.title"
          class="archive-item"
        >
          <router-link
            v-if="archive.path"
            :to="`/archives/${archive.path}`"
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
  font-family: 思源宋体;
  font-size: 42px;
  font-weight: bolder;
  margin: 20px;
  margin-bottom: 0;
}

#archive-count-container {
  display: flex;
}

#archive-count-container > p {
  margin: 2px;
}

#archive-count {
  font-weight: bold;
}

#tags-container {
  margin-top: 1em;
  margin-bottom: 1em;
  background-color: #f8f8f8;
  border: 2px solid #c0c0c0;
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
  color: #898989;
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
  color: #898989;
  align-self: flex-end;
  justify-self: center;
}
</style>
