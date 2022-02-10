import { getAllFilesFrontMatter } from '@/lib/mdx';
import siteMetadata from '@/data/siteMetadata';
import ListLayout from '@/layouts/ListLayout';
import { PageSEO } from '@/components/SEO';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { ComponentProps } from 'react';

export const POSTS_PER_PAGE = 6;

export const getStaticProps: GetStaticProps<{
  posts: ComponentProps<typeof ListLayout>['posts'];
}> = async () => {
  const posts = await getAllFilesFrontMatter('blog');
  return { props: { posts } };
};

export default function Blog({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={`Blog - ${siteMetadata.author}`} description={siteMetadata.description} />
      <ListLayout posts={posts} title="All Posts" />
    </>
  );
}
