import '../styles/globals.css'
import Header from "../components/header";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

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
        <main>
          <Header lang={lang} setLang={ setLang } />
          <Component {...pageProps} session={session} lang={lang}/>
        </main>
      </ApolloProvider>

    </SessionProvider>
  );
}

export default MyApp

