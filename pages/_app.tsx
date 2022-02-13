import '@/css/tailwind.css';
import '@/css/prism.css';
import '@fontsource/inter/variable-full.css';

import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import siteMetadata from '@/data/site-metadata';
import Analytics from '@/components/analytics';
import LayoutWrapper from '@/components/LayoutWrapper';
import { ClientReload } from '@/components/ClientReload';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { pageview } from '@/lib/gtag';

const isDevelopment = process.env.NODE_ENV === 'development';
const isSocket = process.env.SOCKET;

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  );
}
