import { computed, nextTick, ref, watch } from "vue";

import DOMPurify from "dompurify";
import hljs from "highlight.js/lib/common";
import katex from "katex";
import { marked } from "marked";
import markedFootnote from "marked-footnote";

import type {
  ArticleMetadata, Article
} from "@/types/article";


marked.setOptions({ gfm: true, breaks: true });

const inlineMathExtension = {
  name: "inlineMath",
  level: "inline" as const,
  start(src: string): undefined | number {
    const match = src.match(/\$(?!\$)/);
    return match ? match.index : undefined;
  },
  tokenizer(src: string): undefined | { type: "inlineMath"; raw: string; text: string } {
    if (src[0] !== "$" || src[1] === "$") {
      return undefined;
    }

    let index = 1;
    let escaped = false;

    while (index < src.length) {
      const char = src[index];

      if (char === "\n") {
        return undefined;
      }

      if (!escaped && char === "$") {
        const raw = src.slice(0, index + 1);
        const text = raw.slice(1, -1).trim();
        return {
          type: "inlineMath",
          raw,
          text
        };
      }

      escaped = !escaped && char === "\\";
      index += 1;
    }

    return undefined;
  },
  renderer(token: { text: string }): string {
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
marked.use(markedFootnote({ description: "脚注", backRefLabel: "回到正文 {0}" }));

/**
  * 净化 HTML
*/
const sanitizeHtml = (html: string): string => {
  // 允许的标签和属性，这里得把 KaTeX 相关的也加上，不然数学公式会被清理掉
  const sanitizeOptions = {
    USE_PROFILES: { html: true },
    ADD_TAGS: ["math", "mrow", "mi", "mo", "mn", "msup", "svg", "path", "g"],
    ADD_ATTR: [
      "class",
      "style",
      "aria-hidden",
      "aria-describedby",
      "aria-label",
      "data-lang",
      "width",
      "height",
      "viewBox",
      "preserveAspectRatio",
      "focusable",
      "xmlns",
      "d",
      "fill",
      "id",
      "stroke",
      "stroke-width"
    ]
  };

  return DOMPurify.sanitize(html, sanitizeOptions);
};

export const useArticleContent = () => {
  const mdText = ref<string>("");
  const meta = ref<ArticleMetadata | null>(null);

  const renderedHtml = ref<string>("");
  const sanitizedHtml = computed(() => sanitizeHtml(renderedHtml.value));

  watch(
    mdText,
    async val => {
      const result = await marked.parse(val);
      renderedHtml.value = result as string;
    },
    { immediate: true }
  );

  watch(
    sanitizedHtml,
    async () => {
      if (typeof window === "undefined") {
        return;
      }

      await nextTick();

      // 应用高亮
      window.document.querySelectorAll("pre code").forEach(el => {
        try {
          hljs.highlightElement(el as HTMLElement);
        } catch {
          // 忽略错误
        }
      });
    },
    { immediate: true }
  );

  const clearArticleContent = (): void => {
    mdText.value = "";
    renderedHtml.value = "";
    meta.value = null;
  };

  const setArticleContent = ({ metadata, content }: Article): void => {
    meta.value = metadata;
    mdText.value = content.trim();
  };

  return {
    meta,
    sanitizedHtml,
    setArticleContent,
    clearArticleContent
  };
};
