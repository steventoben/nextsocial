import {Avatar, Flex, HStack, IconButton, Text, VStack} from "@chakra-ui/react";
import {MdMoreVert} from "react-icons/md";
import {UserDto} from "../../models/userDto";
import {getAvatar} from "../../../pages/user/[username]";

interface UserAvatarHeaderProps {
    user: UserDto;
    metadata?: string;
}
export function UserAvatarHeader(props: UserAvatarHeaderProps) {
    const {
        user,
        metadata = '2 days ago'
    } = props;
    return(
        <Flex as={'header'} justifyContent={'space-between'} alignItems={'center'}>
            <HStack spacing={'1rem'}>
                <Avatar size={'md'} name={user.username} src={getAvatar(user.avatar)}/>
                <VStack spacing={0} alignItems={'start'}>
                    <Text >{user.username}</Text>
                    <Text fontSize={'0.75rem'}>{metadata}</Text>
                </VStack>
            </HStack>
            <IconButton aria-label={''} icon={<MdMoreVert/>} bg={'white'}/>
        </Flex>
    );
}
