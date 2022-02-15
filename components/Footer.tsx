import Link from './Link';
import siteMetadata from '@/data/site-metadata';
import NowPlaying from './NowPlaying';

export default function Footer() {
  return (
    <footer className="mx-auto my-8 flex w-full  flex-col items-start justify-center">
      <hr className="border-1 mb-8 w-full border-gray-200 dark:border-gray-800" />
      <NowPlaying />
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 pb-8 sm:grid-cols-3">
        <div className="flex flex-col space-y-4">
          <Link href="/" className="text-gray-600">
            Home
          </Link>
          <Link href="/about" className="text-gray-600">
            About
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href={siteMetadata.twitter} className="text-gray-600">
            Twitter
          </Link>
          <Link href={siteMetadata.linkedin} className="text-gray-600">
            LinkedIn
          </Link>
          <Link href={siteMetadata.github} className="text-gray-600">
            Github
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/snippets" className="text-gray-600">
            Snippets
          </Link>
          <Link href="/tags" className="text-gray-600">
            Tags
          </Link>
        </div>
      </div>
      <div className="mb-2 flex space-x-2 text-gray-500 dark:text-gray-400">
        <div>{siteMetadata.author}</div>
        <div>{`© ${new Date().getFullYear()}`}</div>
        <Link href="/">{siteMetadata.title}</Link>
      </div>
    </footer>
  );
}
