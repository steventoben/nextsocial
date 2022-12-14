import {Avatar, Box, Button, FormLabel, Heading, Icon, Spacer, Text, Textarea, useUpdateEffect} from "@chakra-ui/react";
import {TbEdit} from "react-icons/tb";
import React from "react";
import {useAuthentication} from "../auth/AuthenticationProvider";
import {useSubmitForm} from "../../hooks/useSubmitForm";
import {UserPrefStruct} from "../../../pages/preferences";
import {InlineTextbox} from "./InlineTextbox";

interface ProfileEditorProps {
    //avatarImage: string;
    userInfo: UserPrefStruct;
}
export function ProfileEditor(props: ProfileEditorProps) {
    const {
        //avatarImage
        userInfo
    } = props;
    //const {getCurrentUser} = useAuthentication();
    const fileRef = React.useRef<HTMLInputElement>(null);
    const bioRef = React.useRef<HTMLInputElement>(null);
    const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
    const [fileImage, setFileImage] = React.useState<File | null>(null);
    const [avatarImage, setAvatarImage] = React.useState<string | null>(null);
    const [bioValue, setBioValue] = React.useState(userInfo.bio||``);
    const {handleFetch: submitAvatar} = useSubmitForm();
    function handleButtonClick() {
        fileRef.current?.click();
    }
    function handleFileChange(ev: React.ChangeEvent<HTMLInputElement>) {
        const fileList = ev.target.files;
        const image = fileList?.item(0) || null;
        if(image) {
            const source: string = URL.createObjectURL(image);
            setFileImage(image);
            setAvatarImage(source);
        }
    }
    useUpdateEffect(() => {
        if(avatarImage) {
            URL.revokeObjectURL(avatarImage);
        }
    }, [avatarImage]);
    function uploadAvatar() {
        if(fileImage===null) {
            return;
        }
        const formData: FormData = new FormData();
        formData.set('file', fileImage as Blob);
    }

    return(
        <div>
            <Box minWidth={'32rem'} position={'relative'}>
                <Box cursor={'pointer'} position={'relative'} height={'16rem'} width={'16rem'}>
                    <Avatar sx={{'& > img:hover': {opacity: '1', filter: 'opacity(0.5) blur(2px)', transition: 'all 250ms ease'}}} opacity={isEditMode?'0.5':'1'} size={'full'} src={userInfo.avatar.url || undefined} name={userInfo.username}/>
                    <Box _hover={{opacity: '1', transition: 'opacity 200ms ease'}} opacity={'0'} pointerEvents={'none'} position={'absolute'} width={'100%'} height={'100%'} left={'0'} top={'0'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                        <Icon display={'flex'} justifyContent={'center'} alignItems={'center'} bg={'white'} borderRadius={'2rem'} pointerEvents={'none'} height={'4rem'} width={'4rem'} zIndex={0}>
                            <TbEdit display={'inline-flex'} style={{justifyContent: 'center', alignItems: 'center'}} height={'100%'} width={'100%'}/>
                        </Icon>
                    </Box>
                </Box>
                <Heading>{userInfo.username}</Heading>
                {/*{isEditMode ? <Box><Text>{userInfo.bio || 'Add a bio'}</Text></Box>
                :
                <Textarea maxWidth={'16rem'} value={userInfo.bio || 'Add a bio'}/>}*/}
                <FormLabel>Bio</FormLabel>
                <InlineTextbox ref={bioRef} value={bioValue} setValue={setBioValue}/>
                <Spacer height={'2rem'}/>
                <Button onClick={handleButtonClick}>Change Avatar</Button>
                <Button onClick={() => console.log(bioRef.current?.value || 'no value')}>Save</Button>
                <input ref={fileRef} hidden={true} type={'file'} onChange={handleFileChange}/>
                <Button variant={'outline'} colorScheme={'primary'} onClick={() => setIsEditMode(v => !v)} leftIcon={<TbEdit/>} right={'1rem'} top={'1rem'} position={'absolute'}>{`Edit`}</Button>
            </Box>
        </div>
    );
}
