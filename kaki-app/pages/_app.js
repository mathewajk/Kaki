import '../styles/globals.css'
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql',
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <div className={"menuTop"}><img src="/kaki.png" width="25px"></img> <h2>Kaki</h2></div>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp
