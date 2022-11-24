import {Box, Image as CkImage, Text} from "@chakra-ui/react";
import React, {ReactNode, SetStateAction} from "react";

export type DimensionsType = {
    width: number;
    height: number;
};
type AspectRatioType = {
    width: number;
    height: number;
};
type AspectRatioListType = {
    [ratio: string]: AspectRatioType;
};
export type DimensionsListType = AspectRatioListType;
const aspectRatiosMd: AspectRatioListType = {
    ONE_TO_ONE: { width: 1, height: 1 },
    TWO_TO_THREE: { width: 2, height: 3 },
    THREE_TO_TWO: { width: 3, height: 2 },
    THREE_TO_FOUR: { width: 3, height: 4 },
    FOUR_TO_THREE: { width: 4, height: 3 },
    SIXTEEN_TO_NINE: { width: 16, height: 9 },
};
const aspectRatiosCarbon: AspectRatioListType = {
    "1:1": {width:1,height:1},
    "1:2": {width:1,height:2},
    "3:2": {width:3,height:2},
    "4:3": {width:4,height:3},
    "16:9": {width:16,height:9},
};

const loadImage = (setImageDimensions: React.Dispatch<SetStateAction<DimensionsType[]>>, imageUrl: string) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
        setImageDimensions(prevState => prevState.concat({
            height: img.height,
            width: img.width
        }));
    };
    img.onerror = (err) => {
        console.log("img error");
        console.error(err);
    };
};

interface ImageGridProps {
    gridVariant?: [number, number];
    imageSet: string[];
    children?: ReactNode;
}
export function ImageGrid(props: ImageGridProps) {
    const {
        gridVariant = [1, 2],
        imageSet
    } = props;
    const [imageDimensions, setImageDimensions] = React.useState<DimensionsType[]>([]);
    //const imageMap = React.useMemo(() => new Map<string, number>(imageSet.map((value,index) => [value, imageDimensions[index].height/imageDimensions[index].width])), [imageDimensions, imageSet]);
    const imageRatios = React.useMemo(() => {
        return imageDimensions.map(value => value.height/value.width);
    }, [imageDimensions]);
    const [imageList, setImageList] = React.useState<string[]>([]);
    //const imageUrl = "https://picsum.photos/200/300";
    const init = React.useRef<boolean>(true);
    React.useEffect(() => {
        for(const image of imageSet) {
            if(init.current) {
                loadImage(setImageDimensions, image);
            }
            console.log(imageDimensions);
        }
        init.current=false;
        imageDimensions.forEach((value, index) => {

        })

        //imageSet.splice()
        //loadImage(setImageDimensions, imageUrl);
        //console.log(imageDimensions);
    }, []);
    React.useEffect(() => {
        console.log(imageRatios);
        const max = Math.max(...imageRatios);
        const maxIndex = imageRatios.indexOf(max);
        console.log(`Max ratio: ${max} at index: ${maxIndex}`);
        const list = [imageSet[maxIndex]].concat(imageSet.filter((_,i) => i!==maxIndex));
        setImageList(list);
        console.log(list);
    }, [imageRatios]);
    React.useLayoutEffect(() => {

    }, []);
    return(
        <>
            <Box display={'grid'} gap={'0.5rem'} gridTemplateColumns={'1fr 1fr'} gridTemplateRows={'1fr 1fr'}>
                {imageList.map((image, index) => {
                    return(
                        <Box borderRadius={'0.5rem'} overflow={'hidden'} key={image} gridColumn={index===0?'1':'2'} gridRow={index===0?'1 / span 2':`${index}`}>
                            <CkImage height={'100%'} objectFit={'cover'} alt={''} src={image}/>
                        </Box>
                    );
                })}
            </Box>
        <Box>
            {imageDimensions.length>0 ? imageDimensions.map((image) => {
                return(
                    <Text key={String(image)}>{image.width} x {image.height}</Text>
                );
            })
            :
            null
            }
        </Box>
        </>
    );
}
