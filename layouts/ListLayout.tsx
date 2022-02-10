import { useState } from 'react';
import { PostFrontMatter } from 'types/PostFrontMatter';
import BlogCard from '@/components/BlogCard';
interface Props {
  posts: PostFrontMatter[];
  title: string;
}

const pageSize = 9;
export default function ListLayout({ posts, title }: Props) {
  const [displayPosts, setDisplayPosts] = useState(posts.slice(0, pageSize));
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [hasMore, setHasMore] = useState(posts.length > pageSize);

  function handleSearch(e) {
    const searchValue = e.target.value;
    const filtered = posts.filter((frontMatter) => {
      const searchContent = frontMatter.title + frontMatter.summary + frontMatter.tags.join(' ');
      return searchContent.toLowerCase().includes(searchValue.toLowerCase());
    });

    setHasMore(filtered.length - pageSize > 0);
    setFilteredPosts(filtered);
    setDisplayPosts(filtered.slice(0, pageSize));
  }

  function fetchNextPosts() {
    setTimeout(() => {
      const index = displayPosts.length;
      const fetchedPosts = filteredPosts.slice(index, index + pageSize);
      setHasMore(filteredPosts.length - (displayPosts.length + fetchedPosts.length) > 0);
      setDisplayPosts(displayPosts.concat(fetchedPosts));
    }, 100);
  }

  return (
    <>
      <div className="divide-y">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
          <span className="mt-2 text-sm italic">{filteredPosts.length} posts</span>

          <div className="relative max-w-lg">
            <input
              aria-label="Search articles"
              type="text"
              onChange={handleSearch}
              placeholder="Search articles"
              className="block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
            />
            <svg
              className="absolute right-3 top-3 h-5 w-5 text-gray-400 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 pt-6 md:grid-cols-2 xl:grid-cols-3">
          {!filteredPosts.length && 'No posts found.'}
          {displayPosts.map((frontMatter) => {
            const { slug, date, title, summary, tags, images } = frontMatter;
            return (
              <BlogCard
                key={slug}
                title={title}
                description={summary}
                imgSrc={images ? images[0] : ''}
                href={`/blog/${slug}`}
                tags={tags}
                date={date}
              />
            );
          })}
        </div>
      </div>
      {hasMore ? (
        <div className="mt-8 flex justify-center">
          <button
            className=" text-primary flex w-3/4 items-center justify-center space-x-5 whitespace-nowrap rounded-full border-2 px-11 py-6 font-bold hover:border-gray-600 md:w-1/4"
            onClick={fetchNextPosts}
          >
            Load more posts
          </button>
        </div>
      ) : null}
    </>
  );
}
