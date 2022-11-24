import {
    Accordion,
    AccordionItem,
    AccordionPanel,
    AlertDialog,
    AlertDialogBody, AlertDialogContent,
    AlertDialogFooter, AlertDialogHeader,
    AlertDialogOverlay,
    AspectRatio,
    Avatar,
    Box,
    Button,
    Collapse,
    Divider,
    Flex,
    HStack,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputRightAddon,
    InputRightElement,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Tag,
    Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {MdMoreVert, MdSend} from "react-icons/md";
import {AiFillLike, AiOutlineComment, AiOutlineLike} from "react-icons/ai";
import {PostServerResponseDto, PostWithCommentsDto} from "../../models/postDto";
import {Comment, PostComment} from "../comments/Comment";
import React from "react";
import Link from "next/link";
import {GalleryImage, GalleryItem, ImageGallery} from "../gallery/ImageGallery";
import {getTimeSince, parseDateString} from "../../utils/dateUtils";
import {useAuthentication} from "../auth/AuthenticationProvider";
import {useApi} from "../../hooks/useApi";
import {ImageGrid} from "../gallery/ImageGrid";
import {GradientOverlay} from "../../components/utils/GradientOverlay";

function PostContextMenu( props: { post: PostWithCommentsDto } ) {
    return(
        <Menu>
            <MenuButton>
                <IconButton aria-label={''} icon={<MdMoreVert/>} bg={'white'}/>
            </MenuButton>
            <MenuList>
                <MenuItem>
                    <Link href={`/community/${props.post.community}`}>
                        {`View '${props.post.community}' group`}
                    </Link>
                </MenuItem>
            </MenuList>
        </Menu>
    );
}

interface PostWithCommentsProps {
    post: PostWithCommentsDto;
}
export function PostWithComments(props: PostWithCommentsProps) {
    const {
        post
    } = props;
    const [isCommentsExpanded, setIsCommentsExpanded] = React.useState<boolean>(false);
    const toggleCommentsExpanded = () => setIsCommentsExpanded((v: boolean) => !v);
    return(
        <Box /*maxWidth={'40rem'}*/ padding={'1rem'} borderRadius={'0.25rem'}
             backgroundColor={'white'}
             boxShadow={'0 0px 2px 1px hsla(0,0%,10%,15%)'}/*boxShadow={'0 2px 5px 0 hsla(0,0%,10%,40%)'}*/>
            <Flex as={'header'} justifyContent={'space-between'} alignItems={'center'}>
                <Link href={`/user/${post.author.username}`} >
                <HStack spacing={'1rem'}>
                    <Avatar size={'md'} name={post.author.username} src={post.author.avatar}/>
                    <VStack spacing={0} alignItems={'start'}>
                        <Text fontWeight={600}>{post.author.username}</Text>
                        <Text fontSize={'0.75rem'}>{post.createdAtTime}</Text>
                    </VStack>
                </HStack>
                </Link>
                <PostContextMenu post={post}/>
                {/*<IconButton aria-label={''} icon={<MdMoreVert/>} bg={'white'}/>*/}
            </Flex>
            <Spacer height={'1rem'}/>
            <Box padding={'0 1rem 0 4rem'}>
                <Text>{post.content}</Text>
            </Box>
            {post.media.length
            && <>
                <Spacer height={'1rem'}/>
                <Box>
                    <ImageGallery>
                        {post.media.map((image, index) => {
                            return(
                                <GalleryItem key={image.concat(index.toString())}>
                                    <Image src={image} alt={post.title} />
                                </GalleryItem>
                            );
                        })}
                    </ImageGallery>
                </Box>
            </>}
            <Spacer height={'1rem'}/>
            <Box >
                {post.topics.map((topic) => {
                    return(
                        <Link key={topic} href={`/topic/${topic}`}>
                            <Tag>
                                {topic}
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
                <Link href={`/post/${post.slug}`}>
                <Box display={'inline-flex'} alignItems={'center'} justifyContent={'flex-start'} position={'relative'}>
                    <IconButton zIndex={'0'} onClick={toggleCommentsExpanded} bg={'white'} aria-label={''} icon={<AiOutlineComment/>}/>
                    <Text zIndex={'1'} marginLeft={'-0.25rem'} fontSize={'0.875rem'} fontWeight={400}>{post.comments.length}</Text>
                </Box>
                </Link>
            </Flex>
            <Spacer height={'1rem'}/>
            <Divider/>
            <Collapse in={isCommentsExpanded}>

            <Box padding={'1rem'}>
                {/*<VStack spacing={'2rem'} alignItems={'flex-start'} justifyContent={'stretch'} width={'100%'}>*/}
                {post.comments.map((comment) => {
                    return(
                        <Comment comment={comment} key={comment.id} />
                    );
                })}
                {/*</VStack>*/}

            </Box>
            <Divider/>
            <Spacer height={'1rem'}/>



            <Box paddingLeft={'4rem'}>
                <InputGroup>
                    <Input borderRadius={0} padding={'0 1rem'}/>
                    <InputRightAddon padding={'0'}>
                        <IconButton bg={'white'} borderRadius={0} border={'inherit'} aria-label={''} icon={<MdSend/>}/>
                    </InputRightAddon>
                </InputGroup>
            </Box>

            </Collapse>
        </Box>
    );
}


interface FormattedPostWithCommentsProps {
    post: PostServerResponseDto;
    isOwner?: boolean;
}
export function FormattedPostWithComments(props: FormattedPostWithCommentsProps) {
    const {
        post,
        //isOwner = false
    } = props;
    React.useEffect(() => {
        getTimeSince(post.createdAt);
    }, []);
    //const [isCommentsExpanded, setIsCommentsExpanded] = React.useState<boolean>(false);
    //const toggleCommentsExpanded = () => setIsCommentsExpanded((v: boolean) => !v);
    const [isFavorited, setIsFavorited] = React.useState<boolean>(post.isFavorited||false);
    const {getCurrentUser} = useAuthentication();
    const {favoritePost, unfavoritePost} = useApi();
    async function toggleFavorite() {
        const action = isFavorited ? unfavoritePost : favoritePost;
        const success = await action(post.slug);
        //console.log(action.name);
        if(success) {
            console.log('success', success, isFavorited);
            setIsFavorited(!isFavorited); //use explicit state value instead of prevState callback because action is based off of explicit state value
        }

        /*if(isFavorited) {
            const isSuccessful = await unfavoritePost(post.slug);
            if(isSuccessful) {
                setIsFavorited(false);
            }
        } else {
            const isSuccessful = await favoritePost(post.slug);
            if(isSuccessful) {
                setIsFavorited(true);
            }
        }*/
    }
    const isOwner: boolean = React.useMemo(
        () => {
            return (post.author.username===getCurrentUser().username);
        },[getCurrentUser, post.author.username]);
    return(
        <Box /*maxWidth={'40rem'}*/ padding={'1rem'} borderRadius={'0.25rem'}
                                    backgroundColor={'white'}
                                    boxShadow={'0 0px 2px 1px hsla(0,0%,10%,15%)'}/*boxShadow={'0 2px 5px 0 hsla(0,0%,10%,40%)'}*/>
            <Flex as={'header'} justifyContent={'space-between'} alignItems={'center'}>
                <Link href={`/user/${post.author.username}`} >
                    <HStack spacing={'1rem'}>
                        <Avatar size={'md'} name={post.author.username} src={post.author.avatar?.url || undefined}/>
                        <VStack spacing={0} alignItems={'start'}>
                            <Text fontWeight={600}>{post.author.username}</Text>
                            <Text fontSize={'0.75rem'}>{post.createdAt}</Text>
                        </VStack>
                    </HStack>
                </Link>
                <FormattedPostContextMenu isOwner={isOwner} post={post}/>
                {/*<IconButton aria-label={''} icon={<MdMoreVert/>} bg={'white'}/>*/}
            </Flex>
            <Spacer height={'1rem'}/>
            <Box padding={'0'}>
                <Text>{post.content}</Text>
            </Box>
            <Spacer height={'1rem'}/>
            {/*{post.attachments.length>0
            && <>
                <Spacer height={'1rem'}/>
                <Box>
                    <ImageGallery>
                        {post.attachments.map((image, index) => {
                            return(
                                <GalleryItem key={image.id}>
                                    <Image src={image.url} alt={post.name} />
                                </GalleryItem>
                            );
                        })}
                    </ImageGallery>
                </Box>
                <ImageGrid imageSet={post.attachments.map(v => v.url)}/>
            </>}*/}
            <ImageDisplay images={post.attachments.map(value => value.url)}/>
            <Spacer height={'1rem'}/>
            <HStack >
                {post.categories.map((topic) => {
                    return(
                        <Link key={topic.id} href={`/topic/${topic.name}`}>
                            <Tag letterSpacing={'0.025em'} fontWeight={700} fontFamily={'Helvetica Neue'} border={'1px solid'} borderColor={'primary.500'} color={'primary.700'} bg={'primary.50'}>
                                {topic.name}
                            </Tag>
                        </Link>
                    );
                })}
            </HStack>
            <Spacer height={'1rem'}/>
            <Flex alignItems={'center'} justifyContent={'space-between'}>
            <HStack marginLeft={'-0.5rem'}>
                <Box display={'inline-flex'} alignItems={'center'} justifyContent={'flex-start'} position={'relative'}>
                    <IconButton bg={'white'} onClick={toggleFavorite} aria-label={''} icon={isFavorited ? <AiFillLike/> : <AiOutlineLike/>}/>
                    <Text zIndex={'1'} marginLeft={'-0.25rem'} fontSize={'0.875rem'} fontWeight={400}>{post.favoriteCount + Number(isFavorited)}</Text>
                </Box>
                <Link href={`/post/${post.slug}`}>
                    <Box display={'inline-flex'} alignItems={'center'} justifyContent={'flex-start'} position={'relative'}>
                        <IconButton zIndex={'0'} bg={'white'} aria-label={''} icon={<AiOutlineComment/>}/>
                        <Text zIndex={'1'} marginLeft={'-0.25rem'} fontSize={'0.875rem'} fontWeight={400}>{post.comments.length}</Text>
                    </Box>
                </Link>
            </HStack>
            <Box>
                {post.community && <Link href={`/community/${post.community.name}`}>
                    <Text fontWeight={400} fontSize={'0.75rem'} as={'span'}>{`Posted in `}</Text>
                    <Text fontWeight={600} fontSize={'0.875rem'} as={'span'}>{post.community.name}</Text>
                </Link>}
            </Box>
            </Flex>
            {/*<Spacer height={'1rem'}/>
            <Divider/>
            <Collapse in={isCommentsExpanded}>

                <Box padding={'1rem'}>
                    {post.comments.map((comment) => {
                        return(
                            <PostComment comment={comment} key={comment.id} />
                        );
                    })}

                </Box>
                <Divider/>
                <Spacer height={'1rem'}/>



                <Box paddingLeft={'4rem'}>
                    <InputGroup>
                        <Input borderRadius={0} padding={'0 1rem'}/>
                        <InputRightAddon padding={'0'}>
                            <IconButton bg={'white'} borderRadius={0} border={'inherit'} aria-label={''} icon={<MdSend/>}/>
                        </InputRightAddon>
                    </InputGroup>
                </Box>

            </Collapse>*/}
        </Box>
    );
}
interface ImageDisplayProps {
    images: string[];
}
function ImageDisplay(props: ImageDisplayProps) {
    const {
        images
    } = props;
    return(
        images.length===0 ? null :
            images.length===1 ? <Box position={'relative'}><Image borderRadius={'0.5rem'} overflow={'hidden'} src={images[0]} alt={''}/><GradientOverlay/></Box> :
                images.length===3 ? <ImageGrid imageSet={images}/> :
                    <ImageGallery>
                        {images.map(image => {
                            return(
                                <GalleryImage src={image} key={image}/>
                                /*<GalleryItem key={image}>
                                    <Image src={image} alt={''}/>
                                </GalleryItem>*/
                            );
                        })}
                    </ImageGallery>
    );
}
interface OverflowMenuProps {
    post: PostServerResponseDto;
    isOwner: boolean;
}
function FormattedPostContextMenu( props: OverflowMenuProps ) {
    const {
        post,
        isOwner = false
    } = props;
    const {isOpen, onOpen, onClose} = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null);
    const {removePost} = useApi();
    function handleDeleteClick() {
        onClose();
        removePost(post.slug);
    }
    return(
        <>
            <Menu>
                <MenuButton>
                    <IconButton aria-label={''} icon={<MdMoreVert/>} bg={'white'}/>
                </MenuButton>
                <MenuList>
                    <MenuItem>
                        {post.community === null ?
                            'Not posted in a group' :
                            <Link href={`/community/${post.community.name}`}>
                            {`View '${post.community.name}' group`}
                        </Link>}
                    </MenuItem>
                    {isOwner &&
                    <MenuItem onClick={onOpen}>
                        Delete post
                    </MenuItem>
                    }
                </MenuList>
            </Menu>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered={true}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Post
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            {`Are you sure? You can't undo this action afterwards.`}
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={handleDeleteClick} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}
