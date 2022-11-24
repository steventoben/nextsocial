import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, {Head, Html, NextScript, Main} from "next/document";

class Document extends NextDocument {
    render(): JSX.Element {
        return (
            <Html lang={'en'}>
                <Head />
                <body>
                <ColorModeScript initialColorMode={'light'}/>
                <Main/>
                <NextScript/>
                <div id={'portal'} style={{position: 'fixed', top: 0, left: 0}}></div>
                </body>
            </Html>
        );
    }
}
export default Document;
