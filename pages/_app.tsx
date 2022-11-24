import '../styles/globals.css'
//import '../styles/index.scss';
import type { AppProps } from 'next/app'
import {ChakraProvider} from "@chakra-ui/provider";
//import theme from "@chakra-ui/theme";
import {AuthenticationProvider} from "../src/modules/auth/AuthenticationProvider";
import {RouteGuard} from "../src/modules/auth/RouteGuard";
import {SearchProvider} from "../src/modules/search/SearchBar";
import {extendTheme} from "@chakra-ui/react";
//import {AppContextProvider} from "../src/modules/layout/AppLayout";

const myTheme = extendTheme({
    colors: {
        brand: {
            50: '#202f4020',
            100: '#202f40',
            200: '#191e29',
            500: '#202f40',
            600: '#0b0d10',
            700: '#191e29',
        },
        primary: {
            50: 'rgba(55,163,240,0.1)',
            500: '#36a2ef',
            600: '#3998db',
            700: '#3174a3'
        }
    },
    components: {
        Tag: {
            baseStyle: {
                fontFamily: 'Helvetica Neue',
                fontWeight: 700,
                letterSpacing: '0.025em'
            },
            variants: {
                'ghost-primary': {
                    border: '1px solid',
                    borderColor: 'primary.500',
                    color: 'primary.700',
                    backgroundColor: 'primary.50'
                },
                'ghost-primary-green': {
                    border: '1px solid',
                    borderColor: 'primary.500',
                    color: 'primary.700',
                    backgroundColor: 'green.100'
                },
            }
        }
    }

});

export default function App({ Component, pageProps }: AppProps) {
  return (
      <ChakraProvider theme={myTheme}>

          <AuthenticationProvider>
              <RouteGuard>
                  <SearchProvider>
                <Component {...pageProps} />
                  </SearchProvider>
              </RouteGuard>
          </AuthenticationProvider>

      </ChakraProvider>
  );
}

