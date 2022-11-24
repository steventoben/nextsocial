import {UserDto} from "../../models/userDto";
import {Avatar, Box, Button, Flex, Heading, List, ListItem, Text, VStack} from "@chakra-ui/react";
import {getAvatar} from "../../../pages/user/[username]";

interface UserListProps {
    users: UserDto[];
    heading?: string;
}
export function UserList(props: UserListProps) {
    const {
        users,
        heading
    } = props;
    return(
        <List bg={'white'}>
            {heading&&<Heading size={'md'}>{heading}</Heading>}
            {users.map((user) => {
                return(
                    <ListItem key={user.id}>
                        <UserItem user={user}/>
                    </ListItem>
                );
            })}
        </List>
    );
}

interface UserItemProps {
    user: UserDto;
}
export function UserItem(props: UserItemProps) {
    const {
        user
    } = props;
    return(
        <Flex maxWidth={'20rem'} justifyContent={'space-between'} padding={'0.5rem'} alignItems={'center'}>
            <Flex alignItems={'center'}>
            <Box>
                <Avatar size={'md'}
                        name={user.username}
                        src={getAvatar(user.avatar)}
                />
            </Box>
            <Box marginLeft={'0.5rem'}>
                <Heading size={'sm'}>{user.username}</Heading>
                <Text fontSize={'0.75rem'}>{'something'}</Text>
            </Box>
            </Flex>
            <Button size={'sm'} variant={'text'}>View</Button>
        </Flex>
    );
}
