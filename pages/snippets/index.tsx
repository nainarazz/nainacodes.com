import siteMetadata from '@/data/site-metadata';
import { PageSEO } from '@/components/SEO';
import { GetStaticProps } from 'next';
import { SnippetFrontMatter } from 'types/SnippetFrontMatter';
import { getAllFilesFrontMatter } from '@/lib/mdx';
import SnippetCard from '@/components/SnippetCard';

export const getStaticProps: GetStaticProps<{
  snippets: SnippetFrontMatter[];
}> = async () => {
  const snippets = (await getAllFilesFrontMatter('snippets')) as SnippetFrontMatter[];
  return { props: { snippets } };
};

interface SnippetsProps {
  snippets: SnippetFrontMatter[];
}

export default function Snippets({ snippets }: SnippetsProps) {
  return (
    <>
      <PageSEO title={`Snippets - ${siteMetadata.author}`} description={siteMetadata.description} />
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
