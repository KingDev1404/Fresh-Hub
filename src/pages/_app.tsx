import * as React from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div>
        <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
}
