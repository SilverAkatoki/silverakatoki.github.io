<script setup lang="ts">
import { computed, ref, watch, nextTick } from "vue";

import DOMPurify from "dompurify";
import hljs from "highlight.js/lib/common";
import katex from "katex";
import { marked } from "marked";

const markdownSource = ref<string>(`# Markdown + LaTeX Playground

> A GitHub Flavored Markdown example rendered with Vue 3.
> 
> beaked lines

- [x] Parse headings, tables, and lists
- [x] Render $$inline$$ formulas with KaTeX
- [ ] Highlight fenced code automatically

| Symbol | Description |
| --- | --- |
| $$\\alpha$$ | First letter in the sequence |
| $$\\beta$$ | Second letter in the sequence |

Here is the classic energy-mass equivalence inline: $$E = mc^2$$ within a sentence for context.

We can also display formulas on their own line:

$$
\\sum_{k=1}^{n} k = \\frac{n (n + 1)}{2}
$$

\`\`\`ts
// inline math $$doNotParse$$ must remain untouched inside code
type Vector = [number, number];

const length = (value: Vector): number => {
  const [x, y] = value;
  return Math.sqrt(x ** 2 + y ** 2);
};
\`\`\`

\`\`\`rust
// 🦀
fn main() {
    let inline_math = "$$doNotParse$$";
    println!("Hello, world! {}", inline_math);
}
\`\`\`

| Step | Details |
| --- | --- |
| 1 | Write Markdown with $$\\LaTeX$$ syntax |
| 2 | Convert to HTML with safety checks |
| 3 | Enjoy the highlighted result |

Another block formula for good measure:

$$
\\sqrt{2}
$$
`);

marked.setOptions({ gfm: true, breaks: true });

// math 扩展（保持现有实现）
const inlineMathExtension = {
  name: "inlineMath",
  level: "inline" as const,
  start(src: string) {
    const match = src.match(/\$\$/);
    return match ? match.index : undefined;
  },
  tokenizer(src: string) {
    const rule = /^\$\$([^\n]+?)\$\$/;
    const match = rule.exec(src);
    if (!match) {
      return undefined;
    }
    return {
      type: "inlineMath",
      raw: match[0],
      text: match[1].trim()
    };
  },
  renderer(token: { text: string }) {
    return katex.renderToString(token.text, {
      throwOnError: false
    });
  }
};

const blockMathExtension = {
  name: "blockMath",
  level: "block" as const,
  start(src: string) {
    const match = src.match(/\$\$\s*\n/);
    return match ? match.index : undefined;
  },
  tokenizer(src: string) {
    const rule = /^\$\$\s*\n([\s\S]+?)\n\$\$/;
    const match = rule.exec(src);
    if (!match) {
      return undefined;
    }
    return {
      type: "blockMath",
      raw: match[0],
      text: match[1].trim()
    };
  },
  renderer(token: { text: string }) {
    return `<div class="math-block">${katex.renderToString(token.text, {
      displayMode: true,
      throwOnError: false
    })}</div>`;
  }
};

marked.use({ extensions: [inlineMathExtension, blockMathExtension] });

// 先由 marked 生成 HTML
const renderedHtml = ref<string>("");

watch(
  markdownSource,
  async val => {
    const result = await marked.parse(val);
    renderedHtml.value = result as string;
  },
  { immediate: true }
);

// DOMPurify：保留 class 属性（让 hljs 根据 class="language-xxx" 生效），并允许 KaTeX 常见标签
const sanitizeOptions = {
  USE_PROFILES: { html: true },
  ADD_TAGS: ["math", "mrow", "mi", "mo", "mn", "msup", "svg", "path", "g"],
  ADD_ATTR: [
    "class",
    "style",
    "aria-hidden",
    "data-lang",
    "width",
    "height",
    "viewBox",
    "preserveAspectRatio",
    "focusable",
    "xmlns",
    "d",
    "fill",
    "stroke",
    "stroke-width"
  ]
};
const sanitizedHtml = computed(() =>
  // 注意：先 sanitize 再注入 v-html，随后我们会在 DOM 更新后触发 hljs.highlightElement
  DOMPurify.sanitize(renderedHtml.value, sanitizeOptions)
);

