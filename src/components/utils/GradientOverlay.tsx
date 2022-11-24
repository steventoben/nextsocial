import {Box} from "@chakra-ui/react";

interface GradientOverlayProps {}
export function GradientOverlay(props: GradientOverlayProps) {
    const {} = props;
    return(
        <Box position={'absolute'}
             top={0}
             left={0}
             height={'10%'}
             background={'linear-gradient(-45deg, rgba(0,0,0,0), rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.2) 80%, rgba(27,27,27,0.5))'}
             /*opacity={0.5}*/
        />
    );
}
