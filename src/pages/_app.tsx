import * as React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Component {...pageProps} />
      </main>
    </div>
  );
}
