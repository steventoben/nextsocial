import {FieldError, SubmitHandler, useForm} from "react-hook-form";
import {
    Box,
    Button, Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputLeftAddon, InputLeftElement, InputProps,
    Spacer, Text, useUpdateEffect
} from "@chakra-ui/react";
import {AiOutlineLock, AiOutlineUser} from "react-icons/ai";
import React, {ReactElement, SetStateAction} from "react";
import styled from "@emotion/styled";
import {useSubmitForm} from "../../hooks/useSubmitForm";
import {LoginResponseDTO, useAuthentication} from "../auth/AuthenticationProvider";
import Router, {useRouter} from "next/router";
import Link from "next/link";
//import {router} from "next/client";

type Handlers<Model> = {
    [Key in keyof Model]: (newValue: Model[Key]) => void;
}
const handlers: Handlers<LoginFields> = {
    email: () => {},
    password: () => {}
}
const form = new Proxy({email: "", password: ""} as LoginFields, {
    set(target: LoginFields, property: keyof LoginFields, value: string): boolean {
        const handler = handlers[property];
        //handler?.(value);
        if(handler) {
            handler(value);
            return true;
        }
        return false;
    }
})

interface LoginFields {
    email: string;
    password: string;
}
interface RegisterFields {
    email: string;
    password: string;
}
const fields = {
    email: '',
    password: ''
}
function exists(value: FieldError | undefined): boolean {
    return typeof value !== null && typeof value !== "undefined";
}
interface LoginResponse {
    authenticated: boolean;
    token: string;
}
export interface LoginResponseDto {
    token: string;
    username: string;
}
type FormType = {
    login: LoginFields,
    register: RegisterFields
}
const a: FormType["register"] = {
    email: '',
    password: ''
}

const formFeatures = {
    "login": {

    },
    "register": {

    }
};
const loginFields = {
    email: {
        label: 'Email',
        rules: {

        }
    }
};
interface LoginFormProps {
    setIsLogin: React.Dispatch<SetStateAction<boolean>>;
}
export function LoginForm(props: LoginFormProps) {
    const {
        setIsLogin
    } = props;
    const authenticationManager = useAuthentication();
    const {handleSubmit, register, formState: {errors, ...formState}} = useForm<LoginFields>();
    const [formResponse, setFormResponse] = React.useState<LoginResponseDTO | null>(null);
    const {handleFetch: submitForm} = useSubmitForm();
    const router = useRouter();
    const onSubmit: SubmitHandler<LoginFields> = (data) => {
        console.log(data);
        let formData: FormData = new FormData();
        formData.set('username', data.email);
        formData.set('password', data.password);
        submitForm({
            url: '/auth/login', //form[formState].endpoint
            method: 'POST',
            formBody: JSON.stringify({username: data.email, password: data.password})
        }).then((res: any) => {
            res.clone().json().then((json: any) => setFormResponse(json));
        });
    }
    React.useEffect(() => {
        console.log(formResponse);
        if(localStorage.getItem('token')){
            console.log(localStorage.getItem('token'));
        }
        if(formResponse) {
            // @ts-ignore
            if(formResponse.token) {
                // @ts-ignore
                localStorage.setItem('token', formResponse.token);
                //Successful login. Saved token, now request home page with token attached in header
                authenticationManager.login(formResponse);
            }
        }
    }, [formResponse]);
    useUpdateEffect(() => {
        //const referer = router.events.
        console.log("updated");
        console.log(authenticationManager.userData);
        if(authenticationManager.isAuthenticated()) {
            router.push('/feed');
            //Router.push('/feed', '/', {shallow: true}); //redirect to page before being redirected to login
        }
    }, [authenticationManager.userData]);
    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={exists(errors.email)}>
                <FormLabel fontSize={'0.875rem'} marginBottom={'0.25rem'} htmlFor={'email'}>
                    {`Email`}
                </FormLabel>
                <InputGroup>
                    <InputLeftElement>
                        <AiOutlineUser/>
                    </InputLeftElement>
                <Input
                    id={'email'}
                    /*placeholder={'Email'}*/
                    {...register('email', {
                        required: 'This is required',
                        minLength: {value: 4, message: 'please enter a valid email address'}
                    })}
                    backgroundSize={'0 100%'}
                    backgroundRepeat={'no-repeat'}
                    transition={'background-size 200ms'}
                    _focus={{
                        backgroundImage: 'linear-gradient(0deg,#36a2ef,#36a2ef 2px,transparent 0,transparent)',
                        backgroundSize: '100% 100%',
                        outline: 'none'
                    }}
                    focusBorderColor={'inherit'}
                />
                </InputGroup>
                <FormErrorMessage>
                    {errors.email && errors.email.message}
                </FormErrorMessage>
            </FormControl>
            <Spacer height={'1.5rem'}/>
            <FormControl isInvalid={exists(errors.password)}>
                <FormLabel fontSize={'0.875rem'} marginBottom={'0.25rem'} htmlFor={'password'}>
                    {`Password`}
                </FormLabel>
                <InputGroup>
                    <InputLeftElement>
                        <AiOutlineLock/>
                    </InputLeftElement>
                    <Input
                        id={'password'}
                        type={'password'}
                        /*placeholder={'Email'}*/
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {value: 4, message: 'please enter your password'}
                        })}
                        backgroundSize={'0 100%'}
                        backgroundRepeat={'no-repeat'}
                        transition={'background-size 200ms'}
                        _focus={{
                            backgroundImage: 'linear-gradient(0deg,#36a2ef,#36a2ef 2px,transparent 0,transparent)',
                            backgroundSize: '100% 100%',
                            outline: 'none'
                        }}
                        focusBorderColor={'inherit'}
                    />
                </InputGroup>
                <FormErrorMessage>
                    {errors.password && errors.password.message}
                </FormErrorMessage>
            </FormControl>
            {/*<Spacer height={'1.5rem'}/>
            <FormControl isInvalid={exists(errors.password)}>
                <FormLabel fontSize={'0.875rem'} marginBottom={'0.25rem'} htmlFor={'password'}>
                    {`Password`}
                </FormLabel>
                <Input
                    id={'password'}
                    placeholder={'Password'}
                    {...register('password', {
                        required: 'Please enter your password',
                        minLength: {value: 4, message: 'please enter a valid password'}
                    })}
                />
                <FormErrorMessage>
                    {errors.password && errors.password.message}
                </FormErrorMessage>
            </FormControl>*/}
            <Spacer height={'1.5rem'}/>
            <Button width={'full'} colorScheme={'primary'} isLoading={formState.isSubmitting} type={'submit'}>
                {`Login`}
            </Button>
            <Divider marginTop={'2rem'} marginBottom={'1rem'}/>
            <Box display={'inline-flex'} alignItems={'center'}>
                <Text >
                    {`Don't have an account? `}

                    {/*<Link href={'/register'}>
                        {`Sign up`}
                    </Link>*/}
                </Text>
                <Button marginLeft={'0.5rem'} variant={'unstyled'} onClick={() => setIsLogin(false)}>
                    {'Sign up'}
                </Button>
            </Box>
        </form>
    );
}

function FormField() {
    return(
        <FormControl>

        </FormControl>
    );
}
interface InputFieldProps {
    input: ReactElement;
}
function InputFieldWithIcon(props: InputFieldProps) {
    const {
        input
    } = props;
    return(
        <Box>
            {}

        </Box>
    );
}
/*const StyledInput = styled<InputProps>(Input)`

`;*/
function FieldLabel() {
    return(
        <Flex>
            <FormLabel>

            </FormLabel>
        </Flex>
    );
}
