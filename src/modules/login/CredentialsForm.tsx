import {LoginResponseDTO, useAuthentication} from "../auth/AuthenticationProvider";
import {SubmitHandler, useForm} from "react-hook-form";
import React, {ReactNode} from "react";
import {useSubmitForm} from "../../hooks/useSubmitForm";
import {useRouter} from "next/router";
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    InputLeftElement, Spacer, Text,
    useUpdateEffect
} from "@chakra-ui/react";
import {AiOutlineLock, AiOutlineUser} from "react-icons/ai";
import Link from "next/link";

interface LoginFields {
    email: string;
    password: string;
}

const loginFeatures = {
    fields: {
        email: {
            name: 'email',
            label: 'Email',
            rules: {
                required: 'This is required',
                minLength: {value: 4, message: 'please enter a valid email address'}
            }
        },
        password: {
            name: 'password',
            label: 'Password',
            rules: {
                required: 'This is required',
                minLength: {value: 4, message: 'please enter a valid password'}
            }
        },
    },

};


interface CredentialsFormProps {
    formHeading?: string;
    fields?: {[field: string]: string};
    footer?: ReactNode;
    type: 'login' | 'register';
}
export function CredentialsForm(props: CredentialsFormProps) {
    const {
        type
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
        if(authenticationManager.isAuthenticated()) {
            router.push('/feed'); //redirect to page before being redirected to login
        }
    }, [authenticationManager.userData]);
    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={Boolean(errors.email)}>
                <FormLabel fontSize={'0.875rem'} marginBottom={'0.25rem'} htmlFor={'email'}>
                    {loginFeatures.fields.email.label}
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
            <FormControl isInvalid={Boolean(errors.password)}>
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
            <Button colorScheme={'purple'} isLoading={formState.isSubmitting} type={'submit'}>
                {`Login`}
            </Button>
            <Box>
                <Text>
                    {`Don't have an account? `}
                    <Link href={'/register'}>
                        {`Sign up`}
                    </Link>
                </Text>
            </Box>
        </form>
    );
}
