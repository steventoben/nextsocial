import {
    AspectRatio,
    Box,
    Button, CloseButton, Flex, IconButton, Image, Input,
    Modal, ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure
} from "@chakra-ui/react";
import React, {Context, RefObject, SetStateAction} from "react";
import {BiTrash} from "react-icons/bi";
import {DimensionsListType, DimensionsType} from "../../modules/gallery/ImageGrid";
import {MdImage} from "react-icons/md";

export const FileUploadContext: Context<any> = React.createContext({});

interface FileUploaderProps {
    files: File[];
    setFiles: React.Dispatch<SetStateAction<File[]>>;
    ref?: RefObject<HTMLInputElement>;
}
export function FileUploader(props: FileUploaderProps) {
    const {
        files,
        setFiles
        //ref
    } = props;
    const {isOpen, onOpen, onClose, onToggle} = useDisclosure();
    //const [files, setFiles] = React.useState<File[]>([]);
    return(
        <FileUploadContext.Provider value={{files, setFiles}}>
            <Button leftIcon={<MdImage/>} onClick={onOpen}>Upload media</Button>
            <FileUploadModal isOpen={isOpen} onClose={onClose}/>
        </FileUploadContext.Provider>
    );
}
function useFileUploader() {
    const {files, setFiles} = React.useContext(FileUploadContext);

}
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    //files?: File[];
}
export const FileUploadModal = React.forwardRef((props: ModalProps, ref) =>  {
    const {
        isOpen,
        onClose,
        //files
    } = props;

    const fileRef = React.useRef<HTMLInputElement>(null);
    //const [images, setImages] = React.useState<File[]>([]);
    const {files: images, setFiles: setImages} = React.useContext(FileUploadContext);

/*    React.useImperativeHandle(ref, () => ({
        getFiles() {
            getFiles();
        }
    }));

    function getFiles() {
        return images;
    }*/

    function handleFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const fileList = ev.target.files;
        const fileArray: File[] = [];
        console.log(fileList);
        if(fileList) {
            for(let i = 0; i < fileList.length; i++) {
                const file = fileList.item(i);
                if(file) {
                    fileArray.push(file);
                }
            }
        }
        setImages(fileArray);
    }
    function handleFileAdd(ev: React.ChangeEvent<HTMLInputElement>) {
        const fileList: FileList|null = ev.target.files;
        if(fileList === null) {
            return;
        }
        const fileCount = fileList.length;
        const newFiles: File[] = [];
        for (let i = 0; i < fileCount; i++) {
            const file = fileList.item(i);
            if (file) {
                newFiles.push(file);
            }
        }
        setImages((prevState:File[]) => prevState.concat(newFiles));
    }
    function addFile(file: File) {
        setImages((prevState:File[]) => prevState.concat(file));
    }
    function handleRemoveFile(file: File) {
        setImages((prevState:File[]) => prevState.filter(value => value !== file));
    }
    function handleFileButtonClick() {
        fileRef.current?.click();
    }
    function toArray() {

    }

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        console.log('Files dropped into drop zone');
        event.preventDefault();
        if(event.dataTransfer.items) {
            const items = Array.from(event.dataTransfer.items);

            items.forEach((item, index) => {
                if(item.kind === 'file') {
                    const file = item.getAsFile();//item.getAsFile();
                    console.log(file?.name);
                    if (file) {
                        addFile(file);
                    }
                }
            })
        } else {
            const files = Array.from(event.dataTransfer.files);
            files.forEach((file, index) => {
                console.log(file.name);
            });
        }
    }
    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        console.log('Files in drop zone');
        event.preventDefault();
    }

    const dragAndDropArea = (
        <>
        <Flex onDrop={handleDrop} onDragOver={handleDragOver} flexDirection={'column'} alignItems={'center'} padding={'1rem'} border={'2px dashed'} borderColor={'blue.400'} bg={'rgba(190,227,248,0.5)'}>
            <Text textTransform={'capitalize'} fontWeight={600}>Drop files here</Text>
            <Text>or</Text>
            <Box marginTop={'0.5rem'}>
                <Button colorScheme={'primary'} variant={'outline'} onClick={handleFileButtonClick}>Add files</Button>
                <input onChange={handleFileAdd} ref={fileRef} hidden={true} multiple={true} type={'file'}/>
            </Box>
        </Flex>
        </>
    );


    return(
        <Modal isCentered={true} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Text>Upload Media</Text>
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <Flex flexDirection={'column'}>
                        <Box marginBottom={'4rem'}>
                            {dragAndDropArea}
                        </Box>
                        <Box width={'100%'}>
                            {images.map((image:File) => {
                                return(
                                    <FileItem image={image} handleRemoveFile={handleRemoveFile} key={image.name}/>
                                );
                                /*return(
                                    <Flex key={image.name}>
                                        <AspectRatio ratio={1 / 1} width={'100%'} maxWidth={'8rem'}>
                                            <Image alt={image.name} src={URL.createObjectURL(image)}/>
                                        </AspectRatio>
                                        <CloseButton onClick={() => handleRemoveFile(image)}/>
                                        <Text>{image.name} {image.size}</Text>
                                    </Flex>
                                );*/
                            })}
                        </Box>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleFileButtonClick}>Add files</Button>
                    {/*<input onChange={handleFileAdd} ref={fileRef} hidden={true} multiple={true} type={'file'}/>*/}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
});
FileUploadModal.displayName = 'FileUploadModal';


