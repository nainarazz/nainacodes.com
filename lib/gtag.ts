import siteMetadata from '@/data/site-metadata';

const isProduction = process.env.NODE_ENV === 'production';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  if (isProduction) {
    window.gtag('config', siteMetadata.analytics.googleAnalyticsId, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
