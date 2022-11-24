import {NextPage, NextPageContext} from "next";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {useRouter} from "next/router";
import {Box, Heading, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import {PostsFeed} from "../../src/modules/feed/Feed";
import {PostServerResponseDto} from "../../src/models/postDto";
import {UserDto} from "../../src/models/userDto";
import {CommunityDto} from "../../src/models/communityDto";
import {UsersGrid} from "../../src/components/collection/UsersGrid";
import {CommunityGrid} from "../../src/components/collection/CommunityGrid";

interface SearchPageProps {
    searchResponse: SearchResponseDto;
}
const SearchPage: NextPage<SearchPageProps> = (props: SearchPageProps) => {
    const {
        searchResponse
    } = props;
    const searchQuery = useRouter().query;
    return(
        <AppLayout sidebarWidth={'16rem'}>
            <Box maxWidth={'80ch'} margin={'0 auto'}>
                <Box padding={'2rem 2rem 2rem 0'}>
                    <Heading as={'h1'} sx={{
                        fontFamily: 'Gilroy-Bold'
                    }}>
                        {`Search results for `}
                        <Box
                            as={'span'}
                            sx={{
                                //bg: 'blue.500',
                                //border: '1px solid blue',
                                borderBottom: '2px solid blue',
                                padding: '0.25rem',
                                borderRadius: '0.25rem',
                            }}
                        >{searchQuery.q}</Box>
                    </Heading>
                </Box>
                <Box>
                    <Tabs>
                        <TabList>
                            <Tab>Posts</Tab>
                            <Tab>Users</Tab>
                            <Tab>Groups</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <PostsFeed posts={searchResponse.posts} />
                            </TabPanel>
                            <TabPanel>
                                <UsersGrid users={searchResponse.users} />
                            </TabPanel>
                            <TabPanel>
                                <CommunityGrid communities={searchResponse.communities.map((c) => ({...c, photo: c.photo||undefined}))} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>

                </Box>
            </Box>
        </AppLayout>
    );
}
export default SearchPage;
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
    const query = context.query.q;
    const myReq = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/search?q=${query}`, requestInit);
    console.log(myReq);
    const reqData = await fetch(myReq);
    console.log(reqData);
    const data = await reqData.json();
    //const data = myFetcher(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/all?page=4`, token);
    console.log(data);
    console.log('POSTS: *********');
    const posts: PostServerResponseDto[] = data.posts;
    console.log(posts);
    return {
        props: {
            searchResponse: data
        }
    }
}
interface SearchResponseDto {
    posts: PostServerResponseDto[];
    users: UserDto[];
    communities: CommunityDto[]
}
