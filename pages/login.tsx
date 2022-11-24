import {NextPage} from "next";
import {LoginForm} from "../src/modules/login/LoginForm";
import {Box, Center, Spacer, Text} from "@chakra-ui/react";
import React from "react";
import {RegisterForm} from "../src/modules/login/RegisterForm";

const LoginPage: NextPage = () => {
    const [isLogin, setIsLogin] = React.useState<boolean>(true);
    return(
        <Center minHeight={'100vh'} bg={'gray.100'}>
            <Box bg={'white'} padding={'2rem'} maxWidth={'40ch'} flex={'1 0 auto'}>
                <Text margin={'0 auto'} width={'max-content'} fontSize={'2rem'}>
                    {isLogin ? 'Login' : 'Create an account'}
                </Text>
                <Spacer height={'4rem'}/>
                {isLogin ? <LoginForm setIsLogin={setIsLogin}/> : <RegisterForm setIsLogin={setIsLogin}/>}
            </Box>
        </Center>
    );
}
export default LoginPage;
