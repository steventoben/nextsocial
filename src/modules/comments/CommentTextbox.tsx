import {IconButton, Input, InputGroup, InputRightAddon} from "@chakra-ui/react";
import {MdSend} from "react-icons/md";
import React, {SetStateAction} from "react";
import {useRouter} from "next/router";
import {useApi} from "../../hooks/useApi";
import {ServerCommentDto} from "../../models/commentDto";

interface CommentTextboxProps {
    slug: string
    //setAddedComments: React.Dispatch<SetStateAction<ServerCommentDto[]>>;
    getNewComment?: (comment: {content: string}) => void;
}
export function CommentTextbox(props: CommentTextboxProps) {
    const {
        slug,
        getNewComment
    } = props;
    //const slug = useRouter().query.slug;
    const {createComment} = useApi();
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [value, setValue] = React.useState<string>('');
    function handleSubmit() {
        createComment(slug, value);
        getNewComment?.({content: value});
        setValue('');
    }
    return(
        <>
            <InputGroup>
                <Input value={value}
                       onChange={(ev) => setValue(ev.target.value)}
                       ref={inputRef}
                       borderRadius={0}
                       padding={'0 1rem'}
                />
                <InputRightAddon padding={'0'}>
                    <IconButton
                        bg={'white'}
                        borderRadius={0}
                        border={'inherit'}
                        aria-label={''}
                        icon={<MdSend/>}
                        onClick={handleSubmit}
                    />
                </InputRightAddon>
            </InputGroup>
        </>
    );
}
