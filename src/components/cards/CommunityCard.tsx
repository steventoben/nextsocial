import {CommunityCardDto, CommunityDto, CommunityWithMembershipDto} from "../../models/communityDto";
import {communityWithMembershipSample} from "../../data/samples";
import {AspectRatio, Box, Button, Flex, Heading, Image, Text} from "@chakra-ui/react";
import {capitalize} from "../../utils/stringUtils";
import Link from "next/link";
import {getAvatar} from "../../../pages/user/[username]";

interface CommunityCardProps {
    community: CommunityCardDto;//CommunityWithMembershipDto;
    //community: CommunityDto;//CommunityCardDto;//CommunityWithMembershipDto;
}
export function CommunityCard(props: CommunityCardProps) {
    const {
        community //= communityWithMembershipSample
    } = props;
    return(
        <Link href={`/community/${community.name}`}>
            <Box boxShadow={'1px 1px 4px 0px rgba(25,25,25,0.2)'} borderRadius={'1rem'} sx={{"&:hover > * > img": {transform: 'auto', scale: '1.1'}}}>
                <AspectRatio overflow={'hidden'} borderRadius={'1rem'} ratio={16 / 10}>
                    <Image transition={'transform 400ms ease'} _hover={{transform: 'auto', scale: '1.2'}} borderRadius={'1rem'} src={getAvatar(community.photo||null)} alt={community.name}/>
                </AspectRatio>
                <Flex padding={'0.5rem 1rem'} justifyContent={'space-between'} alignItems={'center'}>
                    <Box paddingTop={'0.0rem'}>
                        <Heading size={'md'}>{capitalize(community.name)}</Heading>
                        <Text fontSize={'sm'}>{`572 members`}</Text>
                    </Box>
                    <Button paddingY={'0.25rem'} height={'auto'} size={'sm'} variant={'ghost'}>{'View'}</Button>
                </Flex>
            </Box>
        </Link>
    );
}
