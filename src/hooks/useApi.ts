import {ResponseObject, useFetchHook} from "./useFetchHook";

enum ResponseCodes {
    Ok = 200,
    Created = 201,
    NoContent = 204
}
const ops = {
    GET: ResponseCodes.Ok,
    POST: ResponseCodes.Created,
    PUT: ResponseCodes.Ok, //or NoContent
    PATCH: ResponseCodes.NoContent, //or OK
    DELETE: ResponseCodes.NoContent
};

export function useApi() {
    const {handleFetch, setFetchOptions} = useFetchHook(`${process.env.NEXT_PUBLIC_BACKEND_API}/users`, 'GET', {
        responseInterceptors: [

        ]
    });
    /*function unfavoritePost(postId: number) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/posts/${postId}/favorite`,
            method: 'DELETE'
        });
        handleFetch();
    }
    const likePost = React.useCallback((postId: number) => {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/posts/${postId}/favorite`,
            method: 'POST'
        });
        handleFetch();
    }, []);*/

    /*async function favoritePost(postId: number) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/posts/${postId}/favorite`,
            method: 'POST'
        });
        await handleFetch();
    }*/
    async function favoritePost(slug: string) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/posts/${slug}/favorite`,
            method: 'POST'
        });
        const res = await handleFetch();
        return res.raw.status === 201;
    }
    async function unfavoritePost(slug: string) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/posts/${slug}/favorite`,
            method: 'DELETE'
        });
        const res = await handleFetch();
        return res.raw.status === 200; //TODO change api to 204
    }
    async function follow(username: string) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/users/${username}/follow`,
            method: 'POST'
        });
        const res: ResponseObject<any> = await handleFetch();
        return res.raw.status === 201;
    }
    async function unfollow(username: string) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/users/${username}/follow`,
            method: 'DELETE'
        });
        const res: ResponseObject<any> = await handleFetch();
        return res.raw.status === 200;
    }
    async function joinCommunity(name: string) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/community/${name}`,
            method: 'POST'
        });
        const res = (await handleFetch()) as ResponseObject<any>;
        return res.raw.status === 201;
    }
    async function leaveCommunity(name: string) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/community/${name}`,
            method: 'DELETE'
        });
        const res = (await handleFetch()) as ResponseObject<any>;
        return res.raw.status === 200;
    }

    async function createComment(postSlug: string, content: string) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/posts/${postSlug}/comment`,
            method: 'POST',
            body: JSON.stringify({content: content})
        });
        await handleFetch();
    }

    async function removeComment(commentId: number) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/comments/${commentId}`,
            method: 'DELETE'
        });
        await handleFetch();
    }

    async function removePost(slug: string) {
        setFetchOptions({
            url: `${process.env.NEXT_PUBLIC_BACKEND_API}/posts/${slug}`,
            method: 'DELETE'
        });
        await handleFetch();
    }

    return {
        favoritePost,
        unfavoritePost,
        createComment,
        removeComment,
        removePost,
        follow,
        unfollow,
        joinCommunity,
        leaveCommunity
    }
}
