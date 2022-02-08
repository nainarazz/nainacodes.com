import siteMetadata from '@/data/siteMetadata';
import headerNavLinks from '@/data/headerNavLinks';
import Link from './Link';
import SectionContainer from './SectionContainer';
import Footer from './Footer';
import ThemeSwitch from './ThemeSwitch';
import { ReactNode } from 'react';
import { useRouter } from 'next/router';

interface Props {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: Props) => {
  const router = useRouter();
  return (
    <SectionContainer>
      <div className="flex h-screen flex-col justify-between">
        <header className="flex flex-col items-center justify-between py-10 md:flex-row">
          <div className="mb-4 md:mb-0">
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-between decoration-blue-700 hover:underline hover:decoration-wavy">
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="h-6 text-2xl font-semibold">{siteMetadata.headerTitle}</div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div>
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className={`p-4 font-medium text-gray-900 dark:text-gray-100 ${
                    router.asPath.includes(link.href)
                      ? 'underline decoration-blue-700 decoration-wavy underline-offset-4'
                      : ''
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
          </div>
        </header>
        <main className="mb-auto">{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  );
};

export default LayoutWrapper;
