<script setup lang="ts"></script>

<template>
  <div class="title-container">
    <div class="title">404</div>
    <div class="sub-title">页面未找到</div>
    <div class="sentence">您访问的页面不存在</div>
    <div style="margin-top: 20px">
      <router-link to="/"> 返回主页 </router-link>
    </div>
  </div>
</template>

<style scoped>
.title-container {
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
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

a:hover {
  text-decoration: none !important;
  opacity: 0.8;
}
</style>
