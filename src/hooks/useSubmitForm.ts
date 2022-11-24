import React from "react";

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
enum HttpMethods {
    Get = 'GET',
    Post = 'POST',
    Patch = 'PATCH',
    Put = 'PUT',
    Delete = 'DELETE'
}
export enum StatusCodes {
    Ok = 200,
    Created = 201,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500
}
type StatusCode = {
    [key in keyof typeof StatusCodes]?: string;
};
const method: HttpMethod = HttpMethods.Get;
interface IResponse<T = object> extends Response {
    data: T;
}
interface ResponseStatus {
    code: number;

}
export interface ResponseObject<T> {
    raw: Response;
    data: T | null;
}
type ResponsePipe = (response: ResponseObject<any>) => ResponseObject<any>;
interface Query {
    [key: string]: string;
}
interface FetchOptions {
    bodyProvider?: () => any;
    queryProvider?: () => object;
    requestInterceptors?: ((request: Request) => Request)[];
    responseInterceptors?: ((response: ResponseObject<any>) => void)[];
}
interface FetchConfig {
    url: string;
    method: HttpMethod;
    formBody: FormData | string;
}
export function useAuthToken() {
    const token = React.useRef<string | null>(null);

    React.useEffect(() => {
        token.current = localStorage.getItem('token');
    }, []);
    const getToken = React.useCallback(function (){
        return token.current;
    }, [token]);
    const setToken = React.useCallback(function (_token: string){
        token.current = _token;
    }, [token]);
    return {getToken, setToken, token};
}
export function useSubmitForm(options?: FetchConfig) {


    /*const requestSent = React.useRef<boolean>(false);
    //const [isFetching, setIsFetching] = React.useState<boolean>(false);
    const [isFetching, setIsFetching] = React.useState<boolean>(false);
    const isResponseAvailable = React.useMemo(() => requestSent.current && !isFetching, [requestSent, isFetching]);
    //const isResponseAvailable = requestSent.current && !isFetching;
    const fetchOptions = React.useRef<FetchConfig>({
        url: fetchUrl,
        method: 'POST',
        formBody: formData
    });*/
    /*const [responseObject, setResponseObject] = React.useState<ResponseObject<any>>({
        raw: emptyResponse,
        data: null
    });*/
    //const authToken = window.localStorage.getItem('token');
    const {getToken, setToken} = useAuthToken();
    const authToken = getToken();
    console.log(authToken);
    const headers = {
        //'Content-Type': 'multipart/form-data',
        //'Access-Control-Allow-Origin': `${process.env.REACT_APP_BASE_DOMAIN}`,
        //'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
    };
    const reqHeaders: Headers = new Headers(headers);
    const requestInit: RequestInit = {
        method: options?.method,
        headers: reqHeaders,
        body: options?.formBody,
        mode: "cors",
        redirect: "follow",
        credentials: 'include'
    };




    async function handleResponse(fetchResponse: Response) {
        const response = fetchResponse.clone();
        console.log('Handle response begin');
        if(response.status===401) {
            console.log('Handle response unauthorized');
            const json = await response.json();
            /*return <ResponseObject<T>> {
                raw: response,
                data: json
            };*/
            return response;
        }
        if(response.status >= 200 && response.status <= 300) {
            console.log('Handle response successful');

            //const json = await handleData(response.json());
            //const json = await response.json();
            /*if(json.token) {
                setToken(json.token);
            }*/
            /*setResponseObject({
                raw: response,
                data: json
            });*/

            /*return <ResponseObject<T>>{
                raw: response,
                data: json
            };*/
            return response;
        }
        return response;
    }
    //useUpdateEffect(() => requestSent.current = false, [responseObject]);
    async function handleFetch(options: FetchConfig) {
        /*if(fetchOptions.current.url) {
            if (outgoingRequests.has(fetchOptions.current.url)){
                return outgoingRequests.get(fetchOptions.current.url) || responseObject;
            }
        }*/
        //const {getToken} = useAuthToken();
        const authToken = getToken();
        console.log(authToken);
        const headers = {
            //'Content-Type': 'multipart/form-data',
            //'Access-Control-Allow-Origin': `${process.env.REACT_APP_BASE_DOMAIN}`,
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            //'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
        };
        if(authToken) {
            Object.defineProperty(headers, 'Authorization', {value: `Bearer ${authToken}`});
            //headers['Authorization'] = `Bearer ${authToken}`;
        }
        if(typeof options.formBody !== "string") {
            Reflect.deleteProperty(headers, 'Content-Type');
            //headers["Content-Type"] = 'multipart/form-data';
        }
        const reqHeaders: Headers = new Headers(headers);
        const requestInit: RequestInit = {
            method: options?.method,
            headers: reqHeaders,
            body: options?.formBody,
            mode: "cors",
            redirect: "follow",
            credentials: 'include'
        };

        let response = {};
        try {
            console.log('Handle fetch begin fetching');
            const abortController: AbortController = new AbortController();
            const abortSignal: AbortSignal = abortController.signal;
            const timeoutId = setTimeout(() => {
                abortController.abort();
                console.log('Error. Request timed out');
            }, 5e3);
            clearTimeout(timeoutId);
            const request = new Request(`${process.env.NEXT_PUBLIC_BACKEND_API}${options.url}` as RequestInfo, {
                ...requestInit,
                method: options.method || 'POST',
                signal: abortSignal,
                body: options.formBody,
                credentials: 'include'
            });
            console.log(request);
            //const requestWithProvidedBody = modifyBody(request);
            //const requestWithProvidedQuery = provideQuery(request);
            const rawResponse = await fetch(request);
            response = await handleResponse(rawResponse.clone());
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            console.log('Handle fetch end block');
        }
        return response as Response;
    }
    const runFetch = React.useCallback(handleFetch, [options]);
    return {runFetch, handleFetch};
}
