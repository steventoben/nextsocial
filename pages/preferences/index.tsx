import {NextPage, NextPageContext} from "next";
import {useAuthentication} from "../../src/modules/auth/AuthenticationProvider";
import {Avatar, Box, Button, Flex, Heading, Spacer, Textarea, useUpdateEffect} from "@chakra-ui/react";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {CommunityCard} from "../../src/components/cards/CommunityCard";
import React from "react";
import {useSubmitForm} from "../../src/hooks/useSubmitForm";
import {TbEdit} from "react-icons/tb";
import {ProfileEditor} from "../../src/modules/preferences/ProfileEditor";

export interface UserPrefStruct {
    id: number;
    username: string;
    bio: string|null;
    createdAt: string;
    avatar: {
        id?: number;
        key: string;
        url: string;
    }
}

interface PreferencesPageProps {
    userInfo: UserPrefStruct;
}
const PreferencesPage: NextPage<PreferencesPageProps> = (props: PreferencesPageProps) => {
    const {
        userInfo
    } = props;
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
    React.useEffect(() => {
        console.log(userInfo);
    }, [userInfo]);
    return(
        <AppLayout sidebarWidth={'16rem'}>
            <Box maxWidth={'80ch'} margin={'0 auto'}>
                <Flex>
                    <ProfileEditor userInfo={userInfo}/>
                    {/*<Box position={'relative'}>
                        <Box height={'12rem'} width={'12rem'}>
                            <Avatar size={'full'} src={avatarImage ? avatarImage : getCurrentUser().avatar || undefined} name={getCurrentUser().username}/>
                        </Box>
                        <Heading>{getCurrentUser().username}</Heading>
                        <Textarea/>
                        <Button onClick={handleButtonClick}>Change Avatar</Button>
                        <input ref={fileRef} hidden={true} type={'file'} onChange={handleFileChange}/>
                        <Button onClick={handleUploadAvatar}>Upload</Button>
                        <Button leftIcon={<TbEdit/>} right={'1rem'} top={'1rem'} position={'absolute'}>{`Edit`}</Button>
                    </Box>*/}
                    <Box></Box>
                    {/*<Button>{`Edit`}</Button>*/}
                </Flex>
            </Box>


        </AppLayout>
    );
}
export default PreferencesPage;

export async function getServerSideProps(context: NextPageContext) {

    // @ts-ignore
    const token = context.req.cookies['Authentication'];
    //const authToken = context.req?.headers.authorization;
    const headers = {
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin': `${process.env.REACT_APP_BASE_DOMAIN}`,
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token}`
    };
    const reqHeaders: Headers = new Headers(headers);
    const requestInit: RequestInit = {
        method: 'GET',
        headers: reqHeaders,
        //body: body,
        mode: "cors",
        redirect: "follow",
        credentials: 'include'
    };
    const myReq = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/me/preference`, requestInit);
    console.log(myReq);
    const reqData = await fetch(myReq);
    console.log(reqData);
    if(reqData.status===401) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }
    const data = await reqData.json();
    //const data = myFetcher(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/all?page=4`, token);
    console.log(data);


    return {
        props: {
            userInfo: data
        }
    }
}
