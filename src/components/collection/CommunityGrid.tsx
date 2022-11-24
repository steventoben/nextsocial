import {CommunityCardDto, CommunityDto} from "../../models/communityDto";
import {CommunityCard} from "../cards/CommunityCard";
import {Box} from "@chakra-ui/react";

interface CommunityGridProps {
    communities: CommunityDto[];//CommunityCardDto[];//CommunityDto[];
}
export function CommunityGrid(props: CommunityGridProps) {
    const {
        communities = []
    } = props;
    return(
        <Box display={'grid'} gridTemplateColumns={'repeat(auto-fill, minmax(12rem, 1fr))'} gap={'1rem'}>
            {communities.map((group) => {
                return(
                    <CommunityCard key={group.id} community={group}/>
                );
            })}
        </Box>
    );
}
