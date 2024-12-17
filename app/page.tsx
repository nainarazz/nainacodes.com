import BlogCard from '@/components/BlogCard';
import Hero from '@/components/Hero';
import Image from '@/components/Image';
import Link from '@/components/Link';
import siteMetadata from '@/data/site-metadata';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import { getTopShowEpisodes } from '@/lib/spotify';
import formatDate from '@/lib/utils/formatDate';
import { Metadata } from 'next';
import { Show } from 'types/Spotify';

export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
};

async function getSyntaxEpisodes() {
  const SYNTAX_FM_SHOW_ID = '4kYCRYJ3yK5DQbP5tbfZby';
  const response = await getTopShowEpisodes(SYNTAX_FM_SHOW_ID);

  if (response.status === 204 || response.status > 400) {
    return [];
  }

  const show = await response.json();

  if (!show.items) {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: Show[] = show.items.map((i: any) => ({
    id: i.id,
    title: i.name,
    date: i.release_date,
    image: i.images[0] ? i.images[0].url : '',
    url: i.external_urls?.spotify || '',
  }));

  return items;
}

const MAX_DISPLAY = 6;

export default async function HomePage() {
  const posts = await getAllFilesFrontMatter('blog');
  const episodes = await getSyntaxEpisodes();

  return (
    <>
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
            className="text-xl text-primary-500 hover:text-primary-600 dark:text-yellow-500 dark:hover:text-yellow-600"
            aria-label="all posts"
          >
            All Posts &rarr;
          </Link>
        </div>
      )}
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:leading-10 md:text-4xl md:leading-14">
          Syntax FM Episodes
        </h1>
        <span className="italic">my favorite web dev podcast</span>
      </div>
      {episodes?.map((e) => (
        <div key={e.id} className="mb-4 flex flex-row items-start md:flex-row md:items-center">
          <div className="w-1/4 md:w-10">
            <Image
              alt={e.title}
              src="/static/syntax-fm.jpg"
              className="w-16 object-cover object-center"
              width={60}
              height={60}
            />
          </div>
          <div className="flex w-3/4 flex-col md:w-full md:flex-row">
            <div className="md:mx-4">{formatDate(e.date)}</div>
            <div className="font-bold md:mx-4">
              <Link href={e.url}>{e.title}</Link>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
