import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import pkg from "yaml-front-matter";

// 预构建脚本：扫描 posts 目录，生成公开文章内容与索引文件。
interface ArticleMetadata {
  uuid: string;
  title: string;
  date: string;
  tags: string[];
};

const { loadFront } = pkg;

const ROOT_DIR = process.cwd();
const POSTS_DIR = path.join(ROOT_DIR, "posts");
const PUBLIC_POSTS_DIR = path.join(ROOT_DIR, "public", "posts");
const DATA_DIR = path.join(ROOT_DIR, "src", "data");
const ARTICLES_INDEX_PATH = path.join(DATA_DIR, "articles-index.json");
const TAGS_INDEX_PATH = path.join(DATA_DIR, "tags.json");

// 去掉 Markdown 正文前部的空行，避免干扰标题推断。
const leadingBlankLinesPattern = /^\s*(?:\r?\n)+/;

const log = (message: string): void => console.log(`[prebuild] ${message}`);


const toDateString = (value: unknown, sourcePath: string): string => {
  // 将 front matter 中的 date 信息规整为 YYYY-MM-DD 字符串。
  if (value === undefined || value === null) {
    throw new Error(`${sourcePath} 中缺少 "date" 字段`);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const normalized = String(value).trim();
  if (!normalized) {
    throw new Error(`${sourcePath} 中缺少 "date" 字段`);
  }

  return normalized;
};

const collectTags = (...fields: unknown[]): string[] => {
  // 支持数组、逗号分隔字符串等写法，并自动去重。
  const tags = new Set<string>();

  const visit = (value: unknown): void => {
    if (value === undefined || value === null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }

    String(value)
      .split(/[,，]/)
      .map(token => token.trim())
      .filter(Boolean)
      .forEach(token => tags.add(token));
  };

  fields.forEach(visit);
  return [...tags];
};

const inferTitle = (candidate: unknown, body: string, fallback: string): string => {
  // 优先使用 front matter 中的 title，否则取正文首个非空行（或其 Markdown 标题）。
  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const headingMatch = /^#{1,6}\s*(.+)$/.exec(trimmed);
    return headingMatch ? headingMatch[1].trim() : trimmed;
  }

  return fallback;
};

const writeJson = async (filePath: string, data: unknown): Promise<void> => {
  // 输出带缩进的 JSON，便于手动检阅。
  const content = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(filePath, content, "utf8");
};

const main = async (): Promise<void> => {
  log("开始预构建 Markdown 文章");
  await fs.mkdir(PUBLIC_POSTS_DIR, { recursive: true });
  await fs.mkdir(DATA_DIR, { recursive: true });

  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  const markdownFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith(".md"));

  log(`发现 ${markdownFiles.length} 个 Markdown 文件`);

  const articles: ArticleMetadata[] = [];
  const tagSet = new Set<string>();

  for (const file of markdownFiles) {
    const uuid = file.name.replace(/\.md$/, "");
    const sourcePath = path.join(POSTS_DIR, file.name);
    const targetPath = path.join(PUBLIC_POSTS_DIR, file.name);

    const rawContent = await fs.readFile(sourcePath, "utf8");
    const parsed = loadFront(rawContent);

    const body = parsed.__content.replace(leadingBlankLinesPattern, "");
    const date = toDateString(parsed.date, sourcePath);
    const title = inferTitle(parsed.title, body, uuid);
    const tags = collectTags(parsed.tags, parsed.tag);
    tags.forEach(tag => tagSet.add(tag));

    await fs.writeFile(targetPath, `${body.trimEnd()}\n`, "utf8");
    articles.push({ uuid, title, date, tags });
  }

  articles.sort((a, b) => {
    const dateDiff = b.date.localeCompare(a.date);
    return dateDiff !== 0 ? dateDiff : a.uuid.localeCompare(b.uuid);
  });

  const sortedTags = [...tagSet].sort((a, b) => a.localeCompare(b));

  await writeJson(ARTICLES_INDEX_PATH, { articles });
  await writeJson(TAGS_INDEX_PATH, { tags: sortedTags });

  log(`已写入 ${articles.length} 条文章索引到 ${path.relative(ROOT_DIR, ARTICLES_INDEX_PATH)}`);
  log(`已写入 ${sortedTags.length} 个唯一标签到 ${path.relative(ROOT_DIR, TAGS_INDEX_PATH)}`);
  log("预构建完成");
};

main().catch(error => {
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  console.error(`[prebuild] 发生错误：${detail}`);
  process.exitCode = 1;
});
