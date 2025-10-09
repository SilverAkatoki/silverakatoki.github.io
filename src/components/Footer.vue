<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  const script = document.createElement("script");
  script.src = "//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
  script.async = true;
  document.head.appendChild(script);
});
</script>

<template>
  <footer>
    <p>Copyright © {{ new Date().getFullYear() }} SilverAkatsuki</p>
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
