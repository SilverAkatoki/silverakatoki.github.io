export interface ArticleMetadata {
  uuid: string;
  title: string;
  date: string;
  tags: string[];
};

export interface Article {
  metadata: ArticleMetadata;
  content: string;
};
