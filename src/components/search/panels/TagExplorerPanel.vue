<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";

import { tags } from "@/data/tags.json";
const isExpanded = ref(false);
const showToggleButton = ref(false);

const tagsContainerRef = ref<HTMLElement | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);

onMounted(() => {
  if (tagsContainerRef.value) {
    resizeObserver.value = new ResizeObserver(() => {
      void resolveTagContainerHeightChanged();
    });
    resizeObserver.value.observe(tagsContainerRef.value);
  }
  void resolveTagContainerHeightChanged();
});

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
});

const resolveTagContainerHeightChanged = () => {
  updateToggleButtonShow();
  updateTagCotainerHeight();
};

const updateToggleButtonShow = () => {
  if (tagsContainerRef.value === null) return;

  const container = tagsContainerRef.value;

  // 临时解除 max-height 限制以测量实际高度
  // 因为是依赖于元素换行后挤压测得真实的 DOM 高度
  // 最后记得还原回去，要不然显示 bug
  const originalMaxHeight = container.style.maxHeight;
  container.style.maxHeight = "none";
  const fullHeight = container.scrollHeight;
  container.style.maxHeight = originalMaxHeight;

  const itemHeight = container.querySelector(".tag-item")?.clientHeight || 0;

  if (fullHeight > itemHeight) {
    showToggleButton.value = true;
  } else {
    showToggleButton.value = false;
    isExpanded.value = false; // 内容变少了，直接收起
  }
};

const updateTagCotainerHeight = () => {
  if (tagsContainerRef.value === null) return;

  if (!isExpanded.value) {
    const itemHeight =
      tagsContainerRef.value.querySelector(".tag-item")?.clientHeight || 0;
    // 靠限制限定在一行内
    tagsContainerRef.value.style.maxHeight = `${itemHeight}px`;
  } else {
    // 让 DOM 自然被元素挤压膨胀
    tagsContainerRef.value.style.maxHeight = "none";
  }
};

// 不监听就会按了按钮没反应
watch(isExpanded, updateTagCotainerHeight);

// 手机上死活关不掉展开按钮
window.addEventListener("resize", updateToggleButtonShow);
</script>

<template>
  <div class="article-tags-selector">
    <div class="header">
      <span class="title">总共有 {{ tags.length }} 个标签</span>
      <button
        v-show="showToggleButton"
        class="toggle-btn"
        @click="isExpanded = !isExpanded">
        {{ isExpanded ? "收起" : "展开" }}
        <span :class="['arrow', isExpanded ? 'up' : 'down']"></span>
      </button>
    </div>

    <div ref="tagsContainerRef" class="tags-container">
      <div v-for="tag in tags" :key="tag[0]" class="tag-item">
        <router-link
          :to="{ path: '/tag', query: { tag: tag[0] } }"
          class="tag-link">
          <span class="bullet"></span>
          {{ tag[0] }}
        </router-link>
        <span class="tag-count">({{ tag[1] }})</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-tags-selector {
  font-family: Arial, sans-serif;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 16px;
  background-color: #f9f9f9;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.title {
  font-size: 16px;
  color: #333;
}

.toggle-btn {
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
}

.toggle-btn:hover {
  background-color: #e6f2ff;
}

.arrow {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  margin-left: 4px;
}

.arrow.down {
  border-top: 4px solid #0066cc;
}

.arrow.up {
  border-bottom: 4px solid #0066cc;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  line-height: 28px;
  overflow: hidden;
}

.tag-item {
  display: flex;
}

.tag-count {
  margin-left: 2px;
  color: green;
  font-size: 14px;
  justify-content: center;
}

.tag-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #0066cc;
  font-size: 14px;
  white-space: nowrap;
}

.tag-link:hover {
  text-decoration: underline;
}

.bullet {
  width: 6px;
  height: 6px;
  background-color: #0066cc;
  border-radius: 50%;
  margin-right: 4px;
  flex-shrink: 0;
}
</style>
