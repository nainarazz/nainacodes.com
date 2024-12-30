'use client';

import React, { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import Image from './Image';
import CustomLink from './Link';
import TOCInline from './TOCInline';
import Pre from './Pre';
import { BlogNewsletterForm } from './NewsletterForm';
import ImageAttribution from './ImageAttribution';
import { MDXComponents } from 'mdx/types';

const Wrapper: React.ComponentType<{ layout: string }> = ({ layout, ...rest }) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Layout = require(`../layouts/${layout}`).default;
  return <Layout {...rest} />;
};

export const mdxComponents: MDXComponents = {
  Image,
  TOCInline,
  ImageAttribution,
  a: CustomLink,
  pre: Pre,
  wrapper: Wrapper,
  BlogNewsletterForm,
};

interface Props {
  layout: string;
  mdxSource: string;
  [key: string]: unknown;
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }: Props) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);

  return <MDXLayout layout={layout} components={mdxComponents} {...rest} />;
};
