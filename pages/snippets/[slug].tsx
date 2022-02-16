import fs from 'fs';
import PageTitle from '@/components/PageTitle';
import generateRss from '@/lib/generate-rss';
import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { PostFrontMatter } from 'types/PostFrontMatter';

const DEFAULT_LAYOUT = 'SnippetLayout';

export async function getStaticPaths() {
  const snippets = getFiles('snippets');

  return {
    paths: snippets.map((p) => ({
      params: {
        slug: formatSlug(p),
      },
    })),
    fallback: false,
  };
}

// @ts-ignore
export const getStaticProps: GetStaticProps<{
  snippet: { mdxSource: string; frontMatter: PostFrontMatter };
}> = async ({ params }) => {
  const slug = params.slug as string;
  const allSnippets = await getAllFilesFrontMatter('snippets');
  const snippet = await getFileBySlug<PostFrontMatter>('snippets', slug);

  // rss
  if (allSnippets.length > 0) {
    const rss = generateRss(allSnippets);
    fs.writeFileSync('./public/feed.xml', rss);
  }

  return {
    props: {
      snippet,
    },
  };
};

export default function SnippetDetail({ snippet }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { mdxSource, frontMatter } = snippet;

  return (
    <>
      {'draft' in frontMatter && frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={DEFAULT_LAYOUT}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
        />
      ) : (
        <div className="mt-24 text-center">
          <PageTitle>
            Under Construction{' '}
            <span role="img" aria-label="roadwork sign">
              🚧
            </span>
          </PageTitle>
        </div>
      )}
    </>
  );
}
