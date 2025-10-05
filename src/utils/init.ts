import * as fs from "fs";

import * as yamlFront from "yaml-front-matter";

// 生成 articles-index.json
// 生成 tags.json
// 删去 YAML front matter 后把 md 文件复制到 public/posts 目录下

const postsDir = "public/posts";
const articlesIndexPath = "public/articles-index.json";
const tagsPath = "public/tags.json";

if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir);
}
if (!fs.existsSync(articlesIndexPath)) {
  fs.writeFileSync(articlesIndexPath, "[]");
}
if (!fs.existsSync(tagsPath)) {
  fs.writeFileSync(tagsPath, "{}");
};

for (const fileName of fs.readdirSync("posts")) {
  if (!fileName.endsWith(".md")) {
    continue;
  }
  const srcPath = `posts/${fileName}`;
  const fullContent = fs.readFileSync(srcPath, "utf-8");
  const destPath = `${postsDir}/${fileName}`;
  const contentWithoutYAML = yamlFront.loadFront(fullContent).__content;
  fs.writeFileSync(destPath, contentWithoutYAML);
}

