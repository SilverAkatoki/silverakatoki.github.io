import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pkg from "yaml-front-matter";
const { loadFront } = pkg;

type FrontMatter = {
  title?: unknown;
  date?: unknown;
  tags?: unknown;
  tag?: unknown;
};

type ArticleIndexEntry = {
  uuid: string;
  title: string;
  date: string;
  tags: string[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const POSTS_DIR = path.join(ROOT_DIR, "posts");
const PUBLIC_POSTS_DIR = path.join(ROOT_DIR, "public", "posts");
const ARTICLES_INDEX_PATH = path.join(ROOT_DIR, "src", "articles-index.json");
const TAGS_INDEX_PATH = path.join(ROOT_DIR, "src", "tags.json");

const leadingBlankLinesPattern = /^\s*(?:\r?\n)+/;

const ensureDir = async (dir: string): Promise<void> => {
  await fs.mkdir(dir, { recursive: true });
};

const normaliseDate = (value: unknown, source: string): string => {
  if (value === undefined || value === null) {
    throw new Error(`Missing required "date" field in ${source}`);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const stringValue = String(value).trim();
  if (!stringValue) {
    throw new Error(`Empty "date" field in ${source}`);
  }

  return stringValue;
};

const addRawTag = (raw: unknown, target: Set<string>): void => {
  if (raw === undefined || raw === null) {
    return;
  }

  if (Array.isArray(raw)) {
    raw.forEach(item => addRawTag(item, target));
    return;
  }

  const text = String(raw);
  text
    .split(/[,，]/)
    .map(token => token.trim())
    .filter(Boolean)
    .forEach(token => target.add(token));
};

const collectTags = (frontMatter: FrontMatter): string[] => {
  const tags = new Set<string>();
  addRawTag(frontMatter.tags, tags);
  addRawTag(frontMatter.tag, tags);
  return Array.from(tags);
};

const extractFirstHeading = (content: string): string | null => {
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const headingMatch = /^#{1,6}\s+(.*)$/.exec(trimmed);
    if (headingMatch) {
      return headingMatch[1].trim();
    }

    return trimmed;
  }

  return null;
};

const resolveTitle = (candidate: unknown, body: string, fallback: string): string => {
  if (typeof candidate === "string") {
    const trimmed = candidate.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  const inferred = extractFirstHeading(body);
  return inferred ?? fallback;
};

const sortArticles = (articles: ArticleIndexEntry[]): ArticleIndexEntry[] => {
  return [...articles].sort((a, b) => {
    const dateDiff = b.date.localeCompare(a.date);
    if (dateDiff !== 0) {
      return dateDiff;
    }
    return a.uuid.localeCompare(b.uuid);
  });
};

const sortTags = (tags: Set<string>): string[] => {
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
};

const formatJson = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;

const main = async (): Promise<void> => {
  await ensureDir(PUBLIC_POSTS_DIR);

  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });

  const articles: ArticleIndexEntry[] = [];
  const tagSet = new Set<string>();

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const uuid = entry.name.replace(/\.md$/, "");
    const sourcePath = path.join(POSTS_DIR, entry.name);
    const targetPath = path.join(PUBLIC_POSTS_DIR, entry.name);

    const rawContent = await fs.readFile(sourcePath, "utf8");
    const parsed = loadFront(rawContent) as FrontMatter & { __content: string };

    const { __content: body, ...frontMatter } = parsed;

    const articleBody = body.replace(leadingBlankLinesPattern, "");
    const tags = collectTags(frontMatter);
    tags.forEach(tag => tagSet.add(tag));

    const date = normaliseDate(frontMatter.date, sourcePath);
    const title = resolveTitle(frontMatter.title, articleBody, uuid);

    const contentForPublic = `${articleBody.trimEnd()}\n`;
    await fs.writeFile(targetPath, contentForPublic, "utf8");

    articles.push({ uuid, title, date, tags });
  }

  const sortedArticles = sortArticles(articles);
  const sortedTags = sortTags(tagSet);

  await fs.writeFile(ARTICLES_INDEX_PATH, formatJson({ articles: sortedArticles }), "utf8");
  await fs.writeFile(TAGS_INDEX_PATH, formatJson({ tags: sortedTags }), "utf8");
};

main().catch(error => {
  console.error(error);
});
