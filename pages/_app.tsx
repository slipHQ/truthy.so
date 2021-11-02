import { AppProps } from "next/app";
import Image from "next/image";

import "tailwindcss/tailwind.css";
import "../styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="absolute top-8 md:top-[35px] left-8 md:left-[120px]">
        <a href="/">
        <Image src="/logo.png" width={70} height={48} />
        </a>
      </div>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
