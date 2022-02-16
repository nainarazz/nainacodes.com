export type PostFrontMatter = {
  title: string;
  date: string;
  tags: string[];
  lastmod?: string;
  draft?: boolean;
  summary?: string;
  images?: string[];
  coverImageAttributionText?: string;
  coverImageAttributionUrl?: string;
  authors?: string[];
  layout?: string;
  slug: string;
  fileName: string;
};
