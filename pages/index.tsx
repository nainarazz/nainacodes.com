import BlogCard from '@/components/BlogCard';
import Hero from '@/components/Hero';
import Link from '@/components/Link';
import { PageSEO } from '@/components/SEO';
import siteMetadata from '@/data/siteMetadata';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { PostFrontMatter } from 'types/PostFrontMatter';

const MAX_DISPLAY = 6;

export const getStaticProps: GetStaticProps<{ posts: PostFrontMatter[] }> = async () => {
  const posts = await getAllFilesFrontMatter('blog');

  return { props: { posts } };
};

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <PageSEO title={siteMetadata.title} description={siteMetadata.description} />
      <Hero />
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:leading-10 md:text-4xl md:leading-14">
          Latest
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {!posts.length && 'No posts found.'}
        {posts.slice(0, MAX_DISPLAY).map((frontMatter) => {
          const { slug, date, title, summary, tags, images } = frontMatter;
          return (
            <BlogCard
              key={slug}
              title={title}
              description={summary}
              imgSrc={images ? images[0] : ''}
              href={`/blog/${slug}`}
              tags={tags}
              date={date}
            />
          );
        })}
      </div>
      {posts.length > MAX_DISPLAY && (
        <div className="mt-8 flex justify-end text-base font-medium leading-6">
          <Link
            href="/blog"
            className="text-xl text-primary-500 hover:text-primary-600 dark:hover:text-primary-400"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
    </>
  );
}
