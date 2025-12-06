<script setup lang="ts">
import type { ArticleTocItem } from "@/types/article";
import type { PropType } from "vue";

// 目录项类型定义

const props = defineProps({
  toc: {
    type: Array as PropType<ArticleTocItem[]>,
    required: true
  },
  baseLevel: {
    type: Number,
    default: 0
  }
});

// 跳转到 ID 位置的函数
const scrollToId = (id: string) => {
  console.log(id);
  const destination = document.getElementById(id);
  if (destination) {
    destination.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
</script>

<template>
  <ul class="toc-list" :class="`toc-list-level-${baseLevel + 1}`">
    <li
      v-for="item in props.toc"
      :key="item.id"
      class="toc-item"
      :class="`toc-item-level-${item.level}`">
      <a
        :href="`#${item.id}`"
        class="toc-link"
        :title="item.text"
        @click.prevent.stop="scrollToId(item.id)">
        {{ item.text }}
      </a>

      <ArticleToc
        v-if="item.children.length > 0"
        :toc="item.children"
        :base-level="item.level" />
    </li>
  </ul>
</template>

<style>
.toc-title {
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 5px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-item {
  margin: 3px 0;
}

.toc-link {
  display: block;
  color: #005a9c;
  text-decoration: none;
  padding: 2px 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.toc-link:hover {
  text-decoration: underline;
}

.toc-list-level-3 {
  padding-left: 10px;
}
.toc-list-level-4 {
  padding-left: 20px;
} /* 对应 H4 */
.toc-list-level-5 {
  padding-left: 30px;
} /* 对应 H5 */
</style>
