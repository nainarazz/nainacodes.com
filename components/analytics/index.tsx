'use client';
import GA from './GoogleAnalytics';
import siteMetadata from '@/data/site-metadata';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

const isProduction = process.env.NODE_ENV === 'production';

const Analytics = () => {
  return <>{isProduction && siteMetadata.analytics.googleAnalyticsId && <GA />}</>;
};

export default Analytics;
