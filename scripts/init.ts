import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import pkg from "yaml-front-matter";

interface FrontMatterBlock {
  __content: string;
}

const { loadFront } = pkg as { loadFront: (content: string) => FrontMatterBlock };

const ROOT_DIR = process.cwd();
const POSTS_DIR = path.join(ROOT_DIR, "posts");
const PUBLIC_POSTS_DIR = path.join(ROOT_DIR, "public", "posts");
const DATA_DIR = path.join(ROOT_DIR, "src", "data");
const ARTICLES_INDEX_PATH = path.join(DATA_DIR, "articles-index.json");
const TAGS_INDEX_PATH = path.join(DATA_DIR, "tags.json");

const ensureDir = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const ensureFile = (filePath: string, defaultValue: unknown): void => {
  if (!fs.existsSync(filePath)) {
    const normalized = `${JSON.stringify(defaultValue, null, 2)}\n`;
    fs.writeFileSync(filePath, normalized, "utf8");
  }
};

ensureDir(PUBLIC_POSTS_DIR);
ensureDir(DATA_DIR);
ensureFile(ARTICLES_INDEX_PATH, { articles: [] });
ensureFile(TAGS_INDEX_PATH, { tags: [] });

if (!fs.existsSync(POSTS_DIR)) {
  throw new Error(`${POSTS_DIR} 不存在，请先创建原始 Markdown 文章`);
}

const entries = fs.readdirSync(POSTS_DIR, { withFileTypes: true });

for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith(".md")) {
    continue;
  }

  const sourcePath = path.join(POSTS_DIR, entry.name);
  const targetPath = path.join(PUBLIC_POSTS_DIR, entry.name);

  const rawContent = fs.readFileSync(sourcePath, "utf8");
  const cleaned = loadFront(rawContent).__content.trim();

  fs.writeFileSync(targetPath, cleaned ? `${cleaned}\n` : "", "utf8");
}
