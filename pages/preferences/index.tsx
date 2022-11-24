import {NextPage, NextPageContext} from "next";
import {useAuthentication} from "../../src/modules/auth/AuthenticationProvider";
import {Avatar, Box, Button, Flex, Heading, Spacer, Textarea, useUpdateEffect} from "@chakra-ui/react";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {CommunityCard} from "../../src/components/cards/CommunityCard";
import React from "react";
import {useSubmitForm} from "../../src/hooks/useSubmitForm";

interface PreferencesPageProps {}
const PreferencesPage: NextPage<PreferencesPageProps> = (props: PreferencesPageProps) => {
    const {} = props;
    const {getCurrentUser} = useAuthentication();
    const fileRef = React.useRef<HTMLInputElement>(null);
    const [fileImage, setFileImage] = React.useState<File | null>(null);
    const [avatarImage, setAvatarImage] = React.useState<string | null>(null);
    const [bioValue, setBioValue] = React.useState('');
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
    function handleUploadAvatar() {

    }
    return(
        <AppLayout sidebarWidth={'16rem'}>
            <Box maxWidth={'80ch'} margin={'0 auto'}>
                <Flex>
                    <Box>
                        <Box height={'12rem'} width={'12rem'}>
                            <Avatar size={'full'} src={avatarImage ? avatarImage : getCurrentUser().avatar || undefined} name={getCurrentUser().username}/>
                        </Box>
                        <Heading>{getCurrentUser().username}</Heading>
                        <Textarea/>
                        <Button onClick={handleButtonClick}>Change Avatar</Button>
                        <input ref={fileRef} hidden={true} type={'file'} onChange={handleFileChange}/>
                        <Button onClick={handleUploadAvatar}>Upload</Button>

                    </Box>
                    <Box></Box>
                </Flex>
            </Box>


        </AppLayout>
    );
}
export default PreferencesPage;

export async function getServerSideProps(context: NextPageContext) {
    return {
        props: {

        }
    }
}
