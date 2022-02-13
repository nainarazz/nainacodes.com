import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/site-metadata';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import ListLayout from '@/layouts/ListLayout';
import { POSTS_PER_PAGE } from '../../blog';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { PostFrontMatter } from 'types/PostFrontMatter';

export const getStaticPaths: GetStaticPaths<{ page: string }> = async () => {
  const totalPosts = await getAllFilesFrontMatter('blog');
  const totalPages = Math.ceil(totalPosts.length / POSTS_PER_PAGE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{
  posts: PostFrontMatter[];
}> = async () => {
  const posts = await getAllFilesFrontMatter('blog');

  return {
    props: {
      posts,
    },
  };
};

export default function PostPage({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <ListLayout posts={posts} title="All Posts" />
    </>
  );
}