// 在 sanitizedHtml 更新后，对页面上所有 code 元素执行高亮
watch(
  sanitizedHtml,
  async () => {
    await nextTick();
    document.querySelectorAll("pre code").forEach(el => {
      try {
        // highlightElement 会根据 class="language-xxx" 或代码内容自动高亮
        hljs.highlightElement(el as HTMLElement);
      } catch {
        // ignore
      }
    });
  },
  { immediate: true }
);
</script>

<template>
  <main class="article">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <article class="markdown-body" v-html="sanitizedHtml" />
  </main>
</template>

<style>
@import "highlight.js/styles/github.css";
@import "katex/dist/katex.min.css";
.article {
  min-height: 100vh;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, "Noto Sans", sans-serif;
  box-sizing: border-box;
}
.markdown-body {
  box-sizing: border-box;
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  color: #24292e;
  font-size: 16px;
  line-height: 1.65;
  border-radius: 6px;
  word-wrap: break-word;
  -webkit-font-smoothing: antialiased;
  text-align: left;
}

.markdown-body *,
.markdown-body *::before,
.markdown-body *::after {
  box-sizing: inherit;
}
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body p {
  margin: 1rem 0 0.5rem;
  text-align: left;
  color: inherit;
}
.markdown-body a {
  color: #0969da;
  text-decoration: none;
}
.markdown-body a:hover {
  text-decoration: underline;
}
.markdown-body ul,
.markdown-body ol {
  padding-left: 1.6rem;
  margin: 0 0 1rem;
}
.markdown-body li {
  margin: 0.25rem 0;
  line-height: 1.6;
}
.markdown-body code {
  font-family:
    Fira Code,
    Consolas,
    "Liberation Mono",
    Menlo,
    monospace;
  background: rgba(27, 31, 35, 0.05);
  padding: 0.12em 0.4em;
  border-radius: 6px;
  font-size: 85%;
}
.markdown-body pre {
  background: #f6f8fa;
  border-radius: 6px;
  overflow: auto;
  margin: 0.75rem 0;
  border: 1px solid #e1e4e8;
}

.markdown-body table {
  margin: 1rem auto;
  max-width: 100%;
  overflow: auto;
  border-collapse: collapse;
  border-spacing: 0;
  background: transparent;
  border: 1px solid #dfe2e5;
}

.markdown-body thead th {
  padding: 6px 13px;
  text-align: center;
  vertical-align: bottom;
  font-weight: 600;
  background: #f6f8fa;
  border-bottom: 1px solid #dfe2e5;
}

.markdown-body th,
.markdown-body td {
  padding: 6px 13px;
  vertical-align: top;
  text-align: center;
  border-top: 1px solid #e6edf3;
  word-break: break-word;
}

.markdown-body th[align="center"],
.markdown-body td[align="center"] {
  text-align: center;
}
.markdown-body th[align="right"],
.markdown-body td[align="right"] {
  text-align: right;
}

.markdown-body img {
  max-width: 100%;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}
@media (max-width: 720px) {
  .markdown-body {
    font-size: 15px;
    padding: 16px;
  }
  .markdown-body table {
    display: block;
    width: 100%;
    overflow-x: auto;
  }
}

.markdown-body blockquote {
  margin: 0 0 1rem;
  padding: 0rem 1rem;
  color: #6a737d;
  border-left: 0.25rem solid rgba(27, 31, 35, 0.08);
  background: #f6f8fa;
  border-radius: 6px;
}
.markdown-body input[type="checkbox"] {
  margin: 0 0.35rem 0 0.05rem;
  vertical-align: middle;
}
.hljs {
  background: transparent;
}
.katex {
  user-select: none;
  -webkit-user-drag: none;
  -moz-user-drag: none;
  -ms-user-drag: none;
}
</style>
