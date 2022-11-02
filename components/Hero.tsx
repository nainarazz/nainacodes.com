import Link from './Link';
import Image from '@/components/Image';

export default function Hero() {
  return (
    <div className="mt-2 flex flex-col-reverse items-center sm:flex-row md:items-start">
      <div className="flex w-full flex-col text-center md:w-3/4 md:pr-8 md:text-left">
        <h1 className="mb-1 text-3xl font-bold tracking-tight text-black dark:text-white md:text-4xl">
          Hey, I'm{' '}
          <Link
            href="/about"
            aria-label="name is Naina"
            className="text-blue-700 decoration-blue-700 hover:underline dark:text-yellow-500 dark:decoration-yellow-500"
          >
            Naina{' '}
          </Link>
          <span className="wave" role="img" aria-label="Hello">
            👋
          </span>
        </h1>
        <h2 className="mb-4 text-xl text-gray-600 dark:text-gray-200">
          Frontend developer at <span className="font-semibold">Providus</span>{' '}
        </h2>
        <p className="mb-12 text-2xl text-gray-600 dark:text-gray-400">
          I build stuff for the web. Welcome to my digital space online.
        </p>
      </div>
      <div>
        <Image
          src="/static/images/avatar.png"
          alt="avatar"
          width="120"
          height="120px"
          className="h-48 w-48 rounded-full"
        />
      </div>
    </div>
  );
}
