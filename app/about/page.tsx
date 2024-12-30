import { MDXLayoutRenderer } from '@/components/MDXComponents';
import siteMetadata from '@/data/site-metadata';
import { getFileBySlug } from '@/lib/mdx';
import { Metadata } from 'next';
import { AuthorFrontMatter } from 'types/AuthorFrontMatter';

const DEFAULT_LAYOUT = 'AuthorLayout';

export async function generateMetadata(): Promise<Metadata> {
  const authorDetails = await getFileBySlug<AuthorFrontMatter>('authors', ['default']);
  const { frontMatter } = authorDetails;
  const authorFrontMatter = frontMatter as unknown as AuthorFrontMatter;

  const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
  const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;

  return {
    title: `About - ${authorFrontMatter.name}`,
    description: `About me - ${authorFrontMatter.name}`,
    twitter: {
      images: [twImageUrl],
      card: 'summary_large_image',
      site: siteMetadata.twitter,
      description: siteMetadata.description,
      title: `About - ${authorFrontMatter.name}`,
    },
    openGraph: {
      images: [ogImageUrl],
      type: 'website',
      siteName: siteMetadata.title,
      description: siteMetadata.description,
      title: `About - ${authorFrontMatter.name}`,
    },
  };
}

async function getAuthorDetails(): Promise<{ mdxSource: string; frontMatter: AuthorFrontMatter }> {
  const authorDetails = await getFileBySlug<AuthorFrontMatter>('authors', 'default');
  const { mdxSource, frontMatter } = authorDetails;
  return { mdxSource, frontMatter: frontMatter as unknown as AuthorFrontMatter };
}

export default async function About() {
  const { mdxSource, frontMatter } = await getAuthorDetails();

  return (
    <MDXLayoutRenderer
      layout={frontMatter.layout || DEFAULT_LAYOUT}
      mdxSource={mdxSource}
      frontMatter={frontMatter}
    />
  );
}
