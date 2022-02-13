import Image from './Image';
import Link from './Link';

const SnippetCard = ({ title, description, iconUrl, href }) => (
  <div className="border-[1px] border-gray-300 p-2">
    <Link href={href} aria-label={`Link to ${title}`}>
      <span style={{ maxWidth: '544px' }}>
        {iconUrl && (
          <Image
            alt={title}
            src={iconUrl}
            className="rounded-full object-cover object-center "
            width={32}
            height={32}
          />
        )}
        <h3 className="mb-3 text-2xl font-bold leading-8 tracking-tight">{title}</h3>
        <p className="prose mb-3 max-w-none text-gray-500 dark:text-gray-400">{description}</p>
      </span>
    </Link>
  </div>
);

export default SnippetCard;
