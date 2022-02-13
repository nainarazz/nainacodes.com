import siteMetadata from '@/data/site-metadata';
import headerNavLinks from '@/data/header-nav-links';
import Link from './Link';
import SectionContainer from './SectionContainer';
import Footer from './Footer';
import ThemeSwitch from './ThemeSwitch';
import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import { useDocumentScrollThrottled } from 'hooks/useDocumentScrollThrottled';
import { useEffect } from 'react';

interface Props {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: Props) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timer: any;
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const [shouldShowShadow, setShouldShowShadow] = useState(false);

  const MINIMUM_SCROLL = 80;
  const TIMEOUT_DELAY = 200;

  useDocumentScrollThrottled((callbackData) => {
    const { previousScrollTop, currentScrollTop } = callbackData;
    const isScrolledDown = previousScrollTop < currentScrollTop;
    const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;

    setShouldShowShadow(currentScrollTop > 2);

    timer = setTimeout(() => {
      setShouldHideHeader(isScrolledDown && isMinimumScrolled);
    }, TIMEOUT_DELAY);
  });

  useEffect(() => () => clearTimeout(timer));

  return (
    <>
      <header
        className={`fixed top-0 z-10 w-full bg-white duration-150 dark:bg-gray-900 ${
          shouldHideHeader ? '-top-28' : ''
        } ${shouldShowShadow ? 'shadow-md' : ''}`}
      >
        <div className="mx-auto flex max-w-3xl flex-col  items-center justify-between py-6 md:flex-row xl:max-w-5xl">
          <div className=" mb-4  md:mb-0 ">
            <Link href="/" aria-label={siteMetadata.headerTitle}>
              <div className="flex items-center justify-between decoration-blue-700 hover:underline hover:decoration-wavy dark:decoration-yellow-500">
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
                  className={`p-4 font-medium text-gray-900 decoration-blue-700 hover:underline hover:decoration-wavy dark:text-gray-100 dark:decoration-yellow-500 ${
                    router.asPath.includes(link.href)
                      ? 'underline  decoration-wavy underline-offset-4 '
                      : ''
                  }`}
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
          </div>
        </div>
      </header>
      <SectionContainer>
        <div className="flex h-screen flex-col justify-between">
          <main className="mb-auto">{children}</main>
          <Footer />
        </div>
      </SectionContainer>
    </>
  );
};

export default LayoutWrapper;
