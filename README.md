# Read Wolf

## 项目简介

Read Wolf 是一个基于 Vue 3 + TypeScript + Vite 构建的静态博客站点。仓库内置 Markdown 文章预处理脚本，能够从 `posts/` 目录生成公开可访问的文章与标签索引，配合前端页面实现文章浏览、代码高亮、数学公式渲染以及多语言支持。

## 内容管理

### 文章上传

1. 在 `posts/` 新增 Markdown 文件，文件名建议与 Markdown 一级标题一致。
2. 每篇文章需包含 Front Matter，例如：

   ```markdown
   ---
   date: 2025-01-01
   tags: ["随笔", "技术"]
   ---

   # 正文标题

   这里是文章内容。
   ```

   其中，`dates` 字段请采用`YYYY-MM-DD`的形式编写，tags 规则如上。

3. 运行 `pnpm prebuild` 生成索引 json（`article-index.json` 和 `tags.json`）。

### 网站设置

更改位于`src\data`下的`site-settings.json`文件，例如：

```json
{
  "siteInfo": {
    "readme": "自我介绍",
    "titleSentences": ["标题下", "随机展示的", "句子"],
    "friendLink": [{ "name": "友链", "url": "https://your.friend.link/" }]
  }
}
```

## 部署指南 GitHub Pages（gh-pages 分支）

1. 确保已配置仓库的 `gh-pages` 分支及 GitHub Pages。
2. 运行：

   ```bash
   pnpm publish
   ```

   该命令会完成类型检查、打包，并将 `dist/` 推送至 `gh-pages` 分支。

## 目录结构

```
read-wolf/
├─ posts/                 # 原始 Markdown 文章
├─ public/
│  ├─ posts/              # 预构建生成的公开文章
│  └─ vite.svg
├─ scripts/prebuild.ts    # 文章索引生成脚本
├─ src/                   # 前端源代码
├─ dist/                  # 生产构建产物（执行 build 后生成）
└─ package.json
```
