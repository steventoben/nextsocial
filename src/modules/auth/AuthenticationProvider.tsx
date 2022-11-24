import {useUpdateEffect} from "@chakra-ui/react";
import React, {Context, ReactNode} from "react";
import {useRouter} from "next/router";
import {useFetchHook} from "../../hooks/useFetchHook";
import {LoginResponseDto} from "../login/LoginForm";

export interface LoginResponseDTO {
    id?: number;
    username: string;
    avatar: ImageType;
    //avatar: string;
    token: string;
}
export type ImageType = string;
export interface TestUserData {
    username: string;
    token: string;
    isAuthenticated?: boolean;
}
export interface UserData {
    id?: number;
    username: string;
    avatar: ImageType | null;
    token: string | null;
    isAuthenticated: boolean;
}
const emptyUserData: UserData = {
    id: 0,
    username: '',
    avatar: null,
    token: null,
    isAuthenticated: false
}
interface UserDataExtended extends UserData {
    communities: string[];
}
const emptyUserDataX: UserDataExtended = {
    id: 0,
    username: '',
    avatar: null,
    token: null,
    isAuthenticated: false,
    communities: []
}
export const AuthenticationContext: Context<any> = React.createContext({});
interface AuthenticationProviderProps {
    children?: ReactNode;
}
export function AuthenticationProvider(props: AuthenticationProviderProps) {
    const {
        children
    } = props;
    const router = useRouter();
    const [userData, setUserData] = React.useState<UserData | null>(null);
    const [isBlocking, setIsBlocking] = React.useState(true);
    const [path, setPath] = React.useState('');
    const {handleFetch} = useFetchHook(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/authenticate`, 'GET', {
        responseInterceptors: [
            (response) => {
                console.log(response);
                if(response.raw.status === 401) {
                    setUserData(null);
                }
            }
        ]
    });

    async function authenticate(token: string) {
        handleFetch().then(res => {
            if(res.raw.ok) {
                if(res.data.token !== token) {
                    alert('token stale');
                    router.push('/login');
                }
                //alert(res.data);
                setUserData(res.data);
                //if auth token valid on login page go to home, if valid on any other page stay there and don't redirect to login
                if(router.route === '/login') {
                    //router.push('/');
                    router.push('/feed');
                }
            } else {
                console.assert(res.raw.status===401);
                //alert(res.data);
                console.log(res);
                //auth token stale
                //redirect to /login
                router.push('/login');
            }
        });
    }
    //const {appEvents, setAppEvents, appEventState, setAppEventState} = React.useContext(AppConfigContext);
//const {addAlert} = React.useContext(AlertContext);

    //If page loaded by direct URL in browser then check for JWT in localstorage and get UserData from /authn
    React.useEffect(() => {
        //alert('test');
        const authToken = localStorage.getItem('token');
        console.log(authToken);
        if(authToken) {
            authenticate(authToken);
        } else {
            setUserData(null);
            //setAppEventState(AppEventStates.Unauthorized);
            //addAlert(<Alert severity={'error'} variant={'filled'}>{`Session expired. Please log in again.`}</Alert>);
            //appEvents.fireAndForget(ErrorEvents.Unauthorized);
            //redirect to /login
            router.push('/login')
        }
        setIsBlocking(false);
    }, []);
    useUpdateEffect(() => {
        setPath(router.pathname);
        //alert('path change');
    }, [router.pathname]);
    /*useUpdateEffect(() => {
        console.log('update fx');
        if(userData===null) {
            router.push('/login');
        }
    }, [userData]);*/
    return(
        <AuthenticationContext.Provider key={router.pathname} value={{userData, setUserData, isBlocking}}>
            {children}
        </AuthenticationContext.Provider>
    );
}
export function useAuthentication() {
    const {userData, setUserData, isBlocking} = React.useContext(AuthenticationContext);
    const getCurrentUser =  React.useCallback(() => userData, [userData]);
    const router = useRouter();
    function login(loginResponseDTO: LoginResponseDTO, callback?: Function) {
        const user: UserData = {
            ...loginResponseDTO,
            isAuthenticated: true
        };
        console.log(user);
        setUserData(user);
        //return callback(user);
    }
    function logout() {
        setUserData(emptyUserData);
        localStorage.removeItem('token');
        router.push('/login');
        //setUserData(null);
    }
    function isAuthenticated() {
        if(userData === null) {
            return false;
        }
        return getCurrentUser().isAuthenticated;
    }
    function getUserDataFromToken() {

    }
    return {login, logout, getCurrentUser, userData, isAuthenticated, isBlocking};
}
