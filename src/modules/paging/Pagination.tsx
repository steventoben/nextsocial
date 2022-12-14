import {FetchPageType, FetchRelativePageType, usePagination} from "./InfiniteScroll";
import {Button, HStack} from "@chakra-ui/react";
import {PostsFeed} from "../feed/Feed";
import React from "react";
import {PostServerResponseDto} from "../../models/postDto";

interface PaginationProps {}
export function Pagination(props: PaginationProps) {
    const {} = props;
    const {getFirstPage, getLastPage, getPreviousPage, getNextPage} = usePagination(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/all`);
    const [posts, setPosts] = React.useState<PostServerResponseDto[]>([]);
    async function getPosts(fetchFn: FetchRelativePageType) {
        const newPosts = await fetchFn();
        setPosts(prevState => prevState.concat(newPosts));
    }
    return(
        <div>
            <PostsFeed posts={posts}/>
            <HStack>
                <Button onClick={() => getPosts(getFirstPage)}>First</Button>
                <Button onClick={() => getPosts(getPreviousPage)}>Prev</Button>
                <Button onClick={() => getPosts(getNextPage)}>Next</Button>
                <Button onClick={() => getPosts(getLastPage)}>Last</Button>
            </HStack>
        </div>
    );
}
