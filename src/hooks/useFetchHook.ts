import React from "react";
import {useAuthToken} from "./useSubmitForm";
//import {useCurrentUser, UserData} from "../context/UserContextProvider";

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
    url?: string;
    method?: HttpMethod;
    body?: string;
}
const defaultFetchOptions = {
    timeout: 5e3,
    maxRetries: 5
}
const emptyResponse: Response = new Response(null, {
    headers: {},
    status: undefined,
    statusText: ''
});
function hijackResponse(response: ResponseObject<any>, callback: () => void) {
    callback();
    return response;
}
function authInterceptor(response: ResponseObject<any>) {
    if(response.raw.status === StatusCodes.Unauthorized) {

    }
}
function requestInterceptor(request: Request): Request {
    const req: Request = new Request('', {
        ...request,
        body: JSON.stringify({})
    });

    return req;
}
function appendQuery(req: Request, queryObject: Query): Request {
    //console.log(queryObject);
    let baseUrl = req.url.concat('?');
    for(const q in queryObject) {
        baseUrl = baseUrl.concat(`${q}=${queryObject[q]}`);
    }
    //console.log(req);
    const request: Request = new Request(baseUrl, {
        ...req
    });
    //console.log(request);
    return request;
}
const outgoingRequests: Map<string, Promise<ResponseObject<any>>> = new Map<string, Promise<ResponseObject<any>>>();
const outboundRequests: Set<string> = new Set<string>();
export function useFetchHook<T>(fetchUrl: string, fetchMethod: HttpMethod = HttpMethods.Get, options: FetchOptions = {}) {
    //console.log('Use fetch hook');

    //const {logInValid, setLogInValid, setUserData} = useCurrentUser();
    const {
        bodyProvider,
        queryProvider,
        requestInterceptors,
        responseInterceptors
    } = options;

    const requestSent = React.useRef<boolean>(false);
    //const [isFetching, setIsFetching] = React.useState<boolean>(false);
    const [isFetching, setIsFetching] = React.useState<boolean>(false);
    const isResponseAvailable = React.useMemo(() => requestSent.current && !isFetching, [requestSent, isFetching]);
    //const isResponseAvailable = requestSent.current && !isFetching;
    const fetchOptions = React.useRef<FetchConfig>({
        url: fetchUrl,
        method: fetchMethod,
        //body: JSON.stringify(fetchBody)
    });
    const [responseObject, setResponseObject] = React.useState<ResponseObject<T>>({
        raw: emptyResponse,
        data: null
    });
    const {getToken, token} = useAuthToken();
    const authToken = token.current;
    const headers = {
        'Content-Type': 'application/json',
        //'Access-Control-Allow-Origin': `${process.env.REACT_APP_BASE_DOMAIN}`,
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${authToken}`
    };
    const reqHeaders: Headers = new Headers(headers);
    const requestInit: RequestInit = {
        method: fetchOptions.current.method,
        headers: reqHeaders,
        //body: body,
        mode: "cors",
        redirect: "follow",
        credentials: 'include'
    };


    const query: Query = {
        limit: '50',
        page: '2'
    };
    //console.log(query);
    //console.log(appendQuery(new Request(<RequestInfo>fetchOptions.current.url, requestInit), query));

    //function setFetchOptions(fetchUrl?: string, fetchMethod?: HttpMethod, bodyPayload?: object) {
    function setFetchOptions(config: FetchConfig) {
        const {
            url,
            method,
            body
        } = config;
        /*fetchOptions.current = {
            url: fetchUrl || url,
            method: fetchMethod || method,
            body: body
            //body: JSON.stringify(fetchBody) || body
            //body: JSON.stringify(fetchBody) || JSON.stringify(body)
        };*/
        fetchOptions.current = {
            url: url || fetchUrl,
            method: method || fetchMethod,
            body: body
            //body: JSON.stringify(fetchBody) || body
            //body: JSON.stringify(fetchBody) || JSON.stringify(body)
        };
    }

    function isSuccessful(response: Response): boolean {
        const statusCode = response.status;
        if(statusCode === StatusCodes.Ok || statusCode === StatusCodes.Created) {
            console.assert(statusCode >= 200 && statusCode <= 300);
            return true;
        }
        return false;
    }
    function isClientError(response: Response): boolean {
        const statusCode = response.status;
        if(statusCode === StatusCodes.Unauthorized || statusCode === StatusCodes.Forbidden || statusCode === StatusCodes.NotFound) {
            console.assert(statusCode >= 400 && statusCode <= 500);
            return true;
        }
        return false;
    }
    function isServerError(response: Response): boolean {
        const statusCode = response.status;
        if(statusCode === StatusCodes.InternalServerError) {
            console.assert(statusCode >= 500 && statusCode <= 525);
            return true;
        }
        return false;
    }
    function isUnauthorized(response: Response): boolean {
        const statusCode = response.status;
        if(statusCode === StatusCodes.Unauthorized) {
            console.assert(isClientError(response));

            return true;
        }
        return false;
    }

    function handleUnauthorizedError() {
        console.log('Unauthorized 401. Token: ', localStorage.getItem('token'));
        localStorage.removeItem('token');
        responseInterceptors?.splice(0);

        //liveRequests.forEach((value: {}) => value)
        /*setUserData((prevData: UserData) => {
            return {
                ...prevData,
                isLoggedIn: false
            };
        })
        setLogInValid(false);*/
    }

    function modifyBody(request: Request) {
        console.log('Request before mutating body: ', request);
        if (bodyProvider) {
            const rInit: RequestInit = {
                body: bodyProvider(),
                cache: request.cache,
                credentials: request.credentials,
                headers: request.headers,
                integrity: request.integrity,
                keepalive: request.keepalive,
                method: request.method,
                mode: request.mode,
                redirect: request.redirect,
                referrer: request.referrer,
                referrerPolicy: request.referrerPolicy,
                signal: request.signal,
                window: null
            };
            console.log(rInit);
            console.log(new Request(request, rInit).body);
            //rInit = {...rInit, body: JSON.stringify(bodyProvider())}
            //const r: RequestInfo = new Request(request.url, rInit);
            //console.log(r);
            const modifiedRequest: Request = new Request(<RequestInfo>request.url, rInit);
            console.log(modifiedRequest);
            return modifiedRequest;
        }
        return request;
    }
    function provideQuery(request: Request) {
        if(queryProvider) {
            let baseUrl = request.url.concat('?');
            const queryObject: any = queryProvider();
            console.log(queryProvider())
            console.log(queryObject)
            for(const q in queryObject) {
                console.log(q, queryObject[q]);
                baseUrl = baseUrl.concat(`${q}=${queryObject[q]}&`);
            }
            console.log(baseUrl);
            const rInit: RequestInit = {
                body: request.body,
                cache: request.cache,
                credentials: request.credentials,
                headers: request.headers,
                integrity: request.integrity,
                keepalive: request.keepalive,
                method: request.method,
                mode: request.mode,
                redirect: request.redirect,
                referrer: request.referrer,
                referrerPolicy: request.referrerPolicy,
                signal: request.signal
            };
            console.log(rInit);
            const newRequest = new Request(baseUrl, rInit);
            console.log(newRequest);
            return newRequest;
        }
        return request;
    }

    async function handleResponse(fetchResponse: Response) {
        const response = fetchResponse.clone();
        console.log('Handle response begin');
        if(isUnauthorized(response)) {
            console.log('Handle response unauthorized');
            handleUnauthorizedError();
            const json = await response.json();
            return <ResponseObject<T>> {
                raw: response,
                data: json
            };
        }
        if(isSuccessful(response)) {
            console.log('Handle response successful');

            //const json = await handleData(response.json());
            const json = await response.json();

            setResponseObject({
                raw: response,
                data: json
            });

            return <ResponseObject<T>>{
                raw: response,
                data: json
            };
        }
        return response;
    }
    //useUpdateEffect(() => requestSent.current = false, [responseObject]);
    async function handleFetch() {
        if(fetchOptions.current.url) {
            if (outgoingRequests.has(fetchOptions.current.url)){
                return outgoingRequests.get(fetchOptions.current.url) || responseObject;
            }
        }

        setIsFetching(true);
        requestSent.current = false;
        let response = {};
        try {
            console.log('Handle fetch begin fetching');
            console.log(fetchOptions.current);
            const abortController: AbortController = new AbortController();
            const abortSignal: AbortSignal = abortController.signal;
            const timeoutId = setTimeout(() => {
                abortController.abort();
                console.log('Error. Request timed out');
            }, 5e3);
            clearTimeout(timeoutId);
            const jwt = token.current;
            const headers = {
                'Content-Type': 'application/json',
                //'Access-Control-Allow-Origin': `${process.env.REACT_APP_BASE_DOMAIN}`,
                'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${jwt}`
            };
            const rqHeaders: Headers = new Headers(headers);
            const request = new Request(<RequestInfo>fetchOptions.current.url, {
                ...requestInit,
                method: fetchOptions.current.method,
                signal: abortSignal,
                body: bodyProvider ? JSON.stringify(bodyProvider()) : fetchOptions.current.body,
                headers: rqHeaders
                //credentials: 'include'
            });
            console.log(request);
            //const requestWithProvidedBody = modifyBody(request);
            const requestWithProvidedQuery = provideQuery(request);

            //liveRequests.push({request: request, abort: abortController});


            //const rawResponse = await fetch(request);
            const rawResponse = await fetch(requestWithProvidedQuery);
            response = await handleResponse(rawResponse);
            outgoingRequests.set(request.url, response as Promise<ResponseObject<T>>);
            requestSent.current = true;
            console.log(response);
        } catch (error) {
            console.log(error);
        } finally {
            console.log('Handle fetch end block');
            console.log(fetchOptions.current);
            setIsFetching(false);

        }
        console.log('Handle fetch begin response mutations');
        responseInterceptors?.forEach(fn => fn(<ResponseObject<T>>response));
        console.log('Handle fetch end');
        console.log(fetchOptions.current);
        outgoingRequests.delete(fetchOptions.current.url || '')
        return response as ResponseObject<T>;
    }
    const runFetch = React.useCallback(handleFetch, [fetchOptions, options]);
    return {runFetch, handleFetch, setFetchOptions, responseObject, isFetching, isResponseAvailable};
}
