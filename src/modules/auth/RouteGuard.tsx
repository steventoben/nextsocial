import React, {ReactChildren, ReactElement, ReactNode} from "react";
import {useRouter} from "next/router";
import {useAuthentication} from "./AuthenticationProvider";
//import {AppRoutes} from "../../constants/routes";

interface Props {
    children: ReactElement;
}
export function RouteGuard(props: Props) {
    const {
        children
    } = props;
    const authenticationManager = useAuthentication();
    const router = useRouter();
    if(
        authenticationManager.isBlocking
        ||
        (!authenticationManager.isAuthenticated() && router.pathname !== '/login')
    ) {
        return (
            <div>{router.pathname}</div>
        );
    }
    return children;
}
/*export function RouteGuard(props: Props) {
    const {
        children
    } = props;
    const authenticationManager = useAuthentication();
    const router = useRouter();
    const isAllowed = React.useMemo(() => (authenticationManager.isBlocking || (!authenticationManager.isAuthenticated() && router.pathname !== AppRoutes.login )), []);
    /!*if(
        authenticationManager.isBlocking
        ||
        (!authenticationManager.isAuthenticated() && router.pathname !== AppRoutes.login )
        &&
        (!authenticationManager.isAuthenticated() && router.pathname !== AppRoutes.register)
    ) {
        return (
            authenticationManager.isAuthenticated() ?
                children
                :
                <div>
                    <p>{authenticationManager.isAuthenticated()}</p>
                    <p>{authenticationManager.isBlocking}</p>
                </div>
        );
    }*!/
        return (
            !isAllowed ? children :
                <div>
                <Typography variant={'h1'}>{`Not authorized`}</Typography>
            </div>
        );
}*/
