import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const log = (message: string): void => console.log(`[clean] ${message}`);

const ROOT_DIR = process.cwd();

const DIST_DIR = path.join(ROOT_DIR, "dist");


await fs.rm(DIST_DIR, { recursive: true, force: true });

log("已清除 dist 构建成果");

const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const TEMP_POSTS_DIR = path.join(PUBLIC_DIR, "posts");

await fs.rm(TEMP_POSTS_DIR, { recursive: true, force: true });
await fs.mkdir(TEMP_POSTS_DIR, { recursive: true });

log("已清除 public/posts 中所有临时 md 文件");
