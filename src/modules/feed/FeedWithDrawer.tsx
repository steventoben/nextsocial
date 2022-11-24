import {
    Box,
    Button,
    Drawer, DrawerBody,
    DrawerCloseButton,
    DrawerContent, DrawerFooter, DrawerHeader,
    DrawerOverlay,
    HStack, Text,
    useDisclosure,
    VStack
} from "@chakra-ui/react";
import {PostDto} from "../../models/postDto";
import {Post} from "../posts/Post";
import React from "react";
import {Comment} from "../comments/Comment";
import {commentSample} from "../../data/samples";

interface FeedProps {
    posts: PostDto[];
}
export function FeedWithDrawer(props: FeedProps) {
    const {
        posts
    } = props;
    const {isOpen, onOpen, onClose} = useDisclosure();
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [activePost, setActivePost] = React.useState<string|null>(null);
    function showComments(post: PostDto) {
        setActivePost(post.slug);
        onOpen();
    }
    function handleCloseComments() {
        onClose();
        setActivePost(null);
    }
    return(
        <Box>
            <VStack>
                {posts.map((post) => {
                    return(
                        <Post commentsOpen={activePost===post.slug} showComments={() => showComments(post)} key={post.slug} post={post}/>
                    );
                })}
            </VStack>
            <Drawer
                isOpen={isOpen}
                placement='right'
                onClose={handleCloseComments}
                finalFocusRef={buttonRef}
                size={'sm'}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Filters</DrawerHeader>

                    <DrawerBody padding={0}>
                        <Text>Hello drawer</Text>
                        <Comment comment={commentSample}/>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onClose}>
                            Clear All
                        </Button>
                        <Button onClick={() => console.log('clicked drawer primary action')}>Apply Filters</Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Box>
    );
}
