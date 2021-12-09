import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, LightMode } from "@chakra-ui/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider>
        <LightMode>
          <Component {...pageProps} />
        </LightMode>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
