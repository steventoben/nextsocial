import {PostDto, PostWithCommentsDto} from "../models/postDto";
import {customRandom, nanoid, random} from "nanoid";
import {CommentDto} from "../models/commentDto";
import {UserDto, UserOverviewDto, UserStatsSummary} from "../models/userDto";
import {CommunityDto, CommunityOverview, CommunityWithMembershipDto} from "../models/communityDto";

export const samplePost: PostDto = {
    slug: `slug-id-9346`,
    title: 'Perfect shrimp paella recipe',
    content: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.',
    author: {
        username: 'Steven Toben',
        avatar: 'https://d2969si02yezyk.cloudfront.net/3e10385a-0514-4416-8114-43ae9b5756b6-IMG_8375.jpg'
    },
    media: [],
    community: 'Cooking',
    topics: ['cooking', 'recipes', 'seafood', 'party dishes'],
    createdAtTime: '10 hours ago'
};
export const createPostSamples = (amount: number): PostDto[] => {
    const samplePosts: PostDto[] = [];
    for (let i = 0; i < amount; i++) {
        samplePosts.push({...samplePost, slug: nanoid(8)});
    }
    return samplePosts;
}
export const createPostWithCommentsSamples = (amount: number): PostWithCommentsDto[] => {
    const samplePosts: PostWithCommentsDto[] = [];
    for (let i = 0; i < amount; i++) {
        samplePosts.push({
            ...samplePost,
            slug: nanoid(8),
            comments: createCommentSamples(i)
            });
    }
    return samplePosts;
}


export const userSample: UserDto = {
    username: 'Steven Toben',
    avatar: 'https://d2969si02yezyk.cloudfront.net/3e10385a-0514-4416-8114-43ae9b5756b6-IMG_8375.jpg'
};

export const userWithStatsSample: UserStatsSummary = {
    ...userSample,
    postsCount: 405,
    followersCount: 15823,
    followingCount: 1203
}

export const commentSample: CommentDto = {
    id: 1,
    content: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like.',
    commenter: userSample,
    createdAt: '4 hours ago'
};

export const createCommentSamples = (amount: number): CommentDto[] => {
    const sampleComments: CommentDto[] = [];
    for (let i = 0; i < amount; i++) {
        sampleComments.push({
            ...commentSample,
            id: i
        });
    }
    return sampleComments;
}
export const communityPageSample: CommunityOverview = {
    name: 'programming',
    photo: '',
    about: 'This is a group to discuss all things programming.',
    posts: createPostWithCommentsSamples(5),
    members: [userSample],
    isMember: true
}
export const communitySample: CommunityDto = {
    name: "programming",
    about: "This is a group to discuss all things programming.",
    id: 1,
    photo: 'https://nest-social-public-bucket.s3.us-east-2.amazonaws.com/a6860168-e21b-4bcd-89e4-8078a166aedc-chris-ried-ieic5Tq8YMk-unsplash.jpeg'
};
export const communityWithMembershipSample: CommunityWithMembershipDto = {
    ...communitySample,
    isMember: true
};
export function createCommunityWithMembershipSamples(amount: number) {
    const samples: CommunityWithMembershipDto[] = [];
    for (let i = 0; i < amount; i++) {
        samples.push({
            ...communityWithMembershipSample,
            isMember: i%2==0,
            id: i
        });
    }
    return samples;
}
export const userPageSample: UserOverviewDto = {
    ...userSample,
    bio: `Hi i'm a user on this web app`,
    posts: createPostWithCommentsSamples(5),
    likes: createPostWithCommentsSamples(5),
    comments: createCommentSamples(5),
    isFollowing: true
}

export const fullPostPageSample: PostWithCommentsDto = {
    ...samplePost,
    slug: 'my-test-post',
    comments: [...createCommentSamples(5)],
}
