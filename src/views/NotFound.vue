<template>
  <div id="title_container">
    <p id="page_not_found_title">404</p>
    <p id="sub_title">页面未找到</p>
    <p id="sentence">您访问的页面不存在</p>
    <div style="margin-top: 20px;">
      <router-link to="/">
        返回主页
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
#title_container {
    width: 100%;
    height: 60vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#page_not_found_title {
    font-size: 42px;
    font-weight: bolder;
    margin: 20px;
    margin-bottom: 0;
}

#sub_title {
    font-size: large;
    margin-top: 0;
}

#sentence {
    margin-top: 8px;
    font-style: italic;
    color: #898989;
}

a:hover {
    text-decoration: none !important;
    opacity: 0.8;
}
</style>