const ratio: DimensionsListType = {
    "1:1": { width: 1, height: 1 },
    "1:2": { width: 1, height: 2 },
    "2:3": { width: 2, height: 3 },
    "3:2": { width: 3, height: 2 },
    "3:4": { width: 3, height: 4 },
    "4:3": { width: 4, height: 3 },
    "16:9": { width: 16, height: 9 },
} as const;
const ratios = {

};
function calculateSizing(dimensions: DimensionsType) {
    const ratio = dimensions.height / dimensions.width;
    const isSquare = dimensions.height === dimensions.width;
    if(isSquare) {
        //1:1
    }
    const isVertical = dimensions.height > dimensions.width;
    if(isVertical) {
        //4160,6240 => 6240/4160 = 1.5 = 2:3
        //4160,6240
        //4160,6240
        //4160,6240

    }
}

interface FileProps {
    image: File;
    handleRemoveFile: (file:File) => void;
}
function FileItem(props: FileProps) {
    const {
        image,
        handleRemoveFile
    } = props;
    //const imageSrc: string = React.useMemo(() => )
    /*const img = React.useRef<string>('');
    React.useEffect(() => {
        img.current = URL.createObjectURL(image);
        return () => {
            URL.revokeObjectURL(img.current);
        }
    }, []);*/
    const [imageDimensions, setImageDimensions] = React.useState<DimensionsType>({width:0,height:0});
    function handleLoaded(ev: React.SyntheticEvent<HTMLImageElement>) {
        setImageDimensions({width: ev.currentTarget.naturalWidth, height: ev.currentTarget.naturalHeight});
        URL.revokeObjectURL(ev.currentTarget.src);
    }
    const fileSize = React.useMemo(() => {
        const numberOfBytes = image.size;
        const units = [
            "B",
            "KB",
            "MB",
            "GB",
            "TB",
            "PB",
            "EB",
            "ZB",
            "YB",
        ];
        const exponent = Math.min(
            Math.floor(Math.log(numberOfBytes) / Math.log(1024)),
            units.length - 1
        );
        const approx = numberOfBytes / 1024 ** exponent;
        const output =
            exponent === 0
                ? `${numberOfBytes} bytes`
                : `${approx.toFixed(2)} ${
                    units[exponent]
                }`;// (${numberOfBytes} bytes)`;
        return output;
    }, [image.size]);
    return(
        <Flex height={'5rem'} alignItems={'center'} margin={'0.5rem 0'} bg={'gray.50'}>
            <AspectRatio ratio={1 / 1} width={'100%'} maxWidth={'5rem'}>
                <Image onLoad={handleLoaded} alt={image.name} src={URL.createObjectURL(image)}/>
            </AspectRatio>
            <Box flexGrow={'1'} marginLeft={'1rem'}>
                <Text>{image.type}</Text>
                <Text>{fileSize}</Text>
                <Text>{imageDimensions.width} x {imageDimensions.height}</Text>
            </Box>
            <IconButton aria-label={'remove file'}
                        icon={<BiTrash/>}
                        bg={'transparent'}
                        _hover={{
                            bg: 'transparent',
                            color: 'red.400',
                        }}
                        onClick={() => handleRemoveFile(image)}
            />
            {/*<CloseButton onClick={() => handleRemoveFile(image)}/>*/}
        </Flex>
    );
}
