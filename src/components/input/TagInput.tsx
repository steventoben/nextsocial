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
        setTags(prevState => prevState.concat(tagValue));
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
        <Box>
            <Box>
                {tags.map((tag) => {
                    return(
                        <Tag key={tag}>
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
    );
}
