import siteMetadata from '@/data/site-metadata';
import { Metadata } from 'next';
import { SnippetFrontMatter } from 'types/SnippetFrontMatter';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import SnippetCard from '@/components/SnippetCard';

const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;

export const metadata: Metadata = {
  title: `Snippets - ${siteMetadata.author}`,
  description: siteMetadata.description,
  twitter: {
    images: [twImageUrl],
    card: 'summary_large_image',
    site: siteMetadata.twitter,
    description: siteMetadata.description,
    title: `Snippets - ${siteMetadata.author}`,
  },
  openGraph: {
    images: [ogImageUrl],
    type: 'website',
    siteName: siteMetadata.title,
    description: siteMetadata.description,
    title: `Snippets - ${siteMetadata.author}`,
  },
};

async function getSnippets() {
  const snippets = (await getAllFilesFrontMatter('snippets')) as SnippetFrontMatter[];
  return snippets;
}

export default async function Snippets() {
  const snippets = await getSnippets();

  return (
    <>
      <h1 className="text-xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-4xl md:leading-14">
        Code Snippets
      </h1>
      <div className="grid grid-cols-1 gap-8 pt-6 md:grid-cols-2 xl:grid-cols-3">
        {snippets.map((s, index) => (
          <SnippetCard
            key={index}
            title={s.title}
            description={s.summary}
            href={`/snippets/${s.slug}`}
            iconUrl={s.images ? s.images[0] : ''}
          />
        ))}
      </div>
    </>
  );
}
