import { computed, nextTick, ref, watch } from "vue";

import { useRoute } from "vue-router";

import DOMPurify from "dompurify";
import hljs from "highlight.js/lib/common";
import katex from "katex";
import { marked } from "marked";

import { archives as archiveEntries } from "@/archives-index.json";

import type {
  ArticleIndex,
  ArticleMetadata,
  Footnote,
  RenderedFootnote
} from "@/types/article";

const archiveIndex = new Map<string, ArticleIndex>(
  (archiveEntries as ArticleIndex[]).map(entry => [entry.uuid, entry])
);

const footnoteIndexLookup = new Map<string, number>();

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

const footnoteReferenceExtension = {
  name: "footnoteReference",
  level: "inline" as const,
  start(src: string) {
    const match = src.match(/\[\^[^\]]+\]/);
    return match ? match.index : undefined;
  },
  tokenizer(src: string) {
    const rule = /^\[\^([^\]]+)\]/;
    const match = rule.exec(src);
    if (!match) {
      return undefined;
    }

    return {
      type: "footnoteReference",
      raw: match[0],
      label: match[1]
    };
  },
  renderer(token: { label: string; raw: string }) {
    const index = footnoteIndexLookup.get(token.label);
    if (!index) {
      return token.raw;
    }

    return `<sup class="footnote-ref"><a id="fnref-${index}" href="#fn-${index}">${index}</a></sup>`;
  }
};

marked.use({ extensions: [inlineMathExtension, blockMathExtension, footnoteReferenceExtension] });

