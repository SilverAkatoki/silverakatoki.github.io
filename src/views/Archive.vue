<script setup lang="ts">
import { onMounted } from "vue";

import { useRoute } from "vue-router";

const route = useRoute();

const uuid = route.params.uuid as string;
console.log(uuid);

onMounted(() => {
  // fetch(`/posts/${aaa}`)
  //   .then(res => res.text())
  //   .then(res => console.log(res));
});
</script>

<template>
  <div class="archive-container">
    <p>UUID: {{ uuid }}</p>
  </div>
</template>

<style scoped></style>
