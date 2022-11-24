import {NextPage, NextPageContext} from "next";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {useRouter} from "next/router";
import {PostServerResponseDto, PostWithCommentsDto} from "../../src/models/postDto";
import {createPostWithCommentsSamples} from "../../src/data/samples";
import {Box, Heading} from "@chakra-ui/react";
import {Feed, PostsFeed} from "../../src/modules/feed/Feed";
import {CommunityWithMembershipDto} from "../../src/models/communityDto";
import {SortSelectDivider} from "../../src/components/select/Select";
import React from "react";

interface TopicPageProps {
    posts: PostServerResponseDto[];
}
const TopicPage: NextPage<TopicPageProps> = (props: TopicPageProps) => {
    const {
        posts //= createPostWithCommentsSamples(5)
    } = props;
    const topicName = useRouter().query.topic;
    return(
        <AppLayout sidebarWidth={'16rem'}>
            <Box maxWidth={'80ch'} margin={'0 auto'}>
            <Box padding={'2rem 2rem 2rem 0'}>
                <Heading as={'h1'} sx={{
                    fontFamily: 'Gilroy-SemiBold'
                }}>
                    {`Posts with topic `}
                    <Box
                        as={'span'}
                        sx={{
                            bg: 'blue.500',
                            //border: '1px solid blue',
                            padding: '0.5rem',
                            borderRadius: '0.75rem',
                            color: 'white'
                        }}
                    >#{topicName}</Box>
                </Heading>
            </Box>
            <Box>
                <Box paddingTop={'2rem'}>
                    <SortSelectDivider/>
                </Box>
                <PostsFeed posts={posts} />
            </Box>
            </Box>
        </AppLayout>
    );
}
export default TopicPage;

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
    const topic = context.query.topic;
    const myReq = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/tag/${topic}`, requestInit);
    console.log(myReq);
    const reqData = await fetch(myReq);
    console.log(reqData);
    const data = await reqData.json();
    //const data = myFetcher(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/all?page=4`, token);
    console.log(data);
    const posts: PostServerResponseDto[] = data;
    console.log(posts);
    return {
        props: {
            posts: posts
        }
    }
}
