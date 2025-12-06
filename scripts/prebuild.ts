import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { marked, type Token } from "marked";
import short from "short-uuid";
import pkg from "yaml-front-matter";

import siteInfo from "../src/data/site-settings.json" with { type: "json" };

const { loadFront } = pkg;

interface ArticleMetadata {
  uuid: string;
  title: string;
  createdDate: string;
  updatedDate: string;
  categories: string[];
  tags: string[];
};

const ROOT_DIR = process.cwd();

// 文章目录
const INPUT_POSTS_DIR = path.join(ROOT_DIR, "posts");
const OUTPUT_POST_DIR = path.join(ROOT_DIR, "public", "posts");
const OUTPUT_POST_IMG_DIR = path.join(OUTPUT_POST_DIR, "imgs");

// 配置目录
const DATA_DIR = path.join(ROOT_DIR, "src", "data");
const ARTICLES_INDEX_PATH = path.join(DATA_DIR, "articles-index.json");
const TAGS_INDEX_PATH = path.join(DATA_DIR, "tags.json");
const CATEGORIES_INDEX_PATH = path.join(DATA_DIR, "categories.json");

const log = (message: string): void => console.log(`[prebuild] ${message}`);

const getCreateDateString = (value: unknown): string => {
  if (value === undefined || value === null) {
    throw new Error("缺少 \"createDate\" 字段");
  }
  return toDateString(value);
};

const toDateString = (value: unknown): string => {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const normalized = String(value).trim();

  if (!/\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])/.test(normalized)) {
    throw new Error(`日期字段 ${value} 不符合 YYYY-MM-DD 的格式`);
  }

  return normalized;
};

const collectElement = (...fields: unknown[]): string[] => {
  const elements = new Set<string>();

  // 递归把标签抽出来
  const visit = (value: unknown): void => {
    if (value === undefined || value === null) {
      return;
    }

    // 形如 [xxx, yyy] 或是 ["xxx", "yyy"] 都可以
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    String(value)
      .split(/[,，]/)
      .map(token => token.trim())
      .filter(Boolean)
      .forEach(token => elements.add(token));
  };

  fields.forEach(visit);
  return [...elements];
};

const inferTitle = (candidate: unknown, body: string): string => {
  if (candidate !== undefined && candidate !== null) {
    const title = String(candidate).trim();

    if (!title) {
      throw new Error("YAML front matter 中 \"title\" 字段若填写则不可为空");
    }

    return title;
  }

  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const headingMatch = /^#\s+(.+)$/.exec(trimmed);
    if (headingMatch) {
      return headingMatch[1].trim();
    }
  }

  throw new Error("文章不存在一级标题");
};

/**
* 格式化输出 JSON
*/
const writeJson = async (filePath: string, data: unknown): Promise<void> => {
  const content = `${JSON.stringify(data)}\n`;
  await fs.writeFile(filePath, content, "utf8");
};

const modifiedImgUrl = async (sourceImgPath: string, context: string): Promise<string> => {
  const tokens = marked.Lexer.lex(context);

  const imageTokens: Token[] = [];
  const walkTokens = (tokens: Token[]) => {
    for (const token of tokens) {
      switch (token.type) {
      case "image":
        imageTokens.push(token);
        break;
      case "paragraph":
      case "blockquote":
      case "list_item":
      case "heading":
      case "table_cell":
        if (token.tokens) {
          walkTokens(token.tokens);
        }
        break;
      case "list":
        if (token.items) {
          walkTokens(token.items);
        }
        break;
      case "table":
        if (token.header) {
          walkTokens(token.header);
        }
        if (token.rows) {
          for (const row of token.rows) {
            walkTokens(row);
          }
        }
        break;
      }
    }
  };

  walkTokens(tokens);

  if (imageTokens.length === 0) {
    return context;
  }

  // 确保目标 imgs 目录存在
  await fs.mkdir(OUTPUT_POST_IMG_DIR, { recursive: true });

  let modified = context;

  // 从后向前替换，避免索引错位
  for (let i = imageTokens.length - 1; i >= 0; i--) {
    const token = imageTokens[i] as unknown as Token & { href: string | null; title: string | null; text: string | null; raw?: string };
    if (token.type !== "image") continue;

    const raw = token.raw ?? `![${token.text}](${token.href}${token.title ? ` "${token.title}"` : ""})`;
    const idx = modified.lastIndexOf(raw);
    if (idx === -1) continue;

    const href = String(token.href ?? "").trim();
    if (!href) continue;

    // 只处理相对路径
    if (/^(https?:\/\/|\/|data:)/i.test(href)) {
      continue;
    }

    const srcImgFullPath = path.normalize(path.join(sourceImgPath, href));

    // 保留原扩展名
    const ext = path.extname(href) || "";
    const newFilename = `${short.generate()}${ext}`;
    const destImgFullPath = path.join(OUTPUT_POST_IMG_DIR, newFilename);

    let newHref;
    try {
      // 复制文件到 public/posts/imgs/<uuid>.<ext>
      await fs.copyFile(srcImgFullPath, destImgFullPath);
      // 路径应该是这样 /posts/imgs/<uuid>.<ext>
      newHref = `/posts/imgs/${newFilename}`;
      log(`已复制图片 ${href} -> ${path.relative(ROOT_DIR, destImgFullPath)}`);
    } catch (err: unknown) {
      log(`复制图片失败: ${srcImgFullPath}： ${String(err)}`);
      // 保持原 href
      newHref = href;
    }

    const newImageMarkdown = `![${token.text ?? ""}](${newHref}${token.title ? ` "${token.title}"` : ""})`;
    modified = modified.substring(0, idx) + newImageMarkdown + modified.substring(idx + raw.length);
  }

  return modified;
};

