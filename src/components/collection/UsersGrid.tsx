import {Box} from "@chakra-ui/react";
import {UserDto} from "../../models/userDto";
import {UserCard} from "../cards/UserCard";

interface UsersGridProps {
    users: UserDto[];
}
export function UsersGrid(props: UsersGridProps) {
    const {
        users = []
    } = props;
    return(
        <Box>
            <Box display={'grid'} gap={'1rem'} gridTemplateColumns={'repeat(auto-fill, minmax(12rem, 1fr))'}>
                {users.map((user) => {
                    return(
                        <UserCard user={user} key={user.username}/>
                    );
                })}
            </Box>
        </Box>
    );
}
