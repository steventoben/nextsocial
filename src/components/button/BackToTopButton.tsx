import {BiArrowToTop} from "react-icons/bi";
import {Box, IconButton} from "@chakra-ui/react";
import React from "react";

interface BackToTopButtonProps {}
export function BackToTopButton(props: BackToTopButtonProps) {
    const {} = props;
    const doc = React.useRef(null);
    function handleClick() {
        if(document) {
            document.scrollingElement?.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
    }
    return(
        <Box position={'fixed'} top={'calc(100vh - 4rem)'} right={'4rem'}>
            <IconButton borderRadius={'full'} size={'lg'} colorScheme={'brand'} onClick={handleClick} aria-label={'back-to-top'}>
                <BiArrowToTop/>
            </IconButton>
        </Box>
    );
}
