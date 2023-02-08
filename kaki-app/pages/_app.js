import '../styles/globals.css'
import Header from "../components/header";
import Link from 'next/link'
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL,
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps: { session, loading, ...pageProps } }) {
  
  const [ lang, setLang ] = useState("EN");

  return (
    <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>

      {
        loading && <h2>Loading...</h2>
      }

      <ApolloProvider client={client}>
        <main className="flex flex-col">
          <Header lang={lang} setLang={ setLang } />
          <Component {...pageProps} session={session} lang={lang}/>
          <div className="w-full text-black text-center font-normal text-sm p-2 bg-gray-300">This site is a work-in-progress under active development. Please feel free to send issues or suggestions to <span className="text-orange-700 text-underline"><Link href="mailto:kaki-dev@mathewkramer.io">kaki-dev@mathewkramer.io</Link></span>.</div>
        </main>
      </ApolloProvider>

    </SessionProvider>
  );
}

export default MyApp

