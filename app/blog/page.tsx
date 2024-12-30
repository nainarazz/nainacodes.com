import { getAllFilesFrontMatter } from '@/lib/mdx';
import siteMetadata from '@/data/site-metadata';
import ListLayout from '@/layouts/ListLayout';
import { Metadata } from 'next';
import { PostFrontMatter } from 'types/PostFrontMatter';

export const POSTS_PER_PAGE = 6;

const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;

export const metadata: Metadata = {
  title: `Blog - ${siteMetadata.author}`,
  description: siteMetadata.description,
  twitter: {
    images: [twImageUrl],
    card: 'summary_large_image',
    site: siteMetadata.twitter,
    description: siteMetadata.description,
    title: `Blog - ${siteMetadata.author}`,
  },
  openGraph: {
    images: [ogImageUrl],
    type: 'website',
    siteName: siteMetadata.title,
    description: siteMetadata.description,
    title: `Blog - ${siteMetadata.author}`,
  },
};

async function getPosts(): Promise<PostFrontMatter[]> {
  const posts = await getAllFilesFrontMatter('blog');
  return posts;
}

export default async function Blog() {
  const posts = await getPosts();
  return <ListLayout posts={posts} title="All Posts" />;
}
