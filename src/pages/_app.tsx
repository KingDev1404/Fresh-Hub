import * as React from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import "../styles/global.css"; // Import Bootstrap and custom animations

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
}
