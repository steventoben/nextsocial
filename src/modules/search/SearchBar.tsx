import React, {Context, ReactNode} from "react";
import {Box, Input, InputGroup, InputLeftElement, useOutsideClick, useUpdateEffect} from "@chakra-ui/react";
import {useFetchHook} from "../../hooks/useFetchHook";
import {useDebouncedState} from "../../hooks/useDebouncedState";
import {MdOutlineSearch} from "react-icons/md";
import {useRouter} from "next/router";
import {urlQueryToSearchParams} from "next/dist/shared/lib/router/utils/querystring";
import {SearchResults} from "./SearchResults";
import {PostServerResponseDto} from "../../models/postDto";
import {UserDto} from "../../models/userDto";
import {CommunityDto} from "../../models/communityDto";

export interface SearchResultsDto {
    posts: PostServerResponseDto[];
    users: UserDto[];
    communities: CommunityDto[]
}

export const SearchContext: Context<any> = React.createContext({});
interface SearchProviderProps {
    children: ReactNode;
    minLength?: number;
}
export function SearchProvider(props: SearchProviderProps) {
    const {
        children,
        minLength = 2
    } = props;
    const [queryValue, setQueryValue] = React.useState<string>('');
    //const [searchedValue, setSearchedValue] = React.useState<string>('');
    const searchCache = React.useRef(new Map<string, SearchResultsDto>());
    const [searchResults, setSearchResults] = React.useState<SearchResultsDto|null>(null);
    //debounced input value from search bar
    const [inputValue$, setInputValue$] = useDebouncedState<string>(500, '');
    //input value state of search bar
    const [inputValue, setInputValue] = React.useState<string>('');
    //if search results popup is open
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const {handleFetch: runQuery} = useFetchHook<SearchResultsDto>(`${process.env.NEXT_PUBLIC_BACKEND_API}/search`, 'GET', {
        queryProvider: () => {
            return {
                q: queryValue
            };
        }
    })
    const handleEnterPress = React.useCallback((ev: React.KeyboardEvent<HTMLInputElement>) => {
        if(ev.key === 'Enter') {

        }
    }, []);
    useUpdateEffect(() => {
        if(queryValue.length < minLength) {
            return;
        }
        //if new query value has already been searched get results from cache
        if(searchCache.current.has(queryValue)) {
            const results = searchCache.current.get(queryValue);
            if(results) {
                setSearchResults(results);
            }
            //setSearchResults(searchCache.current.get(queryValue));
            return;
        }
        //fetch search results....
        const run = async () => {
            let results = await runQuery();
            if(results.data) {
                searchCache.current.set(queryValue, results.data);
                setSearchResults(results.data);

                //setSearchResultsValue(results.data);
            }
        }
        run();
        //let results = runQuery().then(value => value);

        //searchCache.current.set(queryValue, results)
    }, [queryValue]);
    useUpdateEffect(() => {
        //realistically queryValue state isn't needed since it's just synced to the input's debounced value state
        //i just think it's easier to read having the query value be it's own state variable
        setQueryValue(inputValue$);
    }, [inputValue$]);
    return(
        <SearchContext.Provider value={{inputValue, setInputValue,inputValue$, setInputValue$,searchResults, setSearchResults}}>
            {children}
        </SearchContext.Provider>
    );
}

interface SearchBarProps {}
export function SearchBar(props: SearchBarProps) {
    const {} = props;
    const {inputValue, setInputValue, inputValue$, setInputValue$,searchResults} = React.useContext(SearchContext);
    const [value, setValue] = React.useState<string>('');
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const hasResults = React.useMemo(() => searchResults!==null, [searchResults]);
    useUpdateEffect(() => {
        if(searchResults!==null) {
            setIsOpen(true);
        }
    }, [searchResults]);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const router = useRouter();
    function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
        setValue(ev.target.value);
        setInputValue$(ev.target.value);
        if(!ev.target.value.length) {
            setIsOpen(false);
        }
    }
    function handleKeyUp(ev: React.KeyboardEvent<HTMLInputElement>) {
        if(ev.key === 'Enter') {
            console.log(`Searching for ${value}`);
            setIsOpen(false);
            router.push({pathname: '/search', search: `?q=${value}`});
        }
        if(ev.key === 'Escape') {
            setIsOpen(false);
        }
    }
    useOutsideClick({
        ref: containerRef,
        handler: e => {
            setIsOpen(false);
        }
    })

    return(
        <Box ref={containerRef}>
            <InputGroup>
                <InputLeftElement>
                    <MdOutlineSearch/>
                </InputLeftElement>
                <Input onKeyUp={handleKeyUp} value={value} onChange={handleChange}/>
            </InputGroup>
            <SearchResults searchResults={searchResults} isOpen={isOpen}/>
        </Box>
    );
}
interface SearchResultsPreviewProps {
    searchResults: SearchResultsDto;
    isOpen: boolean;

}
export function SearchResultsPreview(props: SearchResultsPreviewProps) {
    const {
        searchResults,
        isOpen
    } = props;
    return(
        <Box>

        </Box>
    );
}
