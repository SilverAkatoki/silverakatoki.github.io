<script setup lang="ts">
import { useArchiveContent } from "@/composables/useArchiveContent";

const { loadError, sanitizedHtml, sanitizedFootnotes, handleFootnoteBackrefClick } =
  useArchiveContent();
</script>

<template>
  <main class="article">
    <p v-if="loadError" class="article-error">{{ loadError }}</p>
    <template v-else>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <article class="markdown-body" v-html="sanitizedHtml" />
      <section v-if="sanitizedFootnotes.length" class="footnotes">
        <h2 id="footnotes-label">脚注</h2>
        <ol>
          <li
            v-for="item in sanitizedFootnotes"
            :id="`fn-${item.index}`"
            :key="item.label"
          >
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="footnote-content" v-html="item.html" />
            <a
              class="footnote-backref"
              :href="`#fnref-${item.index}`"
              aria-label="回到正文"
              @click="handleFootnoteBackrefClick(item.index, $event)"
            >↩</a>
          </li>
        </ol>
      </section>
    </template>
  </main>
</template>

<style src="./index.css"></style>
