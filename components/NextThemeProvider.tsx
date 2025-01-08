'use client';

import '@/css/tailwind.css';
import '@/css/prism.css';
import '@fontsource-variable/inter/index.css';

import { ThemeProvider } from 'next-themes';
import siteMetadata from '@/data/site-metadata';
import Analytics from '@/components/analytics';
import LayoutWrapper from '@/components/LayoutWrapper';
import { ClientReload } from '@/components/ClientReload';
import { ReactNode } from 'react';

const isDevelopment = process.env.NODE_ENV === 'development';
const isSocket = process.env.SOCKET;

type NextThemeProviderProps = {
  children: ReactNode;
};

export default function NextThemeProvider({ children }: NextThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      {isDevelopment && isSocket && <ClientReload />}
      <Analytics />
      <LayoutWrapper>{children}</LayoutWrapper>
    </ThemeProvider>
  );
}
