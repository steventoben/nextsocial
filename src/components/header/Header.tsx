import {Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text} from "@chakra-ui/react";
import {SearchBar} from "../../modules/search/SearchBar";
import Link from "next/link";
import {useAuthentication} from "../../modules/auth/AuthenticationProvider";

interface HeaderProps {}
export function Header(props: HeaderProps) {
    const {} = props;
    const {logout} = useAuthentication();
    return(
        <Flex boxShadow={'1px 2px 4px 0px rgba(25,25,25,0.1)'} borderBottom={'1px solid rgba(25,25,25,0.1)'} justifyContent={'space-between'} zIndex={1} bg={'white'} as={'header'} position={'fixed'} top={0} left={0} width={'100%'} padding={'1rem'}>
            <Box>
                Logo
            </Box>
            <SearchBar/>
            <Menu>
                <MenuButton>
                    Menu
                </MenuButton>
                <MenuList>
                    <MenuItem as={Link} href={'/preferences'}>
                        <Text>Preferences</Text>
                    </MenuItem>
                    <MenuItem onClick={logout}>
                        <Text>Log out</Text>
                    </MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}
