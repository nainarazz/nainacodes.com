import Script from 'next/script';

const GAScript = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-L0TYB55BVV"
      />

      <Script strategy="afterInteractive" id="ga-script">
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
