import Link from './Link';

interface ImageAttributionProps {
  text: string;
  url: string;
}

const ImageAttribution = ({ text, url }: ImageAttributionProps) => (
  <>
    <div className="text-center">
      <Link href={url}>{text}</Link>
    </div>
  </>
);

export default ImageAttribution;
