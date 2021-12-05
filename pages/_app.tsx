import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, LightMode } from "@chakra-ui/react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <LightMode>
        <Component {...pageProps} />
      </LightMode>
    </ChakraProvider>
  );
}

export default MyApp;
