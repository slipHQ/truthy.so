import { AppProps } from "next/app";
import Head from "next/head";

import "tailwindcss/tailwind.css";
import { useFathom } from "../hooks/use-fathom";
import "../styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  useFathom("UKFLVOQJ", { includedDomains: ["truthy.so", "www.truthy.so"] });
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#333333" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#333333" />
      </Head>
      <div className="m-4 top-8 md:top-[35px] left-8 md:left-[120px]">
        <a href="/">
          <img src="/logo.png" className="w-8 sm:w-12" />
        </a>
      </div>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
