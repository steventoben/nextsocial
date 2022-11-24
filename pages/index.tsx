import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {Post} from "../src/modules/posts/Post";
import {createPostSamples, createPostWithCommentsSamples, samplePost} from "../src/data/samples";
import {FeedWithDrawer} from "../src/modules/feed/FeedWithDrawer";
import {PostDto, PostWithCommentsDto} from "../src/models/postDto";
import {AppLayout} from "../src/modules/layout/AppLayout";
import {Feed} from "../src/modules/feed/Feed";
import {CreatePostWidget} from "../src/modules/feed/CreatePostWidget";
import {Box} from "@chakra-ui/react";
import React from "react";
import {NextPageContext} from "next";

const posts: PostDto[] = createPostSamples(10);

const postsWithComments: PostWithCommentsDto[] = createPostWithCommentsSamples(10);

export default function Home() {
    return (
    <AppLayout sidebarWidth={'16rem'}>
        <Box maxWidth={'80ch'} margin={'0 auto'} /*width={'max-content'} margin={'0 auto'} maxWidth={'100%'}*/>
            <CreatePostWidget/>
            <Feed posts={postsWithComments} />
        </Box>
        {/*<FeedWithDrawer posts={posts}/>*/}
    </AppLayout>
  )
}

/*export async function getServerSideProps(context: NextPageContext) {

}*/
