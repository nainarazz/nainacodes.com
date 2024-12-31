import NextThemeProvider from '@/components/NextThemeProvider';
import siteMetadata from '@/data/site-metadata';
import { Metadata, Viewport } from 'next';
import { Suspense } from 'react';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1D4ED8',
};

const ogImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;
const twImageUrl = siteMetadata.siteUrl + siteMetadata.socialBanner;

export const metadata: Metadata = {
  manifest: '/static/favicons/site.webmanifest',
  twitter: {
    images: [twImageUrl],
    card: 'summary_large_image',
    site: siteMetadata.twitter,
    description: siteMetadata.description,
    title: `Naina Codes`,
  },
  openGraph: {
    images: [ogImageUrl],
    type: 'website',
    siteName: siteMetadata.title,
    description: siteMetadata.description,
    title: `Naina Codes`,
  },
  icons: {
    icon: [
      { url: '/static/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/static/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      {
        url: '/static/favicons/apple-touch-icon.png',
        sizes: '76x76',
      },
    ],
    other: {
      rel: 'mask-icon',
      url: '/static/favicons/safari-pinned-tab.svg',
      color: '#5bbad5',
    },
  },
  other: {
    'msapplication-TileColor': '#5bbad5',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  robots: 'follow, index',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-white text-black antialiased dark:bg-gray-900 dark:text-white">
        <Suspense>
          <NextThemeProvider>{children}</NextThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
