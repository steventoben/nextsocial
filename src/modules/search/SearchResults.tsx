import {SearchContext, SearchResultsDto} from "./SearchBar";
import {Avatar, Box, Button, Flex, Image, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import React from "react";
import Link from "next/link";
import {getAvatar} from "../../../pages/user/[username]";

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
            <Box position={'absolute'} bg={'white'} boxShadow={'2px 2px 2px 2px rgba(25,25,25,0.2)'}>
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
                                        item={{
                                            image: post.attachments.length?post.attachments[0].url:'',
                                            title: post.content,
                                            subtext: post.createdAt,
                                            link: `/post/${post.slug}`
                                        }}
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
                                        item={{
                                            image: getAvatar(user.avatar) || '',
                                            title: user.username,
                                            subtext: '',
                                            link: `/user/${user.username}`
                                        }}
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
                                        item={{
                                            image: getAvatar(group.photo||null) || '',
                                            title: group.name,
                                            subtext: group.about,
                                            link: `/community/${group.name}`
                                        }}
                                        key={group.id}
                                    />
                                );
                            })}
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
                <Box>
                    <Link href={`/search/${String(Reflect.ownKeys(searchResults).at(activeTabIndex))}`}>
                        {`View all results`}
                    </Link>
                </Box>
        </Box>
            :
            null
    );
}
interface ItemDto {
    image: string;
    title: string;
    subtext: string;
    link: string;
}
interface SearchResultsItemProps {
    item: ItemDto;
}
export function SearchResultsItem(props: SearchResultsItemProps) {
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
}

interface SearchItem {
    link: string;
}

interface SearchResultItemProps {
    item: ItemDto;
}
export function SearchResultItem(props: SearchResultItemProps) {
    const {
        item
    } = props;

    return (
        <Link href={item.link}>
            <Flex>
                <Image src={item.image}/>
                <Avatar name={item.title} src={item.image} size={'sm'}/>
                <Box>
                    <Text>{item.title}</Text>
                    <Text>{item.subtext}</Text>
                </Box>
            </Flex>
        </Link>
    );
}

