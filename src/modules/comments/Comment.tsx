import {CommentDto, ServerCommentDto} from "../../models/commentDto";
import {Avatar, Box, Flex, HStack, IconButton, Text, VStack} from "@chakra-ui/react";
import {MdMoreVert} from "react-icons/md";
import React from "react";
import {getAvatar} from "../../../pages/user/[username]";


interface PostCommentProps {
    comment: ServerCommentDto;
    isOwner?: boolean;
}
export function PostComment(props: PostCommentProps) {
    const {
        comment,
        isOwner
    } = props;
    //const isOwner: boolean = React.useMemo(() => (comment.commenterId===0), []);
    return (
        <Box padding={'1rem 0'} position={'relative'}>
            {isOwner && <div>owner</div>}
            <Flex as={'header'} justifyContent={'space-between'} alignItems={'center'}>
                <HStack spacing={'1rem'} width={'100%'} alignItems={'flex-start'}>
                    <Avatar size={'sm'} name={comment.commenter?.username} src={comment.commenter?.avatar.url || undefined}/>
                    <Flex alignItems={'center'} justifyContent={'space-between'} width={'100%'} marginBottom={'1rem'}>
                        <Text alignSelf={'flex-start'} fontSize={'0.875rem'} fontWeight={'700'}>{comment.commenter?.username}</Text>
                        <Text fontSize={'0.75rem'} fontWeight={'400'}>{comment.createdAt}</Text>
                    </Flex>
                    {/*<Text alignSelf={'flex-start'} fontSize={'0.875rem'} fontWeight={'400'}>{comment.content}</Text>*/}
                    {/*<Text fontSize={'0.75rem'}>{comment.createdAt}</Text>*/}
                </HStack>
                {/*<IconButton aria-label={''} icon={<MdMoreVert/>} bg={'white'}/>*/}
            </Flex>
            <Box paddingLeft={'3rem'} position={'relative'} bottom={'0.5rem'}>
                <Text fontFamily={'Helvetica Neue'} fontWeight={400} fontSize={'1rem'} lineHeight={1.6} color={'rgba(22,25,27,0.85)'}>{comment.content}</Text>
            </Box>
        </Box>
    );
}
interface CommentProps {
    comment: CommentDto
}
export function Comment(props: CommentProps) {
    const {
        comment
    } = props;
    const format1 = (
        <Box padding={'1rem 0'}>
            <Flex as={'header'} justifyContent={'space-between'} alignItems={'center'}>
                <HStack spacing={'1rem'}>
                    <Avatar alignSelf={'flex-start'} size={'sm'} name={comment.commenter.username} src={getAvatar(comment.commenter.avatar)}/>
                    <VStack spacing={0} alignItems={'start'}>
                        <Flex alignItems={'center'} justifyContent={'space-between'} width={'100%'} >
                            <Text alignSelf={'flex-start'} fontSize={'0.875rem'} fontWeight={'700'}>{comment.commenter.username}</Text>
                            <Text fontSize={'0.75rem'} fontWeight={'400'}>{comment.createdAt}</Text>
                        </Flex>
                        <Text alignSelf={'flex-start'} fontSize={'0.875rem'} fontWeight={'400'}>{comment.content}</Text>
                    </VStack>
                </HStack>
            </Flex>
        </Box>
    );
    const format2 = (
        <Box padding={'1rem 0'} position={'relative'}>
            <Flex as={'header'} justifyContent={'space-between'} alignItems={'center'}>
                <HStack spacing={'1rem'} width={'100%'} alignItems={'flex-start'}>
                    <Avatar size={'sm'} name={comment.commenter.username} src={getAvatar(comment.commenter.avatar)}/>
                    <Flex alignItems={'center'} justifyContent={'space-between'} width={'100%'} marginBottom={'1rem'}>
                        <Text alignSelf={'flex-start'} fontSize={'0.875rem'} fontWeight={'700'}>{comment.commenter.username}</Text>
                        <Text fontSize={'0.75rem'} fontWeight={'400'}>{comment.createdAt}</Text>
                    </Flex>
                        {/*<Text alignSelf={'flex-start'} fontSize={'0.875rem'} fontWeight={'400'}>{comment.content}</Text>*/}
                        {/*<Text fontSize={'0.75rem'}>{comment.createdAt}</Text>*/}
                </HStack>
                {/*<IconButton aria-label={''} icon={<MdMoreVert/>} bg={'white'}/>*/}
            </Flex>
            <Box paddingLeft={'3rem'} position={'relative'} bottom={'0.5rem'}>
                <Text fontFamily={'Helvetica Neue'} fontWeight={400} fontSize={'1rem'} lineHeight={1.6} color={'rgba(22,25,27,0.85)'}>{comment.content}</Text>
            </Box>
        </Box>
    );
    return format2;
    return(
        <Box padding={'1rem 0'}>
            <Flex as={'header'} justifyContent={'space-between'} alignItems={'center'}>
                <HStack spacing={'1rem'}>
                    <Avatar alignSelf={'flex-start'} size={'sm'} name={comment.commenter.username} src={getAvatar(comment.commenter.avatar)}/>
                    <VStack spacing={0} alignItems={'start'}>
                        <Flex alignItems={'center'} justifyContent={'space-between'} width={'100%'} >
                            <Text alignSelf={'flex-start'} fontSize={'0.875rem'} fontWeight={'700'}>{comment.commenter.username}</Text>
                            <Text fontSize={'0.75rem'} fontWeight={'400'}>{comment.createdAt}</Text>
                        </Flex>
                        <Text alignSelf={'flex-start'} fontSize={'0.875rem'} fontWeight={'400'}>{comment.content}</Text>
                        {/*<Text fontSize={'0.75rem'}>{comment.createdAt}</Text>*/}
                    </VStack>
                </HStack>
                {/*<IconButton aria-label={''} icon={<MdMoreVert/>} bg={'white'}/>*/}
            </Flex>
            {/*<Box paddingLeft={'3rem'}>
                <Text>{comment.content}</Text>
            </Box>*/}
        </Box>
    );
}
