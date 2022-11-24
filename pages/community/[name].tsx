import {NextPage, NextPageContext} from "next";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {useRouter} from "next/router";
import {Avatar, Box, Button, Heading, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import {UserOverviewDto} from "../../src/models/userDto";
import {communityPageSample, userPageSample} from "../../src/data/samples";
import {MdAdd, MdRemove} from "react-icons/md";
import {Feed, PostsFeed} from "../../src/modules/feed/Feed";
import {CommunityOverview, CommunityPageDto} from "../../src/models/communityDto";
import {PostWithCommentsDto} from "../../src/models/postDto";
import {useApi} from "../../src/hooks/useApi";
import React from "react";
import {UsersGrid} from "../../src/components/collection/UsersGrid";
import {SortSelectDivider} from "../../src/components/select/Select";

interface CommunityPageProps {
    communityOverview: CommunityPageDto;
}
const CommunityPage: NextPage<CommunityPageProps> = (props: CommunityPageProps) => {
    const {
        communityOverview: community// = communityPageSample
    } = props
    const groupName = useRouter().query.name;
    const {joinCommunity, leaveCommunity} = useApi();
    const [isMemberState, setIsMemberState] = React.useState<boolean>(community.isMember);
    async function join() {
        const isSuccess = await joinCommunity(community.name);
        if(isSuccess) {
            setIsMemberState(true);
        }
    }
    async function leave() {
        const isSuccess = await leaveCommunity(community.name);
        if(isSuccess) {
            setIsMemberState(false);
        }
    }
    return(
        <AppLayout sidebarWidth={'16rem'}>
            {/*<Box bg={'gray.50'} height={'4rem'}/>*/}
            <Box position={'relative'} top={'-4rem'} height={'40rem'}>
                <Image objectFit={'cover'} height={'16rem'} width={'100%'} src={community.photo} alt={''}/>
            </Box>
            <Box position={'relative'} top={'-28rem'}>
            <Box padding={'1rem'} bg={'white'} position={'relative'}>
                <Avatar bottom={'2.5rem'} display={'inline-flex'} size={'2xl'} name={community.name} src={community.photo || undefined}/>
                <Box lineHeight={'1.25'} display={'inline-block'}>
                    <Heading fontWeight={500} textTransform={'capitalize'} marginLeft={'1rem'} fontSize={'2rem'}>{community.name}</Heading>
                    <Box>
                        <Box display={'inline-block'} flexDirection={'column'} alignItems={'center'}>
                            <Text display={'inline-block'} fontWeight={700} fontSize={'1rem'} color={'hsl(0,0%,2%)'}>{community.members.length}</Text>
                            <Text display={'inline-block'} fontSize={'1rem'} color={'hsl(0,0%,29%)'}>{`Members`}</Text>
                        </Box>
                        <Box display={'inline-flex'} flexDirection={'column'} alignItems={'center'}>
                            <Text fontWeight={700} fontSize={'1rem'} color={'hsl(0,0%,2%)'}>{community.posts.length}</Text>
                            <Text fontSize={'1rem'} color={'hsl(0,0%,29%)'}>{`Posts`}</Text>
                        </Box>
                    </Box>
                </Box>
                <Box position={'absolute'} right={'1rem'} display={'inline-block'}>
                    <Button leftIcon={isMemberState ? <MdRemove/> : <MdAdd/>}
                            borderRadius={'0.25rem'}
                            colorScheme={'brand'}
                            variant={isMemberState ? 'outline' : 'solid'}
                            onClick={isMemberState ? () => leave() : () => join()}
                    >
                        {isMemberState ? 'Leave' : 'Join'}
                    </Button>
                </Box>
            </Box>
            <Box>
                <Tabs bg={'white'} size={'lg'}>
                    <TabList>
                        <Tab>Posts</Tab>
                        <Tab>Members</Tab>
                        <Tab>About</Tab>
                    </TabList>
                    <TabPanels bg={'gray.50'} sx={{'&>*': {padding: '1rem 0'}}}>
                        <TabPanel>
                            <Box paddingTop={'2rem'}>
                                <SortSelectDivider/>
                            </Box>
                            <PostsFeed posts={community.posts}/>
                        </TabPanel>
                        <TabPanel>
                            <UsersGrid users={community.members}/>
                        </TabPanel>
                        <TabPanel>
                            <Box>
                                <Text>{community.about}</Text>
                            </Box>
                            {/*<Feed posts={user.comments}/>*/}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
            </Box>
        </AppLayout>
    );
}
export default CommunityPage;

/*export async function getServerSideProps(context: NextPageContext) {
    const username = context.query.username;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/user/${username}`);
    const data: UserOverviewDto = await response.json();
    return  {
        props: {
            userOverview: data
        }
    }
}*/
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
    const communityName = context.query.name;
    const myReq = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/community/${communityName}`, requestInit);
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
    const communityOverview: CommunityPageDto = {
        id: data.id,
        name: data.name,
        about: data.about,
        members: data.members,
        posts: data.posts,
        photo: data.photo || null,
        isMember: data.isMember
    }

    return {
        props: {
            communityOverview: communityOverview
        }
    }
}
