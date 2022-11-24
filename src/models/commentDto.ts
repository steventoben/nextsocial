import {UserDto} from "./userDto";

export interface CommentDto {
    id: number;
    content: string;
    parentId?: number;
    commenter: UserDto;
    createdAt: string;
}
export interface ServerCommentDto {
    id: number;
    content: string;
    commenterId?: number;
    commenter: {
        username: string,
        avatar: {
            id: number,
            key: string,
            url: string
        }
    },
    createdAt: string;
}
