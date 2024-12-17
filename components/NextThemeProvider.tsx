'use client';

import '@/css/tailwind.css';
import '@/css/prism.css';
import '@fontsource-variable/inter/index.css';

import { ThemeProvider } from 'next-themes';
import siteMetadata from '@/data/site-metadata';
import Analytics from '@/components/analytics';
import LayoutWrapper from '@/components/LayoutWrapper';
import { ClientReload } from '@/components/ClientReload';
import { ReactNode, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/gtag';

const isDevelopment = process.env.NODE_ENV === 'development';
const isSocket = process.env.SOCKET;

type NextThemeProviderProps = {
  children: ReactNode;
};

export default function NextThemeProvider({ children }: NextThemeProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    pageview(`${pathname}?${searchParams}`);
  }, [pathname, searchParams]);

  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <LayoutWrapper>{children}</LayoutWrapper>
    </ThemeProvider>
  );
}
