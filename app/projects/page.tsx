import projectsData from '@/data/projects-data';
import Card from '@/components/Card';
import siteMetadata from '@/data/site-metadata';
import { Metadata } from 'next';

const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;

export const metadata: Metadata = {
  title: `Projects - ${siteMetadata.author}`,
  description: siteMetadata.description,
  twitter: {
    images: [twImageUrl],
    card: 'summary_large_image',
    site: siteMetadata.twitter,
    description: siteMetadata.description,
    title: `Projects - ${siteMetadata.author}`,
  },
  openGraph: {
    images: [ogImageUrl],
    type: 'website',
    siteName: siteMetadata.title,
    description: siteMetadata.description,
    title: `Projects - ${siteMetadata.author}`,
  },
};

export default function Projects() {
  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Projects
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            Showcase your projects with a hero image (16 x 9)
          </p>
        </div>
        <div className="container py-12">
          <div className="-m-4 flex flex-wrap">
            {projectsData.map((d) => (
              <Card
                key={d.title}
                title={d.title}
                description={d.description}
                imgSrc={d.imgSrc}
                href={d.href}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
