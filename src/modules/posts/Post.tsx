import {PostDto} from "../../models/postDto";
import {Avatar, Box, Flex, HStack, IconButton, Spacer, Text, VStack} from "@chakra-ui/react";
import {MdMoreVert} from "react-icons/md";
import {BiComment, BiLike} from "react-icons/bi";
import {AiFillLike, AiOutlineComment, AiOutlineLike} from "react-icons/ai";
import {FcLike} from "react-icons/fc";
import {GrLike} from "react-icons/gr";
import {SlLike} from "react-icons/sl";


interface PostProps {
    post: PostDto
    showComments: () => void;
    commentsOpen: boolean;
}
export function Post(props: PostProps) {
    const {
        post,
        showComments,
        commentsOpen
    } = props;
    return(
        <Box sx={commentsOpen ? {backgroundColor: 'white', zIndex: '2000'} : {}} maxWidth={'40rem'} padding={'1rem'} borderRadius={'0.25rem'}
            boxShadow={'0 1px 2px 1px hsla(0,0%,10%,10%)'}/*boxShadow={'0 2px 5px 0 hsla(0,0%,10%,40%)'}*/>
            <Flex as={'header'} justifyContent={'space-between'} alignItems={'center'}>
                <HStack spacing={'1rem'}>
                    <Avatar size={'md'} name={post.author.username} src={post.author.avatar}/>
                    <VStack spacing={0} alignItems={'start'}>
                        <Text >{post.author.username}</Text>
                        <Text fontSize={'0.75rem'}>{post.createdAtTime}</Text>
                    </VStack>
                </HStack>
                <IconButton aria-label={''} icon={<MdMoreVert/>} bg={'white'}/>
            </Flex>
            <Spacer height={'1rem'}/>
            <Box padding={'0 1rem 0 4rem'}>
                <Text>{post.content}</Text>
            </Box>
            <Box>

            </Box>
            <Spacer height={'1rem'}/>
            <Flex>
                <IconButton bg={'white'} aria-label={''} icon={<AiOutlineLike/>}/>
                <IconButton onClick={showComments} bg={'white'} aria-label={''} icon={<AiOutlineComment/>}/>
            </Flex>
        </Box>
    );
}
