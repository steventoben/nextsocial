import {GetStaticPropsContext, NextPage, NextPageContext} from "next";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {Box, Button, Flex, Heading, Spacer} from "@chakra-ui/react";
import {CommunityCardDto, CommunityPageDto, CommunityWithMembershipDto} from "../../src/models/communityDto";
import {createCommunityWithMembershipSamples} from "../../src/data/samples";
import {CommunityCard} from "../../src/components/cards/CommunityCard";

interface CommunitiesPageProps {
    userGroups: CommunityCardDto[];
}
const CommunitiesPage: NextPage<CommunitiesPageProps> = (props: CommunitiesPageProps) => {
    const {
        userGroups// = createCommunityWithMembershipSamples(3)
    } = props;
    return(
        <AppLayout sidebarWidth={'16rem'}>
            <Box maxWidth={'80ch'} margin={'0 auto'}>
                <Box>
                    <Flex justifyContent={'space-between'} alignItems={'center'}>
                        <Heading>Communities</Heading>
                        <Button>Create a group</Button>
                    </Flex>
                </Box>
                <Spacer height={'2rem'}/>
                <Box  maxWidth={'revert'} bg={'white'} position={'absolute'} width={'100%'} left={0}>
                <Box paddingTop={'2rem'} maxWidth={'80ch'} margin={'0 auto'}>
                    <Flex justifyContent={'space-between'} alignItems={'center'}>
                        <Heading fontFamily={'Helvetica Neue'} size={'lg'}>Your Groups</Heading>
                        <Button variant={'text'}>View all</Button>
                    </Flex>
                    <Spacer height={'1rem'}/>
                    <Box display={'grid'} gridTemplateColumns={'repeat(auto-fill, minmax(16rem, 1fr))'} gap={'1rem'}>
                        {userGroups.map((group) => {
                            return(
                                <CommunityCard key={group.id} community={group}/>
                            );
                        })}
                    </Box>
                </Box>
                </Box>
            </Box>
        </AppLayout>
    );
}
export default CommunitiesPage;

export async function getServerSideProps(context: NextPageContext) {
    // @ts-ignore
    const token = context.req?.cookies['Authentication'];
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
    //const communityName = context.query.name;
    const myReq = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/me/communities`, requestInit);
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
    const userCommunities: CommunityWithMembershipDto[] = data;
    console.log(userCommunities);
    return {
        props: {
            userGroups: userCommunities
        }
    }
}
