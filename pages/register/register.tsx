import {NextPage} from "next";
import {Box, Center, Spacer, Text} from "@chakra-ui/react";
import {RegisterForm} from "../../src/modules/login/RegisterForm";

const RegisterPage: NextPage = () => {
    return(
        <Center minHeight={'100vh'} bg={'gray.100'}>
            <Box bg={'white'} padding={'2rem'} maxWidth={'40ch'} flex={'1 0 auto'}>
                <Text margin={'0 auto'} width={'max-content'} fontSize={'2rem'}>Login</Text>
                <Spacer height={'4rem'}/>
                {/*<RegisterForm/>*/}
            </Box>
        </Center>
    );
}
export default RegisterPage;