const main = async (): Promise<void> => {
  log("开始预构建文章与索引");

  await fs.rm(OUTPUT_POST_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_POST_DIR, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });

  const entries = await fs.readdir(INPUT_POSTS_DIR, { withFileTypes: true });
  const markdownFiles: { name: string }[] = [];
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      markdownFiles.push({ name: entry.name });
      continue;
    }
    if (entry.isDirectory()) {
      const subPath = path.join(INPUT_POSTS_DIR, entry.name);
      try {
        const subEntries = await fs.readdir(subPath, { withFileTypes: true });
        for (const subEntry of subEntries) {
          if (subEntry.isFile() && subEntry.name.endsWith(".md")) {
            // 存储相对 posts 目录的路径，例如 "subdir/file.md"
            markdownFiles.push({ name: path.join(entry.name, subEntry.name) });
          }
        }
      } catch {
        // 子目录读取失败则跳过
      }
    }
  }

  log(`发现 ${markdownFiles.length} 个 Markdown 文件`);

  const articles: ArticleMetadata[] = [];
  const tagMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  for (const file of markdownFiles) {
    log(`正在处理 ${file.name}`);
    try {
      const sourcePath = path.join(INPUT_POSTS_DIR, file.name);
      const sourceDir = path.dirname(sourcePath);

      const rawContent = await fs.readFile(sourcePath, "utf8");

      const parsed = loadFront(rawContent);

      // 去掉空行
      const body = parsed.__content.replace(/^\s*(?:\r?\n)+/, "");

      const hasPublished = parsed.published || siteInfo.prebuildSettings.articlePublishedStateDefault;

      if (!hasPublished) {
        throw new Error("读取到 published 字段为 false");
      }

      const title = inferTitle(parsed.title, body);

      const hasUuid = parsed.uuid !== undefined && parsed.uuid !== null && String(parsed.uuid).trim() !== "";
      const uuid = hasUuid
        ? String(parsed.uuid).trim()
        : short.generate();

      const createdDate = getCreateDateString(parsed.createdDate);
      const updatedDate = parsed.updatedDate !== undefined ? toDateString(parsed.updatedDate) : createdDate;
      const tags = collectElement(parsed.tags);
      const categories = collectElement(parsed.category);

      // 回写 UUID 到源文件
      if (!hasUuid) {
        const yamlLines = Object.entries(parsed).filter(([key]) => key !== "__content").map((
          [key, value]) => {
          if (key === "createdDate" || key === "updatedDate") {
            // 特判日期，因为 yaml-front-matter 会把日期解析成 Date 对象，然后就会变成很长一条
            return `${key}: ${toDateString(value)}`;
          }
          return `${key}: ${value}`;
        });
        yamlLines.unshift(`uuid: ${uuid}`);
        const newContent = `---\n${yamlLines.join("\n")}\n---${parsed.__content}`;  // __content 包含前后的换行
        await fs.writeFile(sourcePath, newContent, "utf8");
        log(`已回写 UUID 到源文件 ${file.name}`);
      }

      tags.forEach(tag => {
        const currentCount = tagMap.get(tag) ?? 0;
        tagMap.set(tag, currentCount + 1);
      });

      categories.forEach(category => {
        // 本质还是统计数量，函数式很神奇吧
        const currentCount = categoryMap.get(category) ?? 0;
        categoryMap.set(category, currentCount + 1);
      });

      const context = await modifiedImgUrl(sourceDir, `${body.trimEnd()}\n`);

      const targetPath = path.join(OUTPUT_POST_DIR, `${uuid}.md`);
      await fs.writeFile(targetPath, context, "utf8");

      articles.push({ uuid, title, createdDate, updatedDate, categories, tags });
    } catch (err: unknown) {
      log(`${err}`);
      log("已跳过该文章");
    }
  }

  // 按修改日期排序，最晚写的在最前面，与前端约定俗成
  // 根据 UUID 决定相同日期时的排序
  articles.sort((a, b) => {
    const dateDiff = b.updatedDate.localeCompare(a.updatedDate);
    return dateDiff !== 0 ? dateDiff : a.uuid.localeCompare(b.uuid);
  });

  const serializedTags = [...tagMap].sort((a, b
  ) => a[0].localeCompare(b[0]));

  const serializedCategories = [...categoryMap].sort((a, b
  ) => a[0].localeCompare(b[0]));

  await writeJson(ARTICLES_INDEX_PATH, { articles });
  await writeJson(TAGS_INDEX_PATH, { tags: serializedTags });
  await writeJson(CATEGORIES_INDEX_PATH, { categories: serializedCategories });

  log(`已写入 ${articles.length} 条文章索引到 ${path.relative(ROOT_DIR, ARTICLES_INDEX_PATH)}`);
  log(`已写入 ${serializedTags.length} 个标签到 ${path.relative(ROOT_DIR, TAGS_INDEX_PATH)}`);
  log(`已写入 ${serializedCategories.length} 个类别到 ${path.relative(ROOT_DIR, CATEGORIES_INDEX_PATH)}`);
  log("预构建完成");
};

main().then(
  () => { /* 占位置 */ },
  (err) => {
    log("预构建失败");
    log(err);
  }
);



