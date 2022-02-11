import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function SectionContainer({ children, className }: Props) {
  return (
    <div
      className={`mx-auto mt-28 max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0 ${
        className ? className : ''
      }`}
    >
      {children}
    </div>
  );
}
