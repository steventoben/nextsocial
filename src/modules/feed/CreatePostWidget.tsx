import {
    Avatar,
    Box,
    Button,
    ButtonGroup,
    Collapse, Flex,
    FormLabel,
    Input,
    InputGroup, Tag, TagCloseButton, TagLabel,
    Textarea, useOutsideClick,
    useUpdateEffect
} from "@chakra-ui/react";
import {MdImage, MdPoll} from "react-icons/md";
import React from "react";
import {useSubmitForm} from "../../hooks/useSubmitForm";
import {FileUploader} from "../../components/form/FileUploader";
import {TagInput} from "../../components/input/TagInput";
import {useAuthentication} from "../auth/AuthenticationProvider";

interface CreatePostWidgetProps {}
export function CreatePostWidget(props: CreatePostWidgetProps) {
    const {} = props;

    const {userData} = useAuthentication();

    const ref = React.useRef<HTMLTextAreaElement>(null);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const fileRef = React.useRef<HTMLInputElement>(null);
    const filesRef = React.useRef<HTMLInputElement>(null);
    const [hasFocus, setHasFocus] = React.useState<boolean>(false);
    const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
    const [images, setImages] = React.useState<File[]>([]);
    const [files, setFiles] = React.useState<File[]>([]);
    const [tags, setTags] = React.useState<string[]>([]);
    const [tagsValue, setTagsValue] = React.useState<Array<string>>([]);
    const {handleFetch: submitForm} = useSubmitForm();
    useOutsideClick({
        ref: containerRef,
        handler: e => {
            if(ref.current?.value || tags.length){}
            else {
                setIsExpanded(false);
            }
        }
    })
    useUpdateEffect(() => {
        if(!ref.current) {
            return;
        }
        if(hasFocus) {
            setIsExpanded(true);
        } /*else {
            setIsExpanded(ref.current.value.length>0);
        }*/
    }, [hasFocus]);
    function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        const formData: FormData = new FormData();
        formData.set('name', 'deprecated');
        formData.set('content', ref.current!.value);
        formData.set('categories', JSON.stringify(tags));
        formData.set('files', '');
        //const files: FileList|null = fileRef.current?.files || null;//fields.current.attachments.current!.files;
        const fileCount = files.length;
        if(fileCount) {
            for(let i = 0; i < fileCount; i++) {
                const image: Blob = files[i] as Blob;
                formData.append('files', image);
            }
        }
        //console.log(fields);
        console.log(formData);
        //console.log(fields.current.tags);
        console.log(tags);
        //console.log(images);
        console.log(files);
        submitForm({
            url: `/posts`,
            method: 'POST',
            formBody: formData
        }).then((res: any) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    }
    /*function handleFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
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
    function handleFileButtonClick() {
        fileRef.current?.click();
    }*/
    function handleKeydown(ev: React.KeyboardEvent<HTMLFormElement>) {
        if(ev.key === 'Enter') {
            console.log('entered');
            ev.preventDefault();
        }
    }
    return(
        <form onKeyDown={handleKeydown} onSubmit={handleSubmit}>
        <Box display={'flex'} boxShadow={isExpanded?'1px 1px 4px 1px rgba(25,25,25,0.2)':'none'} ref={containerRef} width={'100%'} backgroundColor={'white'} padding={'2rem 1rem'} marginBottom={'4rem'}>
            <Box marginRight={'1rem'} display={'inline-block'}>
                <Avatar size={'md'} name={userData.username} src={userData.avatar || undefined}/>
            </Box>
            <Box flexGrow={'1'}>
            <Box padding={'0 0 1rem 0'}>

                <InputGroup>
                    <Textarea onFocus={() => setHasFocus(true)}
                              onBlur={() => setHasFocus(false)}
                              ref={ref}
                              padding={'1rem 1rem'}
                              resize={'none'}
                              height={'4rem'}
                              placeholder={'Share your thoughts....'}
                    />
                </InputGroup>
            </Box>
            <Box>
                <ButtonGroup>
                    {/*<Box>
                        <Button onClick={handleFileButtonClick} leftIcon={<MdImage/>}>Add media</Button>
                        <input onChange={handleFileChange} ref={fileRef} hidden={true} type={'file'} multiple={true}/>
                    </Box>*/}
                    <Button leftIcon={<MdPoll/>}>Create poll</Button>
                    <FileUploader setFiles={setFiles} files={files}/>
                </ButtonGroup>
            </Box>

            {/*<Box>
                {images.map((img) => {
                    return(
                        <Tag key={img.name}>
                            <TagLabel>{img.name}</TagLabel>
                            <TagCloseButton onClick={() => {
                                setImages((prevState) => {
                                    return prevState.filter((file) => file.name!==img.name);
                                })
                            }}/>
                        </Tag>
                    );
                })}
            </Box>*/}
            <Collapse in={isExpanded}>
                <Flex>
                    <Box>
                <FormLabel>Add relevant topics:</FormLabel>
                        <TagInput tags={tags} setTags={setTags}/>
                    </Box>
                    <Box>
                <FormLabel>Community:</FormLabel>
                    <Input/>
                    </Box>
                </Flex>
                <Button type={'submit'}>Post</Button>
            </Collapse>
            </Box>
        </Box>
        </form>
    );
}
