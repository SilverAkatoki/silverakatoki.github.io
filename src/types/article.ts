export interface ArticleMetadata {
  uuid: string;
  title: string;
  createdDate: string;
  updatedDate: string;
  tags: string[];
  categories: string[];
};

export interface Article {
  metadata: ArticleMetadata;
  content: string;
};

export interface ArticleTocItem {
  id: string;
  level: number;
  text: string;
  children: ArticleTocItem[];
};
