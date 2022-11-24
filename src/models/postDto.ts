import {CommentDto, ServerCommentDto} from "./commentDto";
import {UserDto} from "./userDto";

export interface PostDto {
    slug: string;
    title: string;
    content: string;
    author: {
        username: string;
        avatar: string;
    }
    media: string[];
    community: string;
    topics: string[];
    createdAtTime: string;
    favoriteCount?: number;
    commentCount?: number;
    isMine?: boolean;
}


export interface PostWithCommentsDto extends PostDto {
    comments: CommentDto[];
}

export interface PagedPostsResultsDto {}


export interface ServerFileEntityDto {
    id: number;
    url: string;
    key: string;
}
interface ServerUserDto {
    username: string;
    createdAt?: string;
    avatar: ServerFileEntityDto;// | string | null;
}
export interface PostServerResponseDto {
    id: number;
    name: string;
    content: string;
    authorId: number;
    favoriteCount: number;
    createdAt: string;
    slug: string;
    author: ServerUserDto;
    attachments: ServerFileEntityDto[];
    categories: {id: number, name: string}[];
    community: {name: string};
    comments: ServerCommentDto[];
    isFavorited?: boolean;
}
