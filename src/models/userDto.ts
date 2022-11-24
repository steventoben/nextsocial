import {PostDto, PostServerResponseDto, PostWithCommentsDto} from "./postDto";
import {CommentDto, ServerCommentDto} from "./commentDto";

export interface UserDto {
    id?: number;
    username: string;
    avatar: AvatarType | null;
}

export interface UserStats {
    postsCount: number;
    followersCount: number;
    followingCount: number;
}

export type AvatarType = {id?: string; key?: string; url?: string} | string;

export interface UserStatsSummary extends UserDto, UserStats {

}

export interface UserOverviewDto extends UserDto {
    bio?: string;
    posts: PostWithCommentsDto[];
    likes: PostWithCommentsDto[];
    comments: CommentDto[];
    isFollowing: boolean;
}

export interface ProfilePageDto {
    id: number | null;
    username: string | null;
    bio: string | null;
    avatar: AvatarType | null;
    posts: PostServerResponseDto[];// | null;
    comments: ServerCommentDto[] | null;
    favorites: PostServerResponseDto[];// | null;
    isFollowing: boolean | null;
}
export interface ProfilePageDataDto extends ProfilePageDto {
    followersCount: number;
    followingCount: number;
    //isFollowing?: boolean;
}
