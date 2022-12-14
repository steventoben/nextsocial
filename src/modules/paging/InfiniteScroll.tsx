import {ResponseObject, useFetchHook} from "../../hooks/useFetchHook";
import {PostServerResponseDto} from "../../models/postDto";
import React, {RefObject} from "react";
import {Box, Button, HStack, useUpdateEffect} from "@chakra-ui/react";
import {PostsFeed} from "../feed/Feed";

interface InfiniteScrollProps {}
export function InfiniteScroll(props: InfiniteScrollProps) {
    const {} = props;
    //const {} = useFetchHook<PostServerResponseDto[]>(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/all?page=4`, 'GET', {});
    //const {page, setPage, handleFetch} = usePagination();
    const {getFirstPage, getLastPage, getPreviousPage, getNextPage} = usePagination(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/all`);
    const [posts, setPosts] = React.useState<PostServerResponseDto[]>([]);
    React.useEffect(() => {
        const fetchPosts = async () => {
            const p = await getFirstPage();
            return p;
        }
        const _posts = fetchPosts();
        fetchPosts().then(v => setPosts(v)).catch(reason => console.log(reason));
    }, []);
    async function getPosts(fetchFn: FetchRelativePageType) {
        const newPosts = await fetchFn();
        setPosts(prevState => prevState.concat(newPosts));
    }
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry) => {
            if(entry.isIntersecting) {
                getPosts(getNextPage);
                console.log('Fetch next batch');
            }
        })
    }
    const observer = new IntersectionObserver(observerCallback, {threshold: 0.5, rootMargin: '0% 0% 50% 0%'})
    const targetRef: RefObject<HTMLDivElement> = React.useRef<HTMLDivElement>(null);
    React.useLayoutEffect(() => {
        observer.observe(targetRef.current as Element);
        return () => {
            observer.unobserve(targetRef.current as Element);
        }
    }, []);
    return(
        <div>
            <Box>
            <PostsFeed posts={posts}/>
                <Box ref={targetRef}>target ref</Box>
            </Box>
            <HStack>
                <Button onClick={() => getPosts(getFirstPage)}>First</Button>
                <Button onClick={() => getPosts(getPreviousPage)}>Prev</Button>
                <Button onClick={() => getPosts(getNextPage)}>Next</Button>
                <Button onClick={() => getPosts(getLastPage)}>Last</Button>
            </HStack>
        </div>
    );
}

interface Paginated<T> {
    page: number;//current page
    perPage: number; //limit, count of items on each page, except last page
    pageResults: T[]; //resource items on current page
    totalPages: number; //total count of pages with given limit(perPage)
    totalResults: number; //total count of all items
}
interface Pagination<T> {
    page: number;//current page
    limit: number; //limit, count of items on each page, except last page
    pageResults: T[]; //resource items on current page
    countOfItemsOnPage: number;
    totalPages: number; //total count of pages with given limit(perPage)
    totalResults: number; //total count of all items

}

export interface PaginatedRo<T> {
    totalResults: number; //total posts
    pageCount: number; //total pages
    pageResultsCount: number; //total posts on current page. usually = limit expect last page
    limit?: number;
    page?: number;
    pageResults: T[];
}

//fetch page n, where n is the number variable page, use in url q
export type FetchPageType = (n: number) => Promise<PostServerResponseDto[]>;
//next, prev, first, last
export type FetchRelativePageType = () => Promise<PostServerResponseDto[]>;

export function usePagination(url: string) {
    //const [page, setPage] = React.useState(1);
    //const [limit, setLimit] = React.useState(10);
    const page = React.useRef(1);
    const limit = React.useRef(10);
    const totalItems = React.useRef(0);
    const totalPages = React.useRef(0);
    const {handleFetch, setFetchOptions} = useFetchHook<PaginatedRo<PostServerResponseDto>>(url, 'GET', {
        queryProvider: () => ({
            page: page.current,
            limit: limit.current
        }),
        responseInterceptors: [
            //should only need to do this once, not every fetch like what's happening here,
            // but in case total pages or items value changes,
            // this is will make sure the total values are always accurate
            (response:ResponseObject<PaginatedRo<PostServerResponseDto>>) => {
                totalItems.current = response.data?.totalResults || totalItems.current;
                totalPages.current = response.data?.pageCount || totalPages.current;
            }
        ]
    });

    const getTotalPages: () => number = () => totalPages.current;
    const getTotalItems: () => number = () => totalItems.current;
    const getActivePageValue: () => number = () => page.current;

    const setPage = (p: number): void => {
        page.current = p;
    };
    const setLimit = (l: number): void => {
        limit.current = l;
    };

    const getNextPage: FetchRelativePageType = async () => {
        setPage(page.current + 1);
        //setLimit(15);
        const res = await handleFetch();
        const ro: PaginatedRo<PostServerResponseDto> = res.data;
        return ro.pageResults;
    }
    const getPreviousPage: FetchRelativePageType = async () => {
        setPage(page.current - 1);
        //setLimit(15);
        const res = await handleFetch();
        const ro: PaginatedRo<PostServerResponseDto> = res.data;
        return ro.pageResults;
    }

    const getNthPage: FetchPageType = async (n: number) => {
        setPage(n);
        //setLimit(15);
        const res = await handleFetch();
        const ro: PaginatedRo<PostServerResponseDto> = res.data;
        return ro.pageResults;
    }

    const getFirstPage: FetchRelativePageType = async () => {
        setPage(1);
        //setLimit(15);
        const res = await handleFetch();
        const ro: PaginatedRo<PostServerResponseDto> = res.data;
        return ro.pageResults;
    }
    const getLastPage: FetchRelativePageType = async () => {

        setPage(totalPages.current);
        //setLimit(15);
        const res = await handleFetch();
        const ro: PaginatedRo<PostServerResponseDto> = res.data;
        return ro.pageResults;
    }


    return {
        //page:page.current,
        page,
        setPage,
        handleFetch,
        limit,
        getFirstPage,
        getLastPage,
        getNextPage,
        getPreviousPage,
        getNthPage,
        setLimit
    }
}
