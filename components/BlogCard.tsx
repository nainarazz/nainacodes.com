import formatDate from '@/lib/utils/formatDate';
import Image from './Image';
import Link from './Link';

const BlogCard = ({ title, description, imgSrc, href, tags, date }) => (
  <Link href={href} aria-label={`Link to ${title}`}>
    <div className="md" style={{ maxWidth: '544px' }}>
      <div className={`${imgSrc && 'h-full'}  overflow-hidden rounded-md  dark:border-gray-700`}>
        {imgSrc && (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        )}
        <div>
          <h2 className="mb-3 text-2xl font-bold leading-8 tracking-tight">{title}</h2>
          <div className="mb-1 text-sm font-medium leading-6 text-gray-500 dark:text-gray-400">
            <time dateTime={date}>{formatDate(date)}</time>
          </div>
          <div className="mb-2 flex flex-wrap">
            {tags.map((tag) => (
              <div
                key={tag}
                className=" mr-3 text-sm font-medium uppercase text-primary-500 dark:hover:text-primary-400"
              >
                {tag}
              </div>
            ))}
          </div>

          <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  </Link>
);

export default BlogCard;
