export interface ArticleMetadata {
  uuid: string;
  title: string;
  date: string;
  tags: string[];
};

export type Article = {
  metadata: ArticleMetadata;
  content: string;
};
