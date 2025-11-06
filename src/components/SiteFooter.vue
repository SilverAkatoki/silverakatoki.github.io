<script setup lang="ts">
import siteSettings from "@/data/site-settings.json";
</script>

<template>
  <footer>
    <p>Copyright © {{ new Date().getFullYear() }} {{ siteSettings.siteInfo.bottomCopyRightName }}</p>
  </footer>
</template>

<style scoped>
footer {
    width: 100%;
    height: 64px;
    background-color: #F0F0F0;
    border-top: 1px solid silver;
    display: flex;
    justify-content: center;
    align-items: center;
}

footer > p {
    color: var(--text-gray);
}
</style>
