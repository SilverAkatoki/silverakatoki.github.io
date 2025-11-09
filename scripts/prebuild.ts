import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { v4 as uuidv4 } from "uuid";
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

const main = async (): Promise<void> => {
  log("开始预构建文章与索引");

  await fs.rm(OUTPUT_POST_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_POST_DIR, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });

  const entries = await fs.readdir(INPUT_POSTS_DIR, { withFileTypes: true });
  const markdownFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith(".md"));

  log(`发现 ${markdownFiles.length} 个 Markdown 文件`);

  const articles: ArticleMetadata[] = [];
  const tagMap = new Map<string, number>();
  const categoryMap = new Map<string, number>();

  for (const file of markdownFiles) {
    log(`正在处理 ${file.name}`);
    try {
      const uuid = uuidv4();  // 全随机 UUID

      const sourcePath = path.join(INPUT_POSTS_DIR, file.name);
      const targetPath = path.join(OUTPUT_POST_DIR, `${uuid}.md`);

      const rawContent = await fs.readFile(sourcePath, "utf8");

      const parsed = loadFront(rawContent);

      // 去掉空行
      const body = parsed.__content.replace(/^\s*(?:\r?\n)+/, "");

      const hasPublished = parsed.published || siteInfo.prebuildSettings.articlePublishedStateDefault;

      if (!hasPublished) {
        throw new Error("读取到 published 字段为 false");
      }

      const title = inferTitle(parsed.title, body);
      const createdDate = getCreateDateString(parsed.createdDate);
      const updatedDate = parsed.updatedDate !== undefined ? toDateString(parsed.updatedDate) : createdDate;
      const tags = collectElement(parsed.tags);
      const categories = collectElement(parsed.category);

      tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, 1);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          tagMap.set(tag, tagMap.get(tag)! + 1);
        }
      });

      categories.forEach(category => {
        if (!categoryMap.has(category)) {
          categoryMap.set(category, 1);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          categoryMap.set(category, categoryMap.get(category)! + 1);
        }
      });

      await fs.writeFile(targetPath, `${body.trimEnd()}\n`, "utf8");

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
  await writeJson(CATEGORIES_INDEX_PATH, { categories: serializedCategories })

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



