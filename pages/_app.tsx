import { AppProps } from "next/app";
import Image from "next/image";

import "tailwindcss/tailwind.css";
import "../styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className='m-4 top-8 md:top-[35px] left-8 md:left-[120px]'>
        <a href='/'>
          <img src='/logo.png' className='w-8 sm:w-12' />
        </a>
      </div>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
