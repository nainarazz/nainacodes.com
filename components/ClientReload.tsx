import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Client-side complement to next-remote-watch
 * Re-triggers getStaticProps when watched mdx files change
 *
 */
export const ClientReload = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Exclude socket.io from prod bundle
  useEffect(() => {
    import('socket.io-client').then((module) => {
      const socket = module.io();

      if (pathname) {
        socket.on('reload', () => {
          router.replace(pathname, {
            scroll: false,
          });
        });
      }
    });
  }, [pathname, router]);

  return null;
};
