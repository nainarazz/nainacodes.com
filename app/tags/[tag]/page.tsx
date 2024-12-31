import siteMetadata from '@/data/site-metadata';
import ListLayout from '@/layouts/ListLayout';
import generateRss from '@/lib/generate-rss';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import { getAllTags } from '@/lib/tags';
import kebabCase from '@/lib/utils/kebabCase';
import fs from 'fs';
import { Metadata } from 'next';
import path from 'path';
import { PostFrontMatter } from 'types/PostFrontMatter';

const root = process.cwd();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const tag = (await params).tag;

  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;

  return {
    title: `${tag} - ${siteMetadata.title}`,
    description: `${tag} tags - ${siteMetadata.author}`,
    twitter: {
      images: [twImageUrl],
      card: 'summary_large_image',
      site: siteMetadata.twitter,
      description: 'Popular tags in JavaScript and frontend space',
      title: `${tag} tags - ${siteMetadata.author}`,
    },
    openGraph: {
      images: [ogImageUrl],
      type: 'website',
      siteName: siteMetadata.title,
      description: 'Popular tags in JavaScript and frontend space',
      title: `${tag} tags - ${siteMetadata.author}`,
    },
  };
}

export async function generateStaticParams() {
  const tags = await getAllTags('blog');
  return Object.keys(tags).map((tag) => ({ tag }));
}

async function getPostsForTag(tag: string): Promise<PostFrontMatter[]> {
  const allPosts = await getAllFilesFrontMatter('blog');
  const filteredPosts = allPosts.filter(
    (post) => post.draft !== true && post.tags.map((t) => kebabCase(t)).includes(tag)
  );

  // rss
  if (filteredPosts.length > 0) {
    const rss = generateRss(filteredPosts, `tags/${tag}/feed.xml`);
    const rssPath = path.join(root, 'public', 'tags', tag);
    fs.mkdirSync(rssPath, { recursive: true });
    fs.writeFileSync(path.join(rssPath, 'feed.xml'), rss);
  }

  return filteredPosts;
}

export default async function Tag({ params }: { params: Promise<{ tag: string }> }) {
  const tag = (await params).tag;
  const posts = await getPostsForTag(tag);

  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1);

  return <ListLayout posts={posts} title={title} />;
}
