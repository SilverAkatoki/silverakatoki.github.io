# 狼迹拾遗

银晓的静态博客框架，支持 GFM 和 $\LaTeX$ 公式，还有图片。  

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

#### 文章要求

每篇文章需包含 Front Matter，例如：

```markdown
---
createdDate: 2025-09-27
updatedDate: 2025-11-12
published: true
tags: ["tag1", "tag2"]
category: "类别1"
---

# 正文标题

这里是文章内容。
```

- 必填的 `createdDate` **创建日期**与 `updatedDate` **修改日期**字段请采用 `YYYY-MM-DD` 的形式编写。  
- `tags` **标签**字段也是必填的，没有就留空 `tags: []`。  
- `category` **类型**字段可以选填，除去样例中的形式以外，也可以用形如 `tags` 字段那样的数组。  

  ```yml
  category: ["类别1", "类别2"]
  ```

  _但我用的单数做字段名，很显然是不希望这样做的，只是作为一个可选的功能_
- `published` **是否发布**字段选填，默认行为见下文。

---

如果有图片，图片需要被放在与文章同级的 `img` 文件夹内，  
这两者再被装入一个新的文件夹，例如：

```text
文件夹名（建议与 markdown 文件名一致）
├─ markdown文件.md
└─ img
   ├─ 你的图片.png
   └─ ...
```

确保顶层文件夹内只含有**一个** markdown 文件。

---

最终你的 markdown 文件 / 文件夹（含有图片时） 需要放在 `/posts/` 内 _当然你可以从别的地方复制过来，我就是这样做的_，markdown 文件名建议与 Markdown 一级标题一致。

#### 网站设置

更改位于`/src/data`下的`site-settings.json`文件，例如：

```json
{
  "siteInfo": {
    "header": "左上角标题",
    "title": "文章大字标题",
    "subTitle": "小标题",
    "bottomCopyRightName": "版权页面名字",
    "titleSentences": ["标题下", "随机展示的", "句子"],
    "friendLink": [{ "name": "友链", "url": "https://your.friend.link/" }]
  },
  "prebuildSettings": {
    "articlePublishedStateDefault": false
  }
}
```

`articlePublishedStateDefault` 字段为在文章的 YAML front matter 中未含有 `published` 字段时的默认行为。  
字段值为 `false` 时默认不导出。

#### Readme 部分

在 `/src/view/Readme.vue` 组件内更改，方便自定义所以提了出来。

### 使用 GitHub Pages（gh-pages 分支）部署

1. 确保已配置仓库的 `gh-pages` 分支及 GitHub Pages。
2. 运行：

   ```bash
   pnpm launch
   ```

   **Tip**: 这会清除所有 `dist` 与 `public/posts` 的所有文件，请确保你的重要文件没放在里面

3. 稍微等一下就能在 Github Pages 里看到了
