/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const globbyModule = require('globby');
const matter = require('gray-matter');
const prettier = require('prettier');
const siteMetadata = require('../data/site-metadata');

const globby = globbyModule.globby;

(async () => {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js');
  const pages = await globby([
    'app/**/*.tsx',
    'data/blog/**/*.mdx',
    'data/blog/**/*.md',
    'public/tags/**/*.xml',
    '!app/layout.tsx',
    '!app/page.tsx',
    '!app/not-found.tsx',
    '!app/api',
  ]);

  // eslint-disable-next-line no-console
  console.log('pages', pages);
  const sitemap = `
        <?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${pages
              .map((page) => {
                // Exclude drafts from the sitemap
                if (page.search('.md') >= 1 && fs.existsSync(page)) {
                  const source = fs.readFileSync(page, 'utf8');
                  const fm = matter(source);
                  if (fm.data.draft) {
                    return;
                  }
                }

                if (page.indexOf(`[slug]`) > -1 || page.indexOf(`[tag]`) > -1) {
                  return;
                }

                const path = page
                  .replace('app/', '/')
                  .replace('/page.tsx', '')
                  .replace('data/blog', '/blog')
                  .replace('public/', '/')
                  .replace('.js', '')
                  .replace('.tsx', '')
                  .replace('.mdx', '')
                  .replace('.md', '')
                  .replace('/feed.xml', '');
                const route = path === '/index' ? '' : path;

                return `
                        <url>
                            <loc>${siteMetadata.siteUrl}${route}</loc>
                        </url>
                    `;
              })
              .join('')}
        </urlset>
    `;

  const formatted = await prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  });

  fs.writeFileSync('public/sitemap.xml', formatted);
})();
