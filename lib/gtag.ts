'use client';

import siteMetadata from '@/data/site-metadata';

const isProduction = process.env.NODE_ENV === 'production';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (isProduction && window) {
    if (typeof window.gtag === 'function') {
      window.gtag('config', siteMetadata.analytics.googleAnalyticsId, {
        page_path: url,
      });
    }
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
