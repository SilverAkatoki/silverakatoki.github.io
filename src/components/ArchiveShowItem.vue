<script setup lang="ts">
import type { Archive } from "@/type";

defineProps<{
  archive: Archive;
}>();
</script>

<template>
  <div class="archive-item">
    <router-link
      v-if="archive.uuid"
      :to="`/archive/${archive.uuid}`"
      class="archive-title"
    >
      {{ archive.title }}
    </router-link>
    <span v-else class="archive-title">{{ archive.title }}</span>
    <span class="archive-time">
      {{ archive.date }}
    </span>
  </div>
</template>

<style scoped>
.archive-item {
  display: flex;
  position: relative;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 0.75em;
  margin-bottom: 0.75em;
  flex-direction: row;
  align-items: center;
}

.archive-item::before {
  content: "";
  display: block;
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: #1b518a;
  border-radius: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.archive-title {
  flex: 1;
  font-size: large;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 10px;
}

.archive-content {
  margin-left: 10px;
  margin-top: 5px;
}

.archive-time {
  margin-left: auto;
  margin-right: 2px;
  display: inline-block;
  color: var(--text-gray);
  align-self: flex-end;
  justify-self: center;
}
</style>
