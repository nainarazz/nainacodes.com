import Script from 'next/script';

const GAScript = () => {
  return (
    <>
      <Script
        strategy="lazyOnload"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-L0TYB55BVV"
      />

      <Script strategy="lazyOnload" id="ga-script">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-L0TYB55BVV');
        `}
      </Script>
    </>
  );
};

export default GAScript;
