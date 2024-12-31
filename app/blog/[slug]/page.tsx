import fs from 'fs';
import PageTitle from '@/components/PageTitle';
import generateRss from '@/lib/generate-rss';
import { MDXLayoutRenderer } from '@/components/MDXComponents';
import { formatSlug, getAllFilesFrontMatter, getFileBySlug, getFiles } from '@/lib/mdx';
import { AuthorFrontMatter } from 'types/AuthorFrontMatter';
import { PostFrontMatter } from 'types/PostFrontMatter';
import { Toc } from 'types/Toc';
import { Metadata } from 'next';
import siteMetadata from '@/data/site-metadata';

const DEFAULT_LAYOUT = 'PostLayout';

export async function generateStaticParams() {
  const posts = getFiles('blog');
  return posts.map((p) => ({ slug: formatSlug(p) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const { frontMatter } = await getFileBySlug<PostFrontMatter>('blog', slug);

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
      canonical: `${siteMetadata.siteUrl}/blog/${slug}`,
    },
  };
}

async function getPost(slug: string): Promise<{
  post: { mdxSource: string; toc: Toc; frontMatter: PostFrontMatter };
  authorDetails: AuthorFrontMatter[];
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}> {
  const allPosts = await getAllFilesFrontMatter('blog');
  const postIndex = allPosts.findIndex((post) => formatSlug(post.slug) === slug);
  const prev: { slug: string; title: string } = allPosts[postIndex + 1] || null;
  const next: { slug: string; title: string } = allPosts[postIndex - 1] || null;
  const post = await getFileBySlug<PostFrontMatter>('blog', slug);
  const authorList = post.frontMatter.authors || ['default'];
  const authorPromise = authorList.map(async (author) => {
    const authorResults = await getFileBySlug<AuthorFrontMatter>('authors', [author]);
    return authorResults.frontMatter;
  });
  const authorDetails = await Promise.all(authorPromise);

  // rss
  if (allPosts.length > 0) {
    const rss = generateRss(allPosts);
    fs.writeFileSync('./public/feed.xml', rss);
  }

  return {
    post,
    authorDetails,
    prev,
    next,
  };
}

function generateJsonLd(frontmatter: PostFrontMatter) {
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
      '@id': `${siteMetadata.siteUrl}/blog/${frontmatter.slug}`,
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

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const { post, prev, next, authorDetails } = await getPost(slug);
  const { mdxSource, toc, frontMatter } = post;
  const jsonLd = generateJsonLd(frontMatter);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {'draft' in frontMatter && frontMatter.draft !== true ? (
        <MDXLayoutRenderer
          layout={frontMatter.layout || DEFAULT_LAYOUT}
          toc={toc}
          mdxSource={mdxSource}
          frontMatter={frontMatter}
          authorDetails={authorDetails}
          prev={prev}
          next={next}
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
