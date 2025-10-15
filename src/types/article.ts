export interface ArticleMetadata {
  uuid: string;
  title: string;
  createdDate: string;
  updatedDate: string;
  tags: string[];
};

export interface Article {
  metadata: ArticleMetadata;
  content: string;
};
