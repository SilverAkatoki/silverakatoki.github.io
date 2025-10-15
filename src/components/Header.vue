<script setup lang="ts">
import siteSettings from "@/data/site-settings.json";
</script>

<template>
  <header>
    <div id="head_container">
      <router-link to="/">{{ siteSettings.siteInfo.header }}</router-link>
    </div>
    <div id="navigation_bar">
      <ul id="navigation_buttons">
        <li>
          <router-link
            to="/"
            class="navigation_button"
            :class="{ inactivated: $route.path === '/' }"
            :style="$route.path === '/' ? 'pointer-events:none;' : ''"
          >
            主页
          </router-link>
        </li>
        <li>
          <router-link
            to="/articles"
            class="navigation_button"
            :class="{ inactivated: $route.path === '/articles' }"
            :style="$route.path === '/articles' ? 'pointer-events:none;' : ''"
            title="这里可以查看所有文章"
          >
            归档
          </router-link>
        </li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
#head_container {
    padding: 5px;
    border-bottom: 1px solid #eee;
}

#head_container > a {
    padding-left: 31.4vh;
    font-weight: bold;
    font-size: larger;
    text-decoration: none;
}

#head_container > a:hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
}

#navigation_bar {
    height: 41px;
    background: linear-gradient(#FDFFFD, #ECECEC);
    border-bottom: 1.5px solid #ccc;
}

#navigation_buttons {
    padding-left: 31.4vh;
    list-style: none;
    height: 100%;
    letter-spacing: -8px;
}

#navigation_buttons > li {
    display: inline-block;
    letter-spacing: normal;
    background-color: white;
    padding: 1em 0.5em 0.25em 0.5em;
    border-bottom: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
}

.navigation_button.activated {
    text-decoration: none;
}

.navigation_button.activated:hover {
    text-decoration: underline;
    text-decoration-thickness: 2px;
}

.navigation_button.inactivated {
    color: black;
    text-decoration: none;
}

/* 顶部导航栏整体样式 */
</style>
