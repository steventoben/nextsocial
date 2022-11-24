import {Box, Flex, useMediaQuery} from "@chakra-ui/react";
import React, {Context, ReactNode} from "react";
import {SideBar} from "../../components/SideBar/SideBar";
import {Header} from "../../components/header/Header";


/*export const AppContext: Context<any> = React.createContext({});

interface Props {
    children: ReactNode;
}
export function AppContextProvider(props: Props) {
    const {
        children
    } = props;
    const [isMobile, isDesktop] = useMediaQuery(['(max-width: 30em)', '(min-width: 60em)']);

    return(
        <AppContext.Provider value={{isMobile, isDesktop}} >
            {children}
        </AppContext.Provider>
    );
}*/

interface AppLayoutProps {
    children: ReactNode;
    sidebarWidth: string;
}
export function AppLayout(props: AppLayoutProps) {
    const {
        children,
        sidebarWidth = '16rem'
    } = props;
    //const {isMobile, isDesktop} = React.useContext(AppContext);
    const [isMobile, isDesktop] = useMediaQuery(['(max-width: 30em)', '(min-width: 60em)']);
    return(
        <>
            <Box position={'relative'} minHeight={'100vh'} backgroundColor={'gray.50'}>
                {/*<Flex zIndex={9900} bg={'cornflowerblue'} as={'header'} position={'fixed'} top={0} left={0} width={'100%'} padding={'1rem'}>
                    <Box>Logo</Box>
                    <Box>Search</Box>
                    <Box>Profile menu</Box>
                </Flex>*/}
                <Header/>
                {!isDesktop ? null :
                    <Box marginTop={'3.5rem'} as={'nav'} position={'fixed'} left={0} width={sidebarWidth} bg={'salmon'}
                         height={'100vh'}>
                        <SideBar/>
                    </Box>
                }
                <Box sx={isDesktop?{left: '8rem', width: 'calc(100% - 16rem)', maxWidth: '60rem', margin: '0 auto'}:{}} /*padding={isDesktop ? '4rem' : '1rem'}*/ as={'main'} position={'relative'} top={'8rem'} left={`calc(${sidebarWidth} * ${Number(isDesktop)})`} width={`calc(100% - (${sidebarWidth} * ${Number(isDesktop)}))`}>
                    {children}
                </Box>
            </Box>
        </>
    );
}
