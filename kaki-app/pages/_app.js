import '../styles/globals.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import Image from "next/image";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL,
  cache: new InMemoryCache()
});


function MyApp({ Component, pageProps }) {
  

  console.log(process.env.GRAPHQL)

  return (
    <ApolloProvider client={client}>
      <div className={"menuTop"}>
        <Image src="/kaki.png" width={25} height={25} alt="" />&nbsp;&nbsp;&nbsp;<h2>Kaki</h2>
      </div>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp
