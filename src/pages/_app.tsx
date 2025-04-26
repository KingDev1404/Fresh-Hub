import * as React from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import "../styles/global.css"; // Import Bootstrap and custom animations
import { CartProvider } from "@/contexts/CartContext";

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <CartProvider>
        <div>
          <main>
            <Component {...pageProps} />
          </main>
        </div>
      </CartProvider>
    </SessionProvider>
  );
}