const deriveTitle = (content: string, explicitTitle?: string): string => {
  if (explicitTitle && explicitTitle.trim()) {
    return explicitTitle.trim();
  }

  const firstBlock = content.split("\n\n")[0]?.trim() ?? "";
  return firstBlock.replace(/^#+\s*/, "");
};

const collectFootnotes = (content: string): {
  body: string;
  items: Footnote[];
} => {
  const normalized = content.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const bodyLines: string[] = [];
  const items = new Map<string, { index: number; fragments: string[] }>();

  let activeLabel: string | null = null;
  let footnoteIndex = 1;
  let isInFence = false;

  const fenceBoundary = /^(```|~~~)/;
  const continuationIndent = /^\s{1,4}/;

  for (const line of lines) {
    const trimmedStart = line.trimStart();

    if (fenceBoundary.test(trimmedStart)) {
      isInFence = !isInFence;
      activeLabel = null;
      bodyLines.push(line);
      continue;
    }

    if (isInFence) {
      bodyLines.push(line);
      continue;
    }

    const definitionMatch = line.match(/^\s{0,3}\[\^([^\]]+)\]:\s?(.*)$/);
    if (definitionMatch) {
      const [, label, initial] = definitionMatch;
      activeLabel = label;

      let record = items.get(label);
      if (!record) {
        record = { index: footnoteIndex, fragments: [] };
        footnoteIndex += 1;
        items.set(label, record);
      }

      if (initial) {
        record.fragments.push(initial.trimEnd());
      }

      continue;
    }

    if (activeLabel && continuationIndent.test(line)) {
      const fragment = line.replace(continuationIndent, "").trimEnd();
      items.get(activeLabel)?.fragments.push(fragment);
      continue;
    }

    activeLabel = null;
    bodyLines.push(line);
  }

  const footnoteList = Array.from(items.entries())
    .map(([label, value]) => ({
      label,
      index: value.index,
      content: value.fragments.join("\n").trim()
    }))
    .filter(item => item.content.length > 0)
    .sort((a, b) => a.index - b.index);

  return {
    body: bodyLines.join("\n"),
    items: footnoteList
  };
};

const renderMarkdownFragment = (fragment: string): string => {
  const rendered = marked.parse(fragment);
  return typeof rendered === "string" ? rendered : fragment;
};

const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, sanitizeOptions);
};

const scrollToFootnoteReference = (index: number): void => {
  if (typeof window === "undefined") {
    return;
  }

  const anchor = window.document.getElementById(`fnref-${index}`);
  if (!(anchor instanceof HTMLElement)) {
    return;
  }

  anchor.scrollIntoView({ behavior: "smooth", block: "center" });
  anchor.focus();

  const { pathname, search, hash } = window.location;
  const nextHash = `#fnref-${index}`;
  if (hash === nextHash) {
    return;
  }

  window.history.replaceState(null, "", `${pathname}${search}${nextHash}`);
};

const handleFootnoteBackrefClick = (index: number, event: MouseEvent): void => {
  event.preventDefault();
  scrollToFootnoteReference(index);
};

const syncFootnoteLookup = (items: Footnote[]): void => {
  footnoteIndexLookup.clear();
  items.forEach(item => {
    footnoteIndexLookup.set(item.label, item.index);
  });
};

export const useArchiveContent = () => {
  const route = useRoute();

  const markdownSource = ref<string>("");
  const renderedHtml = ref<string>("");
  const loadError = ref<string | null>(null);
  const meta = ref<ArticleMetadata | null>(null);
  const footnotes = ref<Footnote[]>([]);

  const sanitizedHtml = computed(() => sanitizeHtml(renderedHtml.value));

  const sanitizedFootnotes = computed<RenderedFootnote[]>(() =>
    footnotes.value.map(item => ({
      ...item,
      html: sanitizeHtml(renderMarkdownFragment(item.content))
    }))
  );

  watch(
    markdownSource,
    async val => {
      const result = await marked.parse(val);
      renderedHtml.value = result as string;
    },
    { immediate: true }
  );

  watch(
    [sanitizedHtml, sanitizedFootnotes],
    async () => {
      if (typeof window === "undefined") {
        return;
      }

      await nextTick();
      window.document.querySelectorAll("pre code").forEach(el => {
        try {
          hljs.highlightElement(el as HTMLElement);
        } catch {
          // ignore
        }
      });
    },
    { immediate: true }
  );

  const tagsSet = new Set<string>();

  const loadArchive = async (postUuid: string): Promise<void> => {
    loadError.value = null;

    const articleMetadata = archiveIndex.get(postUuid);
    if (!articleMetadata) {
      loadError.value = "文章未收录";
      markdownSource.value = "";
      renderedHtml.value = "";
      footnotes.value = [];
      meta.value = null;
      syncFootnoteLookup([]);
      return;
    }

    try {
      const baseUrl = import.meta.env.BASE_URL ?? "/";
      const normalizedBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      const postUrl = `${normalizedBaseUrl}posts/${postUuid}.md`;

      const response = await fetch(postUrl);
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }

      const content = (await response.text()).trim();
      const { body, items } = collectFootnotes(content);
      footnotes.value = items;
      syncFootnoteLookup(items);

      markdownSource.value = body;

      tagsSet.clear();
      (articleMetadata.tags ?? []).forEach(tag => tagsSet.add(tag));

      meta.value = {
        title: deriveTitle(content, articleMetadata.title),
        date: articleMetadata.date ?? "",
        tags: [...tagsSet]
      };
    } catch (error) {
      loadError.value = error instanceof Error ? error.message : "文章加载失败";
      markdownSource.value = "";
      renderedHtml.value = "";
      footnotes.value = [];
      meta.value = null;
      syncFootnoteLookup([]);
    }
  };

  watch(
    () => route.params.uuid as string | undefined,
    async newUuid => {
      if (!newUuid) {
        loadError.value = "鏈壘鍒板搴旂殑鏂囩珷";
        markdownSource.value = "";
        renderedHtml.value = "";
        return;
      }

      await loadArchive(newUuid);
    },
    { immediate: true }
  );

  return {
    loadError,
    meta,
    sanitizedHtml,
    sanitizedFootnotes,
    handleFootnoteBackrefClick
  };
};
