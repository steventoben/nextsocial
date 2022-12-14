import {PostServerResponseDto, PostWithCommentsDto} from "../../models/postDto";
import {Box, VStack} from "@chakra-ui/react";
import {FormattedPostWithComments, PostWithComments} from "../posts/PostWithComments";
import {CreatePostWidget} from "./CreatePostWidget";
import React from "react";
import {useAuthentication} from "../auth/AuthenticationProvider";
import {BackToTopButton} from "../../components/button/BackToTopButton";
//import {AppContext} from "../layout/AppLayout";

interface FeedProps {
    posts: PostWithCommentsDto[];
}
export function Feed(props: FeedProps) {
    const {
        posts
    } = props;
    //const {isMobile, isDesktop} = React.useContext(AppContext);

    return(
        <Box width={'100%'}  /*margin={isDesktop ? '0 auto' : '0'} width={isDesktop ? 'max-content':'100%'} maxWidth={isDesktop?'100%':'100%'}*/>

            <VStack alignItems={'stretch'} spacing={'2rem'}>
                {posts.map((post) => {
                    return(
                        <PostWithComments post={post} key={post.slug}/>
                    );
                })}
            </VStack>
        </Box>
    );
}
interface PostsFeedProps {
    posts: PostServerResponseDto[];
}
export function PostsFeed(props: PostsFeedProps) {
    const {
        posts
    } = props;
    //const {isMobile, isDesktop} = React.useContext(AppContext);

    return(
        <Box width={'100%'}  /*margin={isDesktop ? '0 auto' : '0'} width={isDesktop ? 'max-content':'100%'} maxWidth={isDesktop?'100%':'100%'}*/>
            <VStack alignItems={'stretch'} spacing={'2rem'}>
                {posts.map((post) => {
                    return(
                        <FormattedPostWithComments post={post} key={`${post.slug}__${post.id}`}/>
                    );
                })}
            </VStack>
            <BackToTopButton/>
        </Box>
    );
}
