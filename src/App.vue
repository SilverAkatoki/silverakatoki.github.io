<script setup lang="ts">
import SiteFooter from "@/components/layout/SiteFooter.vue";
import SiteHeader from "@/components/layout/SiteHeader.vue";
</script>

<template>
  <div id="app">
    <site-header />
    <main>
      <router-view />
    </main>
    <site-footer />
  </div>
</template>

<style lang="css">
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
