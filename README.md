# 狼迹拾遗

银晓的静态博客框架，支持 GFM 和 $\LaTeX$ 公式。  
除了图片，因为想不到怎么实现（

## 字体 CDN 声明

注明原作是好习惯哦

- 思源宋体：<https://chinese-fonts-cdn.deno.dev/packages/syst/dist/SourceHanSerifCN/result.css>
- Maple Mono：<https://fontsapi.zeoseven.com/442/main/result.css>

## 部署教程

不会除了我还有人用吧......  
嘛，放在这里也可以避免自己忘了怎么传文章了。

### 包管理

记得先装好**pnpm**，强烈推荐！

```bash
npm i -g pnpm  # -g 是全局安装
```

### 内容配置

#### 文章上传

1. 在 `/posts/` 新增 Markdown 文件 _当然你可以从别的地方复制过来，我就是这样做的_，文件名建议与 Markdown 一级标题一致。
2. 每篇文章需包含 Front Matter，例如：

   ```markdown
   ---
   date: 2025-01-01
   tags: ["随笔", "技术"]
   ---

   # 正文标题

   这里是文章内容。
   ```

   其中，必填的 `dates` 字段请采用 `YYYY-MM-DD` 的形式编写。  
   `tags` 字段也是必填的，没有就留空 `tags: []` ，

3. 运行 `pnpm prebuild` 生成索引 json（`article-index.json` 和 `tags.json`）。  
   这一步可以省略，因为即使不生成也会在发布的时候自动生成。

#### 网站设置

更改位于`/src/data`下的`site-settings.json`文件，例如：

```json
{
  "siteInfo": {
    "titleSentences": ["标题下", "随机展示的", "句子"],
    "friendLink": [{ "name": "友链", "url": "https://your.friend.link/" }]
  },
  "prebuildSettings": {
    "articlePublishedStateDefault": false
  }
}
```

`articlePublishedStateDefault` 字段为在文章的 YAML front matter 中未含有 `published` 字段时的默认行为  
字段值为 `false` 时默认不导出

#### Readme 部分

在 `/src/view/Readme.vue` 组件内更改，方便自定义所以提了出来

### 使用 GitHub Pages（gh-pages 分支）部署

1. 确保已配置仓库的 `gh-pages` 分支及 GitHub Pages。
2. 运行：

   ```bash
   pnpm publish
   ```

   **Tip**: 这会清除所有在 `dist` 与 `public/posts` 中文件名已被更改成 uuid 的文章

3. 稍微等一下就能在 Github Pages 里看到了
