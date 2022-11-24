import {PostDto, PostServerResponseDto, PostWithCommentsDto} from "./postDto";
import {AvatarType, UserDto} from "./userDto";

export interface CommunityDto {
    id?: number;
    name: string;
    photo?: AvatarType|null;//string | null;
    about: string;
}
export interface CommunityWithMembershipDto extends CommunityDto {
    isMember: boolean;
}
export interface CommunityCardDto {
    id?: number;
    name: string;
    photo?: AvatarType|null;//{id: number, url: string};
    about: string;
    isMember?: boolean;
}

export interface CommunityStatsDto {
    postsCount: number;
    membersCount: number;
}

export interface CommunityOverview extends CommunityDto {
    posts: PostWithCommentsDto[];
    members?: UserDto[];
    isMember?: boolean;
}

export interface CommunitiesPage {

}

export interface CommunityPageDto {
    id: number;
    name: string;
    about: string;
    photo: string;
    members: UserDto[];
    memberCount?: number;
    //posts: PostWithCommentsDto[];
    posts: PostServerResponseDto[];
    isMember: boolean;
}
