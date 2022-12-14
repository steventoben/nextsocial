import {Box, Input, Tag, TagCloseButton, TagLabel} from "@chakra-ui/react";
import React, {SetStateAction} from "react";

interface TagInputProps {
    tags: string[];
    setTags: React.Dispatch<SetStateAction<string[]>>;
}
export function TagInput(props: TagInputProps) {
    const {
        tags,
        setTags
    } = props;
    //const [tags, setTags] = React.useState<string[]>([]);
    const [value, setValue] = React.useState<string>('');
    const addTag = (tagValue: string) => {
        //setTags(prevState => prevState.concat(tagValue));
        setTags(prevState => Array.from(new Set<string>(prevState.concat(tagValue))));
        //setTags(prevState => prevState.concat(value));
        //setValue('');
    }
    const removeTag = (tagValue: string) => {
        setTags(prevState => prevState.filter(value => value !== tagValue));
    }
    function handleKeyUp(ev: React.KeyboardEvent<HTMLInputElement>) {
        if(ev.key === 'Enter') {
            //ev.currentTarget.value
            addTag(ev.currentTarget.value);
            setValue('');
        }
    }
    return(
        <Box position={'relative'}
             display={'inline-flex'}
             maxWidth={'32rem'}
             flexWrap={'nowrap'}
             flexDirection={'row'}
             border={'1px solid'}
             borderColor={'gray.200'}
             borderRadius={'0.5rem'}
             alignItems={'flex-end'}
        >
            <Box display={'inline-flex'} flexWrap={'wrap'} flexDirection={'row'} gap={'0 0.5rem'} position={'relative'}>
                {tags.map((tag) => {
                    return(
                        <Tag sx={{'&:hover, &:focus-within': {borderColor: 'red', bg: 'red.50', color: 'red'}}} key={tag} letterSpacing={'0.025em'} fontWeight={700} fontFamily={'Helvetica Neue'} border={'1px solid'} borderColor={'primary.500'} color={'primary.700'} bg={'primary.50'}>
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={() => removeTag(tag)}/>
                        </Tag>
                    );
                })}
                {/*{tags.map((tag) => {
                    return(
                        <Tag key={tag}>
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={() => removeTag(tag)}/>
                        </Tag>
                    );
                })}*/}
                <input
                    value={value}
                    onChange={(ev)=>setValue(ev.target.value)}
                    onKeyUp={handleKeyUp}
                />
            </Box>
            {/*<Input value={value}
                   onChange={(ev)=>setValue(ev.target.value)}
                   onKeyUp={handleKeyUp}
            />*/}
        </Box>
    );
    /*return(
        <Box position={'relative'}>
            <Box position={'absolute'}>
                {tags.map((tag) => {
                    return(
                        <Tag sx={{'&:hover, &:focus-within': {borderColor: 'red', bg: 'red.50', color: 'red'}}} key={tag} letterSpacing={'0.025em'} fontWeight={700} fontFamily={'Helvetica Neue'} border={'1px solid'} borderColor={'primary.500'} color={'primary.700'} bg={'primary.50'}>
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={() => removeTag(tag)}/>
                        </Tag>
                    );
                })}
            </Box>
            <Input value={value}
                   onChange={(ev)=>setValue(ev.target.value)}
                   onKeyUp={handleKeyUp}
            />
        </Box>
    );*/
}


interface TagInputCondensedProps {
    tags: string[];
    setTags: React.Dispatch<SetStateAction<string[]>>;
}
export function TagInputCondensed(props: TagInputCondensedProps) {
    const {
        tags,
        setTags
    } = props;
    //const [tags, setTags] = React.useState<string[]>([]);
    const [value, setValue] = React.useState<string>('');
    const addTag = (tagValue: string) => {
        //setTags(prevState => prevState.concat(tagValue));
        setTags(prevState => Array.from(new Set<string>(prevState.concat(tagValue))));
        //setTags(prevState => prevState.concat(value));
        //setValue('');
    }
    const removeTag = (tagValue: string) => {
        setTags(prevState => prevState.filter(value => value !== tagValue));
    }

    function handleKeyUp(ev: React.KeyboardEvent<HTMLInputElement>) {
        if (ev.key === 'Enter') {
            //ev.currentTarget.value
            addTag(ev.currentTarget.value);
            setValue('');
        }
    }

    return (
        <Box position={'relative'}
             display={'inline-flex'}
             maxWidth={'32rem'}
             flexWrap={'nowrap'}
             flexDirection={'row'}
             border={'1px solid'}
             borderColor={'gray.200'}
             borderRadius={'0.5rem'}
             alignItems={'flex-end'}
        >
            <Box display={'inline-flex'} flexWrap={'wrap'} flexDirection={'row'} gap={'0 0.5rem'} position={'relative'}>
                {tags.map((tag) => {
                    return (
                        <Tag sx={{'&:hover, &:focus-within': {borderColor: 'red', bg: 'red.50', color: 'red'}}}
                             key={tag} letterSpacing={'0.025em'} fontWeight={700} fontFamily={'Helvetica Neue'}
                             border={'1px solid'} borderColor={'primary.500'} color={'primary.700'} bg={'primary.50'}>
                            <TagLabel>{tag}</TagLabel>
                            <TagCloseButton onClick={() => removeTag(tag)}/>
                        </Tag>
                    );
                })}
                <input
                    value={value}
                    onChange={(ev) => setValue(ev.target.value)}
                    onKeyUp={handleKeyUp}
                />
            </Box>
            {/*<Input value={value}
                   onChange={(ev)=>setValue(ev.target.value)}
                   onKeyUp={handleKeyUp}
            />*/}
        </Box>
    );
}
