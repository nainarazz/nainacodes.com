'use client';

import siteMetadata from '@/data/site-metadata';
import headerNavLinks from '@/data/header-nav-links';
import Link from './Link';
import SectionContainer from './SectionContainer';
import Footer from './Footer';
import ThemeSwitch from './ThemeSwitch';
import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useDocumentScrollThrottled } from 'hooks/useDocumentScrollThrottled';
import { useEffect } from 'react';

interface Props {
  children: ReactNode;
}

const LayoutWrapper = ({ children }: Props) => {
  const pathname = usePathname();
  const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [shouldHideHeader, setShouldHideHeader] = useState(false);
  const [shouldShowShadow, setShouldShowShadow] = useState(false);

  const MINIMUM_SCROLL = 80;
  const TIMEOUT_DELAY = 200;

  useDocumentScrollThrottled((callbackData) => {
    const { previousScrollTop, currentScrollTop } = callbackData;
    const isScrolledDown = previousScrollTop < currentScrollTop;
    const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;

    setShouldShowShadow(currentScrollTop > 2);

    const id = setTimeout(() => {
      setShouldHideHeader(isScrolledDown && isMinimumScrolled);
    }, TIMEOUT_DELAY);
    setTimerId(id);
  });

  useEffect(
    () => () => {
      if (timerId) {
        clearInterval(timerId);
      }
    },
    [timerId]
  );

  return (
    <>
      <header
        className={`fixed z-10 w-full bg-white duration-150 dark:bg-gray-900 ${
          shouldHideHeader ? '-top-28' : 'top-0'
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
                    pathname?.includes(link.href)
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
