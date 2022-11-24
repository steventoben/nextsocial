import React, {ReactElement, ReactNode} from "react";
import {Property} from "csstype";
import Width = Property.Width;
import {AspectRatio, Box, Circle, IconButton, Image} from "@chakra-ui/react";
import {MdArrowLeft, MdOutlineChevronLeft, MdOutlineChevronRight} from "react-icons/md";

interface ImageGalleryProps {
    imageSet?: string[];
    children: ReactNode;
}
export function ImageGallery(props: ImageGalleryProps) {
    const {
        imageSet,
        children
    } = props;
    const [activeIndex, setActiveIndex] = React.useState<number>(0);
    //feeling children prop may update more than expected, check render count.
    //useRef could be used instead, but image count really should never change
    const imageCount = React.useMemo(() => React.Children.count(children), [children]);
    const stepIndexForward = () => {
        setActiveIndex((prevState: number) => {
            if(prevState === React.Children.count(children)-1) {
                return 0;
            }
            return (prevState + 1);
        });
    };
    const stepIndexBackward = () => {
        setActiveIndex((prevState: number) => {
            if(prevState === 0) {
                return React.Children.count(children)-1;
            }
            return (prevState - 1);
        });
    };
    const changeIndex = React.useCallback((delta: number) => {
        setActiveIndex((prevState: number) => {
            return (prevState + delta);
        });
    }, []);
    return(
        <>
            <Box overflow={'hidden'} position={'relative'}>
                <Box whiteSpace={'nowrap'} transition={'transform 250ms ease'} translateX={`-${100 * activeIndex}%`} transform={'auto'}>
                    {React.Children.map(children, (child, index) => {
                        return React.cloneElement(child as ReactElement, {width: '100%'});
                    })}
                    {/*{imageSet && imageSet.map((image) => {
                        return(
                            <GalleryImage src={image} key={image}/>
                        );
                    })}*/}
                </Box>
                <IconButton bg={'transparent'} fill={'white'} onClick={() => stepIndexBackward()} aria-label={'previous image'} position={'absolute'} left={'1rem'} top={'50%'}>
                    <MdOutlineChevronLeft height={'3em'} width={'3em'} fill={'inherit'}/>
                </IconButton>
                <IconButton bg={'transparent'} fill={'blue'} onClick={() => stepIndexForward()} aria-label={'next image'} position={'absolute'} right={'1rem'} top={'50%'}>
                    <MdOutlineChevronRight height={'3em'} width={'3em'} fill={'inherit'}/>
                </IconButton>
            </Box>
           {/* <Box display={'inline-flex'}>
                {Array(imageCount).fill('').map((_, index) => {
                    return(
                        <Circle size={'2rem'} bg={'blue'} key={index}/>
                    );
                })}
            </Box>*/}
            {/*<button onClick={() => stepIndexBackward()}>prev</button>
            <button onClick={() => stepIndexForward()}>next</button>*/}
        </>
    );
}

interface GalleryItemProps {
    children: ReactNode;
    width?: Width;
}
export function GalleryItem(props: GalleryItemProps) {
    const {
        children,
        width
    } = props;
    return(
        <Box width={width}
             display={'inline-flex'}
             justifyContent={'center'}
             alignItems={'center'}
             height={'20rem'}
             bg={'blue.400'}
             color={'white'}
        >
            {children}
        </Box>
    );
}

interface GalleryImageProps {
    //children?: ReactNode;
    width?: Width;
    src: string;
    ratio?: string;
}
export function GalleryImage(props: GalleryImageProps) {
    const {
        //children,
        width,
        ratio = '16 / 9',
        src
    } = props;
    return(
        <Box width={width}
             borderRadius={'0.5rem'}
             overflow={'hidden'}
             display={'inline-flex'}
             justifyContent={'center'}
             alignItems={'center'}
             /*height={'20rem'}*/
             bg={'blue.400'}
             color={'white'}
        >
            <Image /*width={'100%'}*/ sx={{aspectRatio: ratio}} flex={'1 1 auto'} objectFit={'cover'} src={src} alt={''}/>
        </Box>
    );
}
interface Point {
    x: number;
    y: number;
}
type TouchPoint = Point | null;
export function useSwipe(threshold: number, onSwipeRight: () => void, onSwipeLeft: () => void) {
    const [touchPosition, setTouchPosition] = React.useState<TouchPoint>(null);

    function handleTouchStart(ev: React.TouchEvent<HTMLDivElement>) {
        const initialTouch = ev.touches[0];
        const touchPoint: TouchPoint = {
            x: initialTouch.clientX,
            y: initialTouch.clientY
        };
        setTouchPosition(touchPoint);
    }

    function handleTouchMove(ev: React.TouchEvent<HTMLDivElement>) {
        const touchPoint: TouchPoint = touchPosition;
        if(touchPoint === null) {
            return;
        }
        const currentTouch = ev.touches[0];
        const currentTouchPoint: TouchPoint = {
            x: currentTouch.clientX,
            y: currentTouch.clientY
        };

        const deltaVector = {
            x: touchPoint.x - currentTouch.clientX,
            y: touchPoint.y - currentTouch.clientY
        };

        if(deltaVector.x > threshold) {
            onSwipeLeft();
        }

        if(deltaVector.x < -threshold) {
            onSwipeRight();
        }

    }

}
