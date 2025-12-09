import { computed, nextTick, ref, watch } from "vue";

import DOMPurify from "dompurify";
import hljs from "highlight.js/lib/common";
import katex from "katex";
import { Marked, type RendererObject, type Token, type Tokens } from "marked";
import markedFootnote from "marked-footnote";
import { generate as generateShortUuid } from "short-uuid";

import type {
  Article,
  ArticleMetadata,
  ArticleTocItem
} from "@/types/article";

const fillTocChildren = (toc: ArticleTocItem[]) => {
  const root: ArticleTocItem = {
    id: "root",
    level: 0,
    text: "root",
    children: []
  };

  const stack: ArticleTocItem[] = [root];
  for (const item of toc) {
    const currentNode: ArticleTocItem = {
      ...item,
      children: []
    };

    while (stack.length > 1 && currentNode.level <= stack[stack.length - 1].level) {
      stack.pop();
    }

    const parent = stack[stack.length - 1];
    parent.children.push(currentNode);

    stack.push(currentNode);
  }

  // root.children[0] 是唯一一个元素，是文章的标题，取它的子节点就是下面的标题了
  // 没渲染前 root.children 是空的，加一个防止出访问 undefined 属性的错误
  return root.children[0]?.children;
};

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

// 为了确保类型检查不爆红搞的，给 marked 库擦屁股
// 谁家 tokens 和 token 不分的
interface TrueHeading {
  tokens: Token[],
  depth: number;
  text: string;
};

export const useArticleContent = () => {
  const articleContentRef = ref<HTMLElement | null>(null);
  const mdText = ref<string>("");
  const meta = ref<ArticleMetadata | null>(null);
  const toc = ref<ArticleTocItem[]>([]);


  const renderedHtml = ref<string>("");
  const sanitizedHtml = computed(() => sanitizeHtml(renderedHtml.value));

  const renderer: RendererObject = {
    heading(headingToken: Tokens.Heading): string {
      const { tokens, depth, text } = headingToken as unknown as TrueHeading;
      const titleHtml = this.parser.parseInline(tokens);

      const id = generateShortUuid();   // 省事直接 UUID 搞定，不用构造自己的 ID
      toc.value.push({ id, level: depth, text, children: [] });

      return `<h${depth} id="${id}">
              ${titleHtml}
            </h${depth}>`;
    }
  };

  const createParser = () => {
    const marked = new Marked();
    marked.setOptions({ gfm: true, breaks: true });
    marked.use({ renderer, extensions: [inlineMathExtension, blockMathExtension] });
    marked.use(markedFootnote({ description: "脚注", backRefLabel: "回到正文 {0}" }));
    return marked;
  };

  const parser = createParser();


  watch(
    mdText,
    async val => {
      toc.value = [];
      try {
        const result = await parser.parse(val);
        renderedHtml.value = result as string;
      } catch (err) {
        console.log(err);
      }
    },
    { immediate: true }
  );

  watch(
    sanitizedHtml,
    async () => {
      if (!articleContentRef.value) {
        // 等渲染完了在高亮
        return;
      }

      await nextTick();

      // 应用高亮
      articleContentRef.value.querySelectorAll("pre code").forEach(el => {
        try {
          hljs.highlightElement(el as HTMLElement);
        } catch {
          // 吞掉
        }
      });
    },
    { immediate: true }
  );

  // 这里和下面两个都是为了维护组合式函数的状态
  const clearArticleContent = (): void => {
    mdText.value = "";
    renderedHtml.value = "";
    meta.value = null;
    toc.value = [];
  };

  const setArticleContent = ({ metadata, content }: Article): void => {
    meta.value = metadata;
    mdText.value = content.trim();
  };

  const tocTree = computed(() => fillTocChildren(toc.value)) || [];

  return {
    meta,
    sanitizedHtml,
    tocTree,
    articleContentRef,
    setArticleContent,
    clearArticleContent
  };
};

