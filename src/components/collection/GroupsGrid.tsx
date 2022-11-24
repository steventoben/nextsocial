import {Avatar, Box, Flex, Image, Text} from "@chakra-ui/react";
import {UserDto} from "../../models/userDto";
import {UserCard} from "../cards/UserCard";
import {CommunityDto} from "../../models/communityDto";
import {CommunityCard} from "../cards/CommunityCard";
import {getAvatar} from "../../../pages/user/[username]";

interface GroupsGridProps {
    groups: CommunityDto[];
}
export function GroupsGrid(props: GroupsGridProps) {
    const {
        groups = []
    } = props;
    return(
        <Box>
            <Box display={'grid'} gap={'1rem'} gridTemplateColumns={'repeat(auto-fill, minmax(12rem, 1fr))'}>
                {groups.map((group) => {
                    return(
                        <GroupCard key={group.id} group={group}/>
                    );
                })}
            </Box>
        </Box>
    );
}

interface GroupCardProps {
    group: CommunityDto;
}
export function GroupCard(props: GroupCardProps) {
    const {
        group
    } = props;
    return(
        <Flex>
            <Image alt={group.name} src={getAvatar(group.photo||null)}/>
            <Box>
                <Text>{group.name}</Text>
                <Text>{`${1234} members`}</Text>
            </Box>
        </Flex>
    );
}
