import {NextPage, NextPageContext} from "next";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {PostServerResponseDto, PostWithCommentsDto} from "../../src/models/postDto";
import {createPostWithCommentsSamples, fullPostPageSample, samplePost} from "../../src/data/samples";
import {
    Avatar,
    Box,
    Collapse,
    Divider,
    Flex,
    HStack,
    IconButton, Input,
    InputGroup, InputRightAddon,
    Spacer,
    Tag,
    Text,
    VStack
} from "@chakra-ui/react";
import Link from "next/link";
import {AiOutlineComment, AiOutlineLike} from "react-icons/ai";
import {Comment, PostComment} from "../../src/modules/comments/Comment";
import {MdSend} from "react-icons/md";
import React from "react";
import {useRouter} from "next/router";
import {ProfilePageDataDto} from "../../src/models/userDto";
import {CommentTextbox} from "../../src/modules/comments/CommentTextbox";
import {ServerCommentDto} from "../../src/models/commentDto";
import {useApi} from "../../src/hooks/useApi";
import {useAuthentication} from "../../src/modules/auth/AuthenticationProvider";

interface PostPageProps {
    post: PostServerResponseDto;//PostWithCommentsDto;
}

const PostPage: NextPage<PostPageProps> = (props: PostPageProps) => {
    const {
        post //= fullPostPageSample
    } = props;
    const postSlug = useRouter().query.slug;
    const [postedComments, setPostedComments] = React.useState<ServerCommentDto[]>([...post.comments]);
    const {getCurrentUser} = useAuthentication();
    const isOwner: boolean = React.useMemo(() => post.author.username===getCurrentUser().username, []);
    function getComment(c: {content: string}) {
        const {content} = c;
        const comment: ServerCommentDto = {
            id: -(postedComments.length+1),
            content: content,
            commenterId: getCurrentUser().id,
            commenter: {
                username: getCurrentUser().username,
                avatar: {
                    id: -(postedComments.length),
                    key: '',
                    url: getCurrentUser().avatar
                }
            },
            createdAt: new Date().toISOString()
        };
        setPostedComments((prevState) => {
            return prevState.concat(comment);
        });
    }
    return(
        <AppLayout sidebarWidth={'16rem'}>
            <Box /*maxWidth={'40rem'}*/ padding={'1rem'} borderRadius={'0.25rem'}
                                        backgroundColor={'white'}
                                        boxShadow={'0 0px 2px 1px hsla(0,0%,10%,15%)'}/*boxShadow={'0 2px 5px 0 hsla(0,0%,10%,40%)'}*/>
                <Flex as={'header'} justifyContent={'space-between'} alignItems={'center'}>
                    <Link href={`/user/${post.author.username}`} >
                        <HStack spacing={'1rem'}>
                            <Avatar size={'md'} name={post.author?.username} src={post.author.avatar?.url || undefined}/>
                            <VStack spacing={0} alignItems={'start'}>
                                <Text fontWeight={600}>{post.author.username}</Text>
                                <Text fontSize={'0.75rem'}>{post.createdAt}</Text>
                            </VStack>
                        </HStack>
                    </Link>
                    {/*<PostContextMenu post={post}/>*/}
                    {/*<IconButton aria-label={''} icon={<MdMoreVert/>} bg={'white'}/>*/}
                </Flex>
                <Spacer height={'1rem'}/>
                <Box padding={'0 1rem 0 4rem'}>
                    <Text>{post.content}</Text>
                </Box>
                <Spacer height={'1rem'}/>
                <Box >
                    {post.categories.map((topic) => {
                        return(
                            <Link key={topic.id} href={`/topic/${topic.name.toLowerCase()}`}>
                                <Tag>
                                    {topic.name}
                                </Tag>
                            </Link>
                        );
                    })}
                </Box>
                <Spacer height={'1rem'}/>
                <Flex>
                    <Box>
                        <IconButton bg={'white'} aria-label={''} icon={<AiOutlineLike/>}/>
                    </Box>
                    <Box display={'inline-flex'} alignItems={'center'} justifyContent={'flex-start'} position={'relative'}>
                        <IconButton zIndex={'0'} bg={'white'} aria-label={''} icon={<AiOutlineComment/>}/>
                        <Text zIndex={'1'} marginLeft={'-0.25rem'} fontSize={'0.875rem'} fontWeight={400}>{post.comments.length}</Text>
                    </Box>
                </Flex>
                <Spacer height={'1rem'}/>
                <Divider/>
                    <Box padding={'1rem'}>
                        {/*<VStack spacing={'2rem'} alignItems={'flex-start'} justifyContent={'stretch'} width={'100%'}>*/}
                        {postedComments.map((comment) => {
                            return(
                                <PostComment isOwner={comment.commenter.username===getCurrentUser().username} comment={comment} key={comment.id} />
                            );
                        })}
                        {/*</VStack>*/}
                    </Box>
                    <Divider/>
                    <Spacer height={'1rem'}/>
                    <Box paddingLeft={'4rem'}>
                        <CommentTextbox getNewComment={getComment} slug={post.slug}/>
                       {/* <InputGroup>
                            <Input borderRadius={0} padding={'0 1rem'}/>
                            <InputRightAddon padding={'0'}>
                                <IconButton bg={'white'} borderRadius={0} border={'inherit'} aria-label={''} icon={<MdSend/>}/>
                            </InputRightAddon>
                        </InputGroup>*/}
                    </Box>
            </Box>
        </AppLayout>
    );
}
export default PostPage;
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
    const postSlug = context.query.slug;
    const myReq = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/post/${postSlug}`, requestInit);
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


    return {
        props: {
            post: data
        }
    }
}
