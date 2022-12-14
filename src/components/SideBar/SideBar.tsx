import {
    Avatar,
    Box,
    BoxProps, Button, Collapse,
    Flex,
    HStack,
    HTMLChakraProps, Icon,
    List,
    ListItem,
    Spacer,
    Text, useMediaQuery,
    VStack
} from "@chakra-ui/react";
import {UserStats, UserStatsSummary} from "../../models/userDto";
import {userWithStatsSample} from "../../data/samples";
import {formatNumber} from "../../utils/stringUtils";
import React, {ComponentProps, ReactNode} from "react";
import styled from "@emotion/styled";
import Link from "next/link";
import {MdExplore, MdFeed, MdGroups, MdWeb} from "react-icons/md";
import {CgCommunity} from "react-icons/cg";
import {FaGlobe, FaUserFriends} from "react-icons/fa";
import {RiCommunityFill} from "react-icons/ri";
import {useFetchHook} from "../../hooks/useFetchHook";
import {useAuthentication} from "../../modules/auth/AuthenticationProvider";
import {getAvatar} from "../../../pages/user/[username]";

interface SideBarProps {}
export function SideBar(props: SideBarProps) {
    const {} = props;
    const [groups, setGroups] = React.useState<NavLinkType[]>([]);
    const [userInfo, setUserInfo] = React.useState<UserStats>({postsCount: 0, followingCount: 0, followersCount: 0});
    const {handleFetch: fetchGroups} = useFetchHook(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/me/communities`, 'GET', {
        responseInterceptors: [
            (response) => setGroups(response.data.map((c: {name: string}) => ({label: c.name, link: `/community/${c.name}`})))
        ]
    });
    const {handleFetch: fetchUserInfo} = useFetchHook(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/my-stats`, 'GET', {
        responseInterceptors: [
            (response) => setUserInfo({
                postsCount: response.data.posts,
                followersCount: response.data.followers,
                followingCount: response.data.following
            })
        ]
    });
    React.useEffect(() => {
        fetchGroups();
        fetchUserInfo();
    }, []);
    const {getCurrentUser} = useAuthentication();
    return(
        <Box borderRight={'1px solid rgba(25,25,25,0.2)'} padding={'4rem 0rem'} position={'relative'} width={'100%'} height={'100%'} bg={'white'}>
            <AccountSummary userWithStats={{
                ...userInfo,
                username: getCurrentUser().username,
                avatar: getCurrentUser().avatar
            }}/>
            <Spacer height={'2rem'}/>
            <NavBarLinks navLinks={links}/>
            <Spacer height={'2rem'}/>
            <TopNavLinks topLinks={groups}/>
        </Box>
    );
}
type NavItemType = {
    item: ReactNode;
    link: string;
};
type NavLinkType = {
    label: string;
    link: string;
    icon?: ReactNode;
}
const links: NavLinkType[] = [
    {label: 'Feed', link: '/feed', icon: <MdFeed/>},
    {label: 'Groups', link: '/communities', icon: <FaGlobe/>},
    {label: 'Friends', link: '/users', icon: <FaUserFriends/>},
    {label: 'Explore', link: '/explore', icon: <MdExplore/>},
];
interface NavProps {}
export function Nav(props: NavProps) {
    return(
        <nav>

        </nav>
    );
}
interface NavBarProps {
    navLinks: NavLinkType[];
}
export function NavBar(props: NavBarProps) {
    const {
        navLinks
    } = props;
    return(
        <Box padding={'0.5rem'} as={'nav'}>
            <List>
                {navLinks.map((link) => {
                    return(
                        <NavListLink key={link.link} link={link}/>
                    );
                })}
            </List>
        </Box>
    );
}
const NavBarLinks = React.memo(({navLinks}: NavBarProps) => {
    return(
        <Box padding={'0.5rem'} as={'nav'}>
            <List>
                {navLinks.map((link) => {
                    return(
                        <NavListLink key={link.link} link={link}/>
                    );
                })}
            </List>
        </Box>
    );
});
NavBarLinks.displayName = 'NavBarLinks';

