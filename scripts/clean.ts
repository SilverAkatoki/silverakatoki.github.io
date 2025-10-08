import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const log = (message: string): void => console.log(`[clean] ${message}`);

const ROOT_DIR = process.cwd();

const DIST_DIR = path.join(ROOT_DIR, "dist");

await fs.rm(DIST_DIR, { recursive: true, force: true });

log("已清除 dist 内容");
