import {NextPage, NextPageContext} from "next";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {CreatePostWidget} from "../../src/modules/feed/CreatePostWidget";
import {Feed, PostsFeed} from "../../src/modules/feed/Feed";
import {Box} from "@chakra-ui/react";
import React from "react";
import {PostServerResponseDto, PostWithCommentsDto} from "../../src/models/postDto";
import {createPostWithCommentsSamples} from "../../src/data/samples";
import {useFetchHook} from "../../src/hooks/useFetchHook";
import {ServerCommentDto} from "../../src/models/commentDto";
import {SortBySelect, sortOptions, SortSelectDivider} from "../../src/components/select/Select";
import {InfiniteScroll} from "../../src/modules/paging/InfiniteScroll";

interface FeedPageProps {
    posts: PostServerResponseDto[]//PostWithCommentsDto[];
}

const FeedPage: NextPage<FeedPageProps> = (props: FeedPageProps) => {
    const {
        posts //= createPostWithCommentsSamples(5)
    } = props;
    return(
        <AppLayout sidebarWidth={'16rem'}>
            <title>Your feed</title>
            {/*<InfiniteScroll/>*/}
            <Box maxWidth={'80ch'} margin={'0 auto'} /*width={'max-content'} margin={'0 auto'} maxWidth={'100%'}*/>
                <CreatePostWidget/>
                {/*<SortBySelect options={sortOptions}/>*/}
                <SortSelectDivider/>
                <PostsFeed posts={posts} />
            </Box>
        </AppLayout>
    );
}
export default FeedPage;

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
    //const myReq = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/all?page=4`, requestInit);
    const myReq = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/my-feed`, requestInit);
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
    /*const count = data.pageResultsCount;
    const posts: PostWithCommentsDto[] = [];
    for (let i = 0; i < count; i++) {
        const post: PostWithCommentsDto = transformPostFull(data.pageResults[i]);
        console.log(post);
        posts.push(post);
    }*/
    //console.log(posts);
    return {
        props: {
            posts: data//.pageResults
        }
    }
}
export function transformPostFull(_post: PostServerResponseDto) {
    const transformedPost: PostWithCommentsDto = {
        slug: _post.slug,
        title: _post.name,
        content: _post.content,
        author: {
            username: _post.author.username,
            avatar: _post.author.avatar ? `${process.env.NEXT_PUBLIC_CDN_DOMAIN}/${_post.author?.avatar?.key}` : ''
        },
        media: _post.attachments.map((item:{url:string}) => item.url),
        community: _post.community ? _post.community.name : '',
        topics: _post.categories?.map((item: { name: string; }) => item.name),
        createdAtTime: _post.createdAt,
        favoriteCount: _post.favoriteCount,
        comments: _post.comments.map((comment: ServerCommentDto) => {
            return {
                id: comment.id,
                content: comment.content,
                commenter: {
                    ...comment.commenter,
                    avatar: comment.commenter.avatar ? `${process.env.NEXT_PUBLIC_CDN_DOMAIN}/${comment.commenter?.avatar?.key}` : ''
                },
                createdAt: comment.createdAt
            }
        })
    }
    return transformedPost;
    /*return {
        slug: _post.slug,
        title: _post.name,
        content: _post.content,
        author: {
            username: _post.author.username,
            avatar: _post.author.avatar ? `${process.env.NEXT_PUBLIC_CDN_DOMAIN}/${_post.author?.avatar?.key}` : ''
        },
        media: _post.attachments?.map((item: { key: string; }) => `${process.env.NEXT_PUBLIC_CDN_DOMAIN}/${item.key}`),
        community: _post.community?.name,
        topics: _post.categories?.map((item: { name: string; }) => item.name),
        createdAtTime: _post.createdAt,
        favoriteCount: _post.favoriteCount,
        comments: _post.comments.map((comment: ServerCommentDto) => {
            return {
                id: comment.id,
                content: comment.content,
                commenter: {
                    ...comment.commenter,
                    avatar: comment.commenter.avatar ? `${process.env.NEXT_PUBLIC_CDN_DOMAIN}/${comment.commenter?.avatar?.key}` : ''
                },
                createdAt: comment.createdAt
            }
        })
    };*/
}
export const myFetcher = (args: RequestInfo | URL, authToken?: string) => {
    //const authToken = localStorage.getItem('token');
    //const authToken = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin': `${process.env.REACT_APP_BASE_DOMAIN}`,
        'Access-Control-Allow-Origin': '*',
        //'Authorization': `Bearer ${authToken}`
    };
    if(authToken) {
        Object.defineProperty(headers, 'Authorization', {value: `Bearer ${authToken}`})
    }
    const reqHeaders: Headers = new Headers(headers);
    const requestInit: RequestInit = {
        method: 'GET',
        headers: reqHeaders,
        //body: body,
        mode: "cors",
        redirect: "follow",
        credentials: 'include'
    };
    const myReq = new Request(args, requestInit);
    return fetch(myReq).then(res => res.json());
}