interface NavListLinkProps {
    link: NavLinkType;
}
const NavListLink = React.memo(({link}: NavListLinkProps) => {
    return(
        <ListItem sx={link.link===location.pathname?{backgroundColor: 'rgba(55,163,240,0.1)', borderLeft: '4px solid rgba(55,163,240,1)'}:{}}  padding={'0.5rem 1rem'} _hover={{backgroundColor: 'gray.100'}} key={link.label}>
            <Link aria-current={link.link===location.pathname?'page':'false'} href={link.link}>
                <Flex alignItems={'center'}>
                    <Box marginRight={'1rem'}>{link.icon}</Box>
                    <Text fontFamily={'Helvetica Neue'} fontSize={'1.125rem'}>
                        {link.label}
                    </Text>
                </Flex>
            </Link>
        </ListItem>
    );
});
NavListLink.displayName = 'NavListLink';

const StyledBase = styled(Box)``;

const sampleTopLinks: NavLinkType[] = [
    {label: 'Programming', link: '/group/programming'},
    {label: 'Cooking', link: '/group/programming'},
    {label: 'Photography', link: '/group/programming'},
    {label: 'ReactJs', link: '/group/programming'},
    {label: 'Digital Art', link: '/group/programming'},
];
interface TopLinksProps {
    topLinks: NavLinkType[];
}
function TopNavLinks(props: TopLinksProps) {
    const {
        topLinks
    } = props;
    return(
        <Box backgroundColor={'white'}>
            <Text padding={'0.5rem 1.5rem'} fontSize={'1rem'} fontWeight={'600'}>Your favorite places</Text>
            <List >
                {topLinks.slice(0, 5).map((link) => {
                    return(
                        <ListItem _activeLink={{backgroundColor: 'rgba(55,163,240,0.2)'}} padding={'0.5rem 1rem'} _hover={{backgroundColor: 'gray.100'}} key={link.label}>
                            <Link aria-current={link.link===location.pathname?'page':'false'} href={link.link}>
                                <Flex alignItems={'center'}>
                                    <Box marginRight={'1rem'}>{link.icon}</Box>
                                    <Text fontFamily={'Helvetica Neue'} fontSize={'1rem'}>
                                        {link.label}
                                    </Text>
                                </Flex>
                            </Link>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}

interface AccountBarProps {
    userWithStats: UserStatsSummary;
}
function AccountBar(props: AccountBarProps) {
    const {
        userWithStats
    } = props;
    const {postsCount,followingCount,followersCount,...user} = userWithStats;
    return(
        <Box>

        </Box>
    );
}

interface Props {
    userWithStats: UserStatsSummary;
}
function AccountSummary(props: Props) {
    const {
        userWithStats
    } = props;
    const {postsCount,followingCount,followersCount,...user} = userWithStats;
    return(
        <Box>
            <Flex direction={'column'} alignItems={'center'} justifyContent={'center'}>
                <Avatar mb={'0.5rem'} size={'xl'} name={user.username} src={getAvatar(user.avatar)}/>
                <VStack alignItems={'center'} justifyContent={'center'} spacing={-1}>
                    <Text fontSize={'1.125rem'} fontWeight={700} color={'rgba(22,25,27,0.85)'}>{user.username}</Text>
                    {/*<Text color={'rgba(22,25,27,0.45)'}>{`metadata`}</Text>*/}
                </VStack>
            </Flex>
            <Spacer height={'2rem'}/>
            <Box lineHeight={1.2} display={'grid'} gridTemplateColumns={'repeat(3, 1fr)'}>
                <Box textAlign={'center'}>
                    <Text fontSize={'0.875rem'} fontWeight={700} color={'rgba(22,25,27,0.85)'}>{postsCount}</Text>
                    <Text fontSize={'0.875rem'} color={'rgba(22,25,27,0.45)'}>{`Posts`}</Text>
                </Box>
                <Box textAlign={'center'}>
                    <Text fontSize={'0.875rem'} fontWeight={700} color={'rgba(22,25,27,0.85)'}>{formatNumber(followersCount)}</Text>
                    <Text fontSize={'0.875rem'} color={'rgba(22,25,27,0.45)'}>{`Followers`}</Text>
                </Box>
                <Box textAlign={'center'}>
                    <Text fontSize={'0.875rem'} fontWeight={700} color={'rgba(22,25,27,0.85)'}>{formatNumber(followingCount)}</Text>
                    <Text fontSize={'0.875rem'} color={'rgba(22,25,27,0.45)'}>{`Following`}</Text>
                </Box>
            </Box>
        </Box>
    );
}
