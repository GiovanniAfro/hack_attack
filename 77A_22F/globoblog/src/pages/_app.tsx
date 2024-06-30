import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import "~/styles/leaflet.css";

import Head from "next/head";
import { ThemeProvider } from "next-themes";
import { Layout } from '~/components/Layout';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <SessionProvider session={session}>
        <Head>
          <title>42 Hackathon</title>
          <meta name="description" content="2024 Hackathon" />
          <link rel="icon" href="/42.png" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ThemeProvider>
  );
};


export default api.withTRPC(MyApp);
