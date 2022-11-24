import {LoginResponseDTO, useAuthentication} from "../auth/AuthenticationProvider";
import {SubmitHandler, useForm} from "react-hook-form";
import React, {ReactNode, SetStateAction} from "react";
import {useSubmitForm} from "../../hooks/useSubmitForm";
import {useRouter} from "next/router";
import {
    Box,
    Button, Divider,
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

interface RegisterFields {
    email: string;
    password: string;
}

interface RegisterResponseDto {
    id: number;
    username: string;
    token: string;
}


interface RegisterFormProps {
    formHeading?: string;
    fields?: {[field: string]: string};
    footer?: ReactNode;
    ///type: 'login' | 'register';
    setIsLogin: React.Dispatch<SetStateAction<boolean>>;
}
export function RegisterForm(props: RegisterFormProps) {
    const {
       // type
        setIsLogin
    } = props;
    const authenticationManager = useAuthentication();
    const {handleSubmit, register, formState: {errors, ...formState}} = useForm<RegisterFields>();
    const [formResponse, setFormResponse] = React.useState<LoginResponseDTO | null>(null);
    const {handleFetch: submitForm} = useSubmitForm();
    const router = useRouter();
    const onSubmit: SubmitHandler<RegisterFields> = (data) => {
        console.log(data);
        let formData: FormData = new FormData();
        formData.set('username', data.email);
        formData.set('password', data.password);
        submitForm({
            url: '/users', //form[formState].endpoint
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
        <form autoComplete={'off'} onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={Boolean(errors.email)}>
                <FormLabel fontSize={'0.875rem'} marginBottom={'0.25rem'} htmlFor={'email'}>
                    {'Email'}
                </FormLabel>
                <InputGroup>
                    <InputLeftElement>
                        <AiOutlineUser/>
                    </InputLeftElement>
                    <Input
                        autoComplete={'off'}
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
                        autoComplete={'new-password'}
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
            <Spacer height={'1.5rem'}/>
            <Button width={'full'} colorScheme={'primary'} isLoading={formState.isSubmitting} type={'submit'}>
                {`Create your account`}
            </Button>
            <Divider marginTop={'2rem'} marginBottom={'1rem'}/>
            <Box display={'inline-flex'} alignItems={'center'}>
                <Text>
                    {`Already have an account? `}

                    {/*<Link href={'/login'}>
                        {`Login`}
                    </Link>*/}
                </Text>
                <Button marginLeft={'0.5rem'} variant={'unstyled'} onClick={() => setIsLogin(true)}>
                    {'Login'}
                </Button>
            </Box>
        </form>
    );
}
