export const appRoutes = {};

export const ApiRoutes = {
    Search: '/search?q=:term',//
    MyGroups: '/users/me/communities',//
    Community: '/community/:name',//
    MyFeed: 'users/my-feed',//
    Post: 'posts/post/:slug',//
    MyPreferences: 'users/me/preferences',//
    Topic: 'posts/tag/:topic',//
    User: '/users/:username',//
    MyFollowers: 'users/me/followers',//
    MyFollowing: '/users/me/following',//
    MyStats: '/users/my-stats',//
    Users: '/users',//
    Favorite: '/posts/:slug/favorite',//
    Follow: '/users/:username/follow',//
    Join: 'community/:name',//
    Comment: 'posts/:slug/comment',//
    RemoveComment: 'comments/:commentId',//
    Auth: '/auth/authenticate',//
    AllPosts: '/posts/all'//
};

