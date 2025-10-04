export interface ArticleMetadata {
  title: string;
  date: string;
  tags: string[];
}

export interface ArticleIndex extends ArticleMetadata {
  uuid: string;
}

export interface Footnote {
  label: string;
  index: number;
  content: string;
}

export interface RenderedFootnote extends Footnote {
  html: string;
}

export type ParsedFrontMatter = { __content?: string };
