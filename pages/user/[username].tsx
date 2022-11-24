import {NextPage, NextPageContext} from "next";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {useRouter} from "next/router";
import {Avatar, Box, Button, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import {AvatarType, ProfilePageDataDto, ProfilePageDto, UserOverviewDto} from "../../src/models/userDto";
import {userPageSample} from "../../src/data/samples";
import {MdAdd} from "react-icons/md";
import {Feed, PostsFeed} from "../../src/modules/feed/Feed";
import {CommunityPageDto} from "../../src/models/communityDto";
import {FiMinus} from "react-icons/fi";
import {useApi} from "../../src/hooks/useApi";
import React from "react";
import {SortSelectDivider} from "../../src/components/select/Select";

interface UserPageProps {
    //userOverview: UserOverviewDto;
    profileOverview: ProfilePageDataDto
}
const UserPage: NextPage<UserPageProps> = (props: UserPageProps) => {
    const {
        profileOverview: user //= userPageSample
    } = props
    const userName = useRouter().query.username;
    const {follow: followUser, unfollow: unfollowUser} = useApi();
    const [isFollowing, setIsFollowing] = React.useState<boolean>(user.isFollowing || false);
    async function follow() {
        if(user.username === null) {
            throw Error('User has no username, not supposed to happen');
        }
        const isSuccess = await followUser(user.username);
        if(isSuccess) {
            setIsFollowing(true);
        }
    }
    async function unfollow() {
        if(user.username === null) {
            throw Error('User has no username, not supposed to happen');
        }
        const isSuccess = await unfollowUser(user.username);
        if(isSuccess) {
            setIsFollowing(false);
        }
    }
    // @ts-ignore
    return(
        <AppLayout sidebarWidth={'16rem'}>
            <Box bg={'gray.50'} height={'4rem'}>

            </Box>
            <Box padding={'1rem'} bg={'white'} position={'relative'}>
                <Avatar bottom={'2.5rem'} display={'inline-flex'} size={'2xl'} name={user.username || undefined} src={getAvatar(user.avatar)}/>
                <Box lineHeight={'1.25'} display={'inline-block'}>
                    <Text fontSize={'1.5rem'}>{user.username}</Text>
                    <Text fontSize={'1rem'} color={'hsl(0,0%,29%)'}>{user.bio}</Text>
                </Box>
                <Box position={'absolute'} right={'1rem'} display={'inline-block'}>
                    <Button /* paddingRight={'1.25rem'}*/
                        leftIcon={isFollowing ? <FiMinus/> : <MdAdd/>}
                        borderRadius={'0.25rem'}
                        variant={isFollowing ? 'outline' : 'solid'}
                        onClick={isFollowing ? () => unfollow() : () => follow()}
                    >
                        {`${isFollowing ? 'Unfollow' : 'Follow'}`}
                    </Button>
                </Box>
            </Box>
            <Box>
                <Tabs bg={'white'} size={'lg'}>
                    <TabList>
                        <Tab>Posts</Tab>
                        <Tab>Likes</Tab>
                        <Tab>Comments</Tab>
                    </TabList>
                    <TabPanels bg={'gray.50'} sx={{'&>*': {padding: '1rem 0'}}}>
                        <TabPanel>
                            <Box paddingTop={'2rem'}>
                                <SortSelectDivider/>
                            </Box>
                            <PostsFeed posts={user.posts}/>
                        </TabPanel>
                        <TabPanel>
                            <PostsFeed posts={user.favorites}/>
                        </TabPanel>
                        <TabPanel>
                            {/*<Feed posts={user.comments}/>*/}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </AppLayout>
    );
}
export const getAvatar = (avatar: AvatarType|null): string|undefined => {
    if(typeof avatar === "undefined" || avatar === null) {
        return undefined;
    }
    if(typeof avatar === "string") {
        return avatar;
    }
    if(Reflect.has(avatar, 'url')) {
        return avatar.url;
    }
    console.log('not supposed to happen');
    return undefined;
    //return avatar;
}
export default UserPage;

export async function getServerSideProps(context: NextPageContext) {
    // @ts-ignore
    const token = context.req.cookies['Authentication'];
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

    const username = context.query.username;
    const myReq = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/${username}`, requestInit);
    const response = await fetch(myReq);
    if(response.status===401) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }
    //const data: UserOverviewDto = await response.json();
    const data: ProfilePageDto = await response.json();

    console.log(data);
    return  {
        props: {
            profileOverview: data
        }
    }
}
