import {AspectRatio, Avatar, Box, Flex, Heading, Image, Text} from "@chakra-ui/react";
import {UserDto} from "../../models/userDto";
import Link from "next/link";
import {getAvatar} from "../../../pages/user/[username]";

interface UserCardProps {
    user: UserDto;
    followable?: boolean;
}
export function UserCard(props: UserCardProps) {
    const {
        user
    } = props;
    return(
        <Link href={`/user/${user.username}`}>
            <Flex boxShadow={'1px 1px 4px 0px rgba(25,25,25,0.2)'} alignItems={'center'} justifyContent={'center'} borderRadius={'1rem'} padding={'1rem'} bg={'white'} flexDirection={'column'}>
                <Avatar size={'xl'} name={user.username} src={getAvatar(user.avatar)}/>
                <Box>
                    <Box>
                        <Heading size={'md'}>{user.username}</Heading>
                    </Box>
                    <Box>
                        <Text size={'sm'}>{'Bio'}</Text>
                    </Box>
                </Box>
            </Flex>
        </Link>
    );
}

/*interface UserCardProps {
    user: UserDto;
    followable?: boolean;
}
export function UserCard(props: UserCardProps) {
    const {
        user
    } = props;
    return(
        <Flex borderRadius={'1rem'} padding={'0.5rem'} bg={'white'} flexDirection={'column'}>
            <AspectRatio ratio={4 / 3}>
                {/!*<Avatar size={'xl'} name={user.username} src={user.avatar?.url || undefined}/>*!/}
                <Image  borderRadius={'1rem'} alt={''} src={user.avatar?.url || undefined}/>

            </AspectRatio>
            {/!*<AspectRatio>
                <Image alt={''} src={user.avatar?.url || undefined}/>
            </AspectRatio>*!/}
            <Box>
                <Box>
                    <Heading size={'md'}>{user.username}</Heading>
                </Box>
                <Box>
                    <Text size={'sm'}>{'Bio'}</Text>
                </Box>
            </Box>
        </Flex>
    );
}*/
