<template>
  <div id="title_container">
    <p id="main_title">小玩具</p>
    <p id="utils-info">存放一些能部署到 Github Pages 里面的静态前端 Demo</p>
  </div>
  <div id="body_container">
    <div>
      <div style="border-bottom:2px solid #AAAAAA; margin-bottom: 1em;" />
      <div id="utils">
        <div
          v-for="project in projectData"
          :key="project.name"
          class="utils-container"
        >
          <router-link
            v-if="project.path"
            :to="`/utils/${project.path}`"
            class="utils-hyperlink"
          >
            {{ project.name }}
          </router-link>
          <span v-else class="utils-hyperlink">{{ project.name }}</span>
          <p class="utils-info">{{ project.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { projectData } from "@/types";
</script>

<style scoped>
:root {
    --body-container-margin: 35vh;
}

* {
    padding: 0;
    margin: 0;
}

a:link {
    color: #1944AD;
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

p#utils-info {
    margin: 2px;
    margin-top: 5px;
    margin-bottom: 1em;
}

.utils-container {
    display: flex;
    position: relative;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 0.75em;
    margin-bottom: 0.75em;
}

.utils-hyperlink {
    flex: 1;
    font-size: large;
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 10px;
}

.utils-info {
    margin-left: 10px;
    color: #666;
}
</style>
