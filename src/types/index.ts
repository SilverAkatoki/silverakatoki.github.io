/** 上次更新的日期字符串（形如 YYYY-MM-DD）*/
export const lastUpdateDateStr = "2024-08-08";

/** 所有标签*/
export const archiveTags: ReadonlyArray<string> = [
  "Web", "C++", "C#", "Java", "Python", "数据结构", "TypeScript", "狼狐幻想奇谭",
  "furry", "Rust"
];

/** 无标签时的提示词*/
export const tagEmptyTip = "这里似乎没有任何标签";

/** 主页随机展示的句子*/
export const titleSentences: ReadonlyArray<string> = [
  "占位符",
  "null",
  "nullptr",
  "None",
  "undefine",
  "这里要写几句随机展示的话"
];

/** 文章信息类型*/
export interface ArchiveInfo {
    title: string;                  // 文章标题
    tags: readonly string[];    // 文章标签列表
    content: string;                // 文章简述
    dateStr: string;                // 文章发布 / 修改时的日期字符串（形如 YYYY-MM-DD）
    path: string;                   // 存储路径（相对于 archives 文件夹）
};

/** 文章信息*/
export const archiveData: readonly ArchiveInfo[] = [
  { title: "标题", tags: ["标签", "Web"], content: "描述", dateStr: "2024-08-08", path: "test.html" },
  { title: "很长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长长的标题", tags: ["标签 1", "标签 2"], content: "", dateStr: "", path: "" }
];

/** 总文章篇数*/
export const archiveCount: number = archiveData.length;

/* 前端项目类型*/
export interface ProjectInfo {
    name: string;                   // 项目名称
    content: string;                // 项目简述
    dateStr: string;                // 项目发布 / 修改时的日期字符串（形如 YYYY-MM-DD）
    path: string;                   // 存储路径（相对于 utils_page 文件夹）
};

/* 前端项目信息*/
export const projectData: ReadonlyArray<ProjectInfo> = [
  { name: "兽语翻译", content: "描述", dateStr: "2025-02-19", path: "furry_lang_trans" }
];
