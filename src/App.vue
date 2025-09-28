<script setup lang="ts">
import Footer from "@/components/Footer.vue";
import Header from "@/components/Header.vue";
</script>

<template>
  <div id="app">
    <Header />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style lang="css">
:root {
  --footer-height: 64px;
  --body-container-margin: 35vh;
}

* {
  padding: 0;
  margin: 0;
}

html body {
  font-family: "思源黑体";
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
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
</style>
