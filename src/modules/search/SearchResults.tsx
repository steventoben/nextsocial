import {SearchContext, SearchResultsDto} from "./SearchBar";
import {Avatar, Box, Button, Flex, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import {getAvatar} from "../../../pages/user/[username]";
import {getTimeSince} from "../../utils/dateUtils";


interface AnchorTabProps {
    hash: string;
    label: string;
}
const AnchorTab = ({hash, label}: AnchorTabProps) => {
    return(
        <Link href={{hash: ''}}>

        </Link>
    );
};
interface AnchorTabsListProps {
    hash: string;
    label: string;
}
const AnchorTabsList = ({hash, label}: AnchorTabsListProps) => {
    return(
        <TabList>
            <AnchorTab hash={''} label={''}/>
        </TabList>
    );
};

interface SearchResultsProps {
    searchResults: SearchResultsDto;
    isOpen: boolean;
}
export function SearchResults(props: SearchResultsProps) {
    const {
        searchResults,
        isOpen
    } = props;
    //const {searchResults} = React.useContext(SearchContext);
    const [activeTabIndex, setActiveTabIndex] = React.useState<number>(1);

    return(
        isOpen ?
            <Box maxWidth={'32rem'} width={'inherit'} position={'absolute'} bg={'white'} boxShadow={'2px 2px 2px 2px rgba(25,25,25,0.2)'}>
            <Tabs onChange={(index) => setActiveTabIndex(index)} size={'sm'}>
                <TabList fontSize={'2xs'}>
                    <Tab>Posts {searchResults.posts.length}</Tab>
                    <Tab>Users {searchResults.users.length}</Tab>
                    <Tab>Groups {searchResults.communities.length}</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Box>
                            {searchResults.posts.slice(0,5).map((post) => {
                                return(
                                    <SearchResultsItem
                                        /*item={{
                                            image: post.attachments.length?post.attachments[0].url:'',
                                            title: post.content,
                                            subtext: post.createdAt,
                                            link: `/post/${post.slug}`
                                        }}
                                        key={post.id}*/
                                        image={post.attachments.length?post.attachments[0].url:''}
                                        title={post.content}
                                        subtext={getTimeSince(post.createdAt)}
                                        link={`/post/${post.slug}`}
                                        key={post.id}
                                    />
                                );
                            })}
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Box>
                            {searchResults.users.slice(0,5).map((user) => {
                                return(
                                    <SearchResultsItem
                                        /*item={{
                                            image: getAvatar(user.avatar) || '',
                                            title: user.username,
                                            subtext: '',
                                            link: `/user/${user.username}`
                                        }}
                                        key={user.id}*/
                                        image={getAvatar(user.avatar) || ''}
                                        title={user.username}
                                        subtext={''}
                                        link={`/user/${user.username}`}
                                        key={user.id}
                                    />
                                );
                            })}
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Box>
                            {searchResults.communities.slice(0, 5).map((group) => {
                                return(
                                    <SearchResultsItem
                                            image={getAvatar(group.photo||null) || ''}
                                            title={group.name}
                                            subtext={group.about}
                                            link={`/community/${group.name}`}
                                            key={group.id}
                                    />
                                );
                            })}
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
                <ViewAllResultsButton link={`/search/${String(Reflect.ownKeys(searchResults).at(activeTabIndex))}`}/>
        </Box>
            :
            null
    );
}
const ViewAllResultsButton = React.memo((props: {link: string}) => {
    return(
        <Box>
            <Link href={props.link}>
                {`View all results`}
            </Link>
        </Box>
    );
});
ViewAllResultsButton.displayName = 'ViewAllResultsButton';
interface ItemDto {
    image: string;
    title: string;
    subtext: string;
    link: string;
}
interface SearchResultsItemProps {
    item: ItemDto;
}
export const SearchResultsItem = React.memo((props: {image: string; title: string; subtext: string; link: string;}) => {
    /*const {
        item
    } = props;*/

    return (
        <Link href={props.link}>
            <Flex>
                <Avatar objectFit={'cover'} borderRadius={'0'} name={props.title} src={props.image} size={'sm'}/>
                {/*<Image sx={{aspectRatio: '1 / 1'}} src={props.image} alt={''}/>*/}
                <Box>
                    <Text>{props.title}</Text>
                    <Text>{props.subtext}</Text>
                </Box>
            </Flex>
        </Link>
    );
})
/*
export const SearchResultsItem = React.memo((props: SearchResultsItemProps) => {
    const {
        item
    } = props;

    return (
        <Link href={item.link}>
            <Flex>
                <Avatar name={item.title} src={item.image} size={'sm'}/>
                <Box>
                    <Text>{item.title}</Text>
                    <Text>{item.subtext}</Text>
                </Box>
            </Flex>
        </Link>
    );
})*/
SearchResultsItem.displayName = 'SearchResultsItem';

export const SearchResultsUserItem = React.memo((props: {image: string; title: string; subtext: string; link: string;}) => {
    /*const {
        item
    } = props;*/

    return (
        <Link href={props.link}>
            <Flex>
                <Avatar name={props.title} src={props.image} size={'sm'}/>
                <Box>
                    <Text>{props.title}</Text>
                    <Text>{props.subtext}</Text>
                </Box>
            </Flex>
        </Link>
    );
})
SearchResultsUserItem.displayName = 'SearchResultsUserItem';
const SearchResultItem = React.memo(SearchResultsItem);

