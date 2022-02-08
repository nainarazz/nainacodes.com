import { useEffect, useState } from 'react';
import { throttle } from 'lodash';

export function useDocumentScrollThrottled(
  callback: (params: { previousScrollTop: number; currentScrollTop: number }) => void
) {
  const [, setScrollPosition] = useState(0);
  let previousScrollTop = 0;

  function handleDocumentScroll() {
    // eslint-disable-next-line no-undef
    const { scrollTop: currentScrollTop } = document.documentElement || document.body;

    setScrollPosition((previousPosition) => {
      previousScrollTop = previousPosition;
      return currentScrollTop;
    });

    callback({ previousScrollTop, currentScrollTop });
  }

  const handleDocumentScrollThrottled = throttle(handleDocumentScroll, 250);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    window.addEventListener('scroll', handleDocumentScrollThrottled);

    // eslint-disable-next-line no-undef
    return () => window.removeEventListener('scroll', handleDocumentScrollThrottled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
