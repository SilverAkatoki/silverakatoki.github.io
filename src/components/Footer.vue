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
    <div id="site_viewer_counter_container">
      <span><span>访客</span><span id="busuanzi_value_site_uv" /><span>人（UV）</span></span>
      <span><span>浏览</span><span id="busuanzi_value_site_pv" /><span>次（PV）</span></span>
    </div>
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

#site_viewer_counter_container {
    padding-left: 3em;
    display: flex;
    flex-direction: column;
    align-items: center;
}

#site_viewer_counter_container > span {
    color: var(--text-gray);
    display: block;
}

#busuanzi_value_site_uv,
#busuanzi_value_site_pv {
    font-weight: 600;
}
</style>
