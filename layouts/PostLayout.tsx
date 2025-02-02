import Link from '@/components/Link';
import PageTitle from '@/components/PageTitle';
import SectionContainer from '@/components/SectionContainer';
import Image from '@/components/Image';
import Tag from '@/components/Tag';
import siteMetadata from '@/data/site-metadata';
import Comments from '@/components/comments';
import ScrollTopAndComment from '@/components/ScrollTopAndComment';
import { ReactNode } from 'react';
import { PostFrontMatter } from 'types/PostFrontMatter';
import { AuthorFrontMatter } from 'types/AuthorFrontMatter';
import { Toc } from 'types/Toc';
import TOCInline from '@/components/TOCInline';
import ImageAttribution from '@/components/ImageAttribution';

const editUrl = (fileName) => `${siteMetadata.siteRepo}/blob/master/data/blog/${fileName}`;
const discussUrl = (slug) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(
    `${siteMetadata.siteUrl}/blog/${slug}`
  )}`;

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

interface Props {
  toc: Toc;
  frontMatter: PostFrontMatter;
  authorDetails: AuthorFrontMatter[];
  next?: {
    slug: string;
    title: string;
  };
  prev?: { slug: string; title: string };
  children: ReactNode;
}

export default function PostLayout({
  frontMatter,
  authorDetails,
  next,
  prev,
  children,
  toc,
}: Props) {
  const {
    slug,
    fileName,
    date,
    title,
    tags,
    images,
    coverImageAttributionText,
    coverImageAttributionUrl,
  } = frontMatter;

  return (
    <SectionContainer className="!mt-0">
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-y xl:divide-gray-200 xl:dark:divide-gray-700">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <div>
                <PageTitle>{title}</PageTitle>
                <div className="flex flex-row justify-center">
                  <div>
                    <div className="sr-only">Published on</div>
                    <div className="mb-2 text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
                      <time dateTime={date}>
                        {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                      </time>
                    </div>
                    {tags && (
                      <div className="flex flex-wrap justify-center">
                        {tags.map((tag) => (
                          <Tag key={tag} text={tag} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {images && images[0] ? (
            <div className="mx-auto w-full py-4 md:w-3/4">
              <Image src={images[0]} width="768" height="512" alt="avatar" className="rounded-md" />
              {coverImageAttributionText && coverImageAttributionUrl ? (
                <ImageAttribution text={coverImageAttributionText} url={coverImageAttributionUrl} />
              ) : null}
            </div>
          ) : null}

          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0"
            style={{ gridTemplateRows: 'auto 1fr' }}
          >
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pt-10 pb-8 dark:prose-dark">{children}</div>

              <dl className="pb-10 pt-10">
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="flex flex-row justify-start space-x-8 sm:space-x-12 ">
                    {authorDetails.map((author) => (
                      <li className="flex items-center space-x-2" key={author.name}>
                        {author.avatar && (
                          <Image
                            src={author.avatar}
                            width="38"
                            height="38"
                            alt="avatar"
                            className="h-10 w-10 rounded-full"
                          />
                        )}
                        <dl className="whitespace-nowrap font-medium leading-5">
                          <dt className="sr-only">Name</dt>
                          <dd className="text-gray-900 dark:text-gray-100">{author.name}</dd>
                          <dt className="sr-only">Twitter</dt>
                          <dd>
                            {author.twitter && (
                              <Link
                                href={author.twitter}
                                className="text-primary-500 hover:text-primary-600 dark:text-yellow-500 dark:hover:text-yellow-600"
                              >
                                {author.twitter.replace('https://twitter.com/', '@')}
                              </Link>
                            )}
                          </dd>
                        </dl>
                      </li>
                    ))}
                  </ul>
                </dd>
              </dl>

              <div className="pt-6 pb-6 text-gray-700 dark:text-gray-300">
                <Link href={discussUrl(slug)} rel="nofollow">
                  {'Discuss on Twitter'}
                </Link>
                <span className="mx-2">{` • `}</span>
                <Link href={editUrl(fileName)}>{'View on GitHub'}</Link>
              </div>
              <Comments frontMatter={frontMatter} />
              <footer>
                {(next || prev) && (
                  <div className="flex flex-col justify-between py-4 md:flex-row ">
                    {prev && (
                      <div className="mb-8 md:mb-0">
                        <h2 className=" mb-2 uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Previous Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:text-yellow-500 dark:hover:text-yellow-600">
                          <Link href={`/blog/${prev.slug}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && (
                      <div>
                        <h2 className=" mb-2 uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          Next Article
                        </h2>
                        <div className="text-primary-500 hover:text-primary-600 dark:text-yellow-500 dark:hover:text-yellow-600">
                          <Link href={`/blog/${next.slug}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </footer>
            </div>
            <div className="sticky top-12 hidden max-h-[500px] overflow-auto pt-4 xl:block xl:pt-8 ">
              <TOCInline toc={toc} asDisclosure />
            </div>
          </div>
        </div>
      </article>
    </SectionContainer>
  );
}
