import Link from '@/components/Link';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/site-metadata';
import { getAllTags } from '@/lib/tags';
import kebabCase from '@/lib/utils/kebabCase';
import { Metadata } from 'next';

const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;

export const metadata: Metadata = {
  title: `Tags - ${siteMetadata.title}`,
  description: 'Popular tags in JavaScript and frontend space',
  twitter: {
    images: [twImageUrl],
    card: 'summary_large_image',
    site: siteMetadata.twitter,
    description: 'Popular tags in JavaScript and frontend space',
    title: `Tags - ${siteMetadata.title}`,
  },
  openGraph: {
    images: [ogImageUrl],
    type: 'website',
    siteName: siteMetadata.title,
    description: 'Popular tags in JavaScript and frontend space',
    title: `Tags - ${siteMetadata.title}`,
  },
};

async function getTags(): Promise<Record<string, number>> {
  const tags = await getAllTags('blog');
  return tags;
}

export default async function Tags() {
  const tags = await getTags();
  const sortedTags = Object.keys(tags).sort((a, b) => tags[b] - tags[a]);

  return (
    <>
      <div className="flex flex-col items-start justify-start divide-y divide-gray-200 dark:divide-gray-700 md:mt-24 md:flex-row md:items-center md:justify-center md:space-x-6 md:divide-y-0">
        <div className="space-x-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:border-r-2 md:px-6 md:text-6xl md:leading-14">
            Tags
          </h1>
        </div>
        <div className="flex max-w-lg flex-wrap">
          {Object.keys(tags).length === 0 && 'No tags found.'}
          {sortedTags.map((t) => {
            return (
              <div key={t} className="mt-2 mb-2 mr-5">
                <Tag text={t} />
                <Link
                  href={`/tags/${kebabCase(t)}`}
                  className="-ml-2 text-sm font-semibold uppercase text-gray-600 dark:text-gray-300"
                >
                  {` (${tags[t]})`}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
