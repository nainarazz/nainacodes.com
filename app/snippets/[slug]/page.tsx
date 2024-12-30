import fs from 'fs';
import PageTitle from '@/components/PageTitle';
import generateRss from '@/lib/generate-rss';
import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx';
import { Metadata } from 'next';
import { SnippetFrontMatter } from 'types/SnippetFrontMatter';
import siteMetadata from '@/data/site-metadata';

const DEFAULT_LAYOUT = 'SnippetLayout';

export async function generateStaticParams() {
  const snippets = getFiles('snippets');

  return snippets.map((p) => ({
    slug: formatSlug(p),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const { frontMatter } = await getFileBySlug<SnippetFrontMatter>('snippets', slug);

  const ogImage = frontMatter.images?.length
    ? `${siteMetadata.siteUrl}${frontMatter.images[0]}`
    : '';

  return {
    title: frontMatter.title,
    description: frontMatter.summary,
    twitter: {
      images: [ogImage],
      card: 'summary_large_image',
      site: siteMetadata.twitter,
      description: frontMatter.summary,
      title: frontMatter.title,
    },
    openGraph: {
      images: [ogImage],
      type: 'article',
      siteName: siteMetadata.title,
      description: frontMatter.summary,
      title: frontMatter.title,
    },
    alternates: {
      types: {
        'application/rss+xml': '/feed.xml',
      },
      canonical: `${siteMetadata.siteUrl}/snippets/${slug}`,
    },
  };
}

async function getSnippet(slug: string) {
  const allSnippets = await getAllFilesFrontMatter('snippets');
  const snippet = await getFileBySlug<SnippetFrontMatter>('snippets', slug);

  // rss
  if (allSnippets.length > 0) {
    const rss = generateRss(allSnippets);
    fs.writeFileSync('./public/feed.xml', rss);
  }

  return snippet;
}

function generateJsonLd(frontmatter: SnippetFrontMatter) {
  const images = frontmatter.images || [];

  const imagesArr =
    images.length === 0
      ? [siteMetadata.socialBanner]
      : typeof images === 'string'
        ? [images]
        : images;

  const featuredImages = imagesArr.map((img: string) => {
    return {
      '@type': 'ImageObject',
      url: `${siteMetadata.siteUrl}${img}`,
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteMetadata.siteUrl}/snippets/${frontmatter.slug}`,
    },
    headline: frontmatter.title,
    image: featuredImages,
    datePublished: new Date(frontmatter.date).toISOString(),
    dateModified: new Date(frontmatter.lastmod || frontmatter.date).toISOString(),
    author: {
      '@type': 'Person',
      name: siteMetadata.author,
      url: siteMetadata.linkedin,
    },
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.author,
      logo: {
        '@type': 'ImageObject',
        url: `${siteMetadata.siteUrl}${siteMetadata.siteLogo}`,
      },
    },
    description: frontmatter.summary,
  };
}

export default async function SnippetDetail({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const { mdxSource, frontMatter } = await getSnippet(slug);

  const jsonLd = generateJsonLd(frontMatter);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
