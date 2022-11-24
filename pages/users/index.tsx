import {NextPage, NextPageContext} from "next";
import {AppLayout} from "../../src/modules/layout/AppLayout";
import {Box, Button, Flex, Heading, Spacer} from "@chakra-ui/react";
import {CommunityCard} from "../../src/components/cards/CommunityCard";
import {UserDto} from "../../src/models/userDto";
import {UserCard} from "../../src/components/cards/UserCard";
import {CommunityWithMembershipDto} from "../../src/models/communityDto";
import {UserList} from "../../src/components/list/UserList";

interface UsersPageProps {
    friends: UserDto[];
    followers: UserDto[];
    otherUsers: UserDto[];
}
const UsersPage: NextPage<UsersPageProps> = (props: UsersPageProps) => {
    const {
        friends,
        followers,
        otherUsers
    } = props;
    return(
        <AppLayout sidebarWidth={'16rem'}>
            <Box maxWidth={'80ch'} margin={'0 auto'}>
                <Box>
                    {/*<Box>
                        <Flex>
                            <Heading size={'lg'}>{'Suggested for you'}</Heading>
                        </Flex>
                        <Box padding={'1rem'} bg={'gray.100'} display={'grid'} gridTemplateColumns={'repeat(auto-fill, minmax(10rem, 1fr))'} gap={'1rem'}>
                            {friends.map((friend) => {
                                return(
                                    <UserCard key={friend.id} user={friend}/>
                                );
                            })}
                        </Box>
                    </Box>*/}
                </Box>
                <Spacer height={'2rem'}/>
                <Box  maxWidth={'revert'}  position={'absolute'} width={'100%'} left={0}>
                    <Box paddingTop={'2rem'}  maxWidth={'80ch'} margin={'0 auto'}>
                        <Flex padding={'1rem'} bg={'white'} justifyContent={'space-between'} alignItems={'center'}>
                            <Heading fontFamily={'Helvetica Neue'} size={'lg'}>Your followers</Heading>
                            <Button variant={'text'}>View all</Button>
                        </Flex>
                        <Box bg={'white'} padding={'1rem'} /*bg={'gray.100'}*/ display={'grid'} gridTemplateColumns={'repeat(auto-fill, minmax(10rem, 1fr))'} gap={'1rem'}>
                            {friends.map((friend) => {
                                return(
                                    <UserCard key={friend.id} user={friend}/>
                                );
                            })}
                        </Box>
                        <Spacer height={'2rem'}/>
                        <Flex padding={'1rem'} bg={'white'} justifyContent={'space-between'} alignItems={'center'}>
                            <Heading fontFamily={'Helvetica Neue'} size={'lg'}>People you follow</Heading>
                            <Button variant={'text'}>View all</Button>
                        </Flex>
                        <Box padding={'1rem'} bg={'white'} display={'grid'} gridTemplateColumns={'repeat(auto-fill, minmax(10rem, 1fr))'} gap={'1rem'}>
                            {followers.map((friend) => {
                                return(
                                    <UserCard key={friend.id} user={friend}/>
                                );
                            })}
                        </Box>

                        <Flex padding={'1rem'} bg={'white'} justifyContent={'space-between'} alignItems={'center'}>
                            <Heading fontFamily={'Helvetica Neue'} size={'lg'}>People you follow</Heading>
                            <Button variant={'text'}>View all</Button>
                        </Flex>
                        <Spacer height={'1rem'}/>
                        <UserList heading={'Following'} users={friends}/>
                        <UserList heading={'Followers'} users={followers}/>

                    </Box>
                </Box>
            </Box>
        </AppLayout>
    );
}
export default UsersPage;

export async function getServerSideProps(context: NextPageContext) {
    // @ts-ignore
    const token = context.req.cookies['Authentication'];
    const headers = {
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin': `${process.env.REACT_APP_BASE_DOMAIN}`,
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${token}`
    };
    const reqHeaders: Headers = new Headers(headers);
    const requestInit: RequestInit = {
        method: 'GET',
        headers: reqHeaders,
        //body: body,
        mode: "cors",
        redirect: "follow",
        credentials: 'include'
    };
    //const communityName = context.query.name;
    const myReq = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/me/following`, requestInit);
    console.log(myReq);
    const reqData = await fetch(myReq);
    console.log(reqData);
    if(reqData.status===401) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }
    const data = await reqData.json();
    //const data = myFetcher(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/all?page=4`, token);
    console.log(data);
    //const f = data;
    //console.log(following);
    const following: UserDto[] = data.map((item: any) => ({
        id: item.id,
        username: item.username,
        avatar: item.avatar ?? null

    }))
    console.log(following);

    const myReq2 = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}/users/me/followers`, requestInit);
    console.log(myReq2);
    const reqData2 = await fetch(myReq2);
    console.log(reqData2);
    const data2 = await reqData2.json();
    //const data = myFetcher(`${process.env.NEXT_PUBLIC_BACKEND_API}/posts/all?page=4`, token);
    console.log(data2);
    //const f = data;
    //console.log(following);
    const followers: UserDto[] = data2.map((item: any) => ({
        id: item.id,
        username: item.username,
        avatar: item.avatar ?? null

    }))
    console.log(followers);


    return {
        props: {
            friends: following,
            followers: followers,
            otherUsers: []
        }
    }
}
