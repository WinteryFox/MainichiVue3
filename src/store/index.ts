import {ActionContext, ActionTree, createStore, GetterTree, MutationTree} from 'vuex'
import {api} from "@/service/api";
import User from "@/interface/User";
import PartialUser from "@/interface/PartialUser";
import {UserMutations} from "@/store/actions";
import Like from "@/interface/Like";
import Post from "@/interface/Post";

export interface UserState {
    self: User | null;
    users: Record<string, PartialUser>;
    posts: Record<string, Post>;
    likes: Array<string>;
}

const state: UserState = {
    self: null,
    users: {},
    posts: {},
    likes: [],
}

interface FetchSelf {
    readonly self: User;
    readonly likes: Array<string>;
}

interface Actions {
    [UserMutations.FETCH_SELF](context: ActionContext<UserState, UserState>): Promise<void>;

    [UserMutations.FETCH_USER_BATCH](context: ActionContext<UserState, UserState>, ids: Array<string | bigint>): Promise<void>;

    [UserMutations.FETCH_POSTS](context: ActionContext<UserState, UserState>): Promise<void>;
}

const actions: ActionTree<UserState, UserState> & Actions = {
    async [UserMutations.FETCH_SELF](context: ActionContext<UserState, UserState>): Promise<void> {
        try {
            const self = await api.get("/users/@me")
            const likes = await api.get(`/users/${self.data.id}/likes`)
            context.commit(UserMutations.FETCH_SELF, {
                self: self.data,
                likes: likes.data
            })
        } catch (_) {
        }

        return Promise.resolve()
    },

    async [UserMutations.FETCH_USER_BATCH](context: ActionContext<UserState, UserState>, ids: Array<string | bigint>): Promise<void> {
        const missing = ids.filter(id => !(id in context.state.users))

        if (missing.length > 0) {
            const response = await api.get(`/users/${ids.toString()}`) // TODO: Error handling
            context.commit(UserMutations.FETCH_USER_BATCH, response.data)
        }

        return Promise.resolve()
    },

    async [UserMutations.FETCH_POSTS](context: ActionContext<UserState, UserState>): Promise<void> {
        const posts: Array<Post> = (await api.get(`/posts`)).data

        await context.dispatch(UserMutations.FETCH_USER_BATCH, posts.map(value => value.author))

        context.commit(UserMutations.FETCH_POSTS, posts)
    },
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Getters<S = UserState> {
}

export const getters: GetterTree<UserState, UserState> & Getters = {}

interface Mutations<S = UserState> {
    [UserMutations.FETCH_SELF](state: S, data: FetchSelf): void;

    [UserMutations.FETCH_USER_BATCH](state: S, users: Array<PartialUser>): void;

    [UserMutations.LIKE_CREATED](state: S, like: Like): void;

    [UserMutations.LIKE_DELETED](state: S, like: Like): void;

    [UserMutations.FETCH_POSTS](state: S, posts: Array<Post>): void;
}

const mutations: MutationTree<UserState> & Mutations = {
    [UserMutations.FETCH_SELF](state: UserState, data: FetchSelf) {
        state.self = data.self;
        state.likes = data.likes;
    },

    [UserMutations.FETCH_USER_BATCH](state: UserState, users: Array<PartialUser>) {
        for (const user of users)
            state.users[user.id.toString()] = user
    },

    [UserMutations.LIKE_CREATED](state: UserState, like: Like): void {
        if (like.post.toString() in state.posts) {
            const post = state.posts[like.post.toString()]
            state.posts[like.post.toString()] = {
                id: post.id,
                author: post.author,
                content: post.content,
                likeCount: post.likeCount + 1,
                commentCount: post.commentCount,
            }
        }

        if (like.liker == state.self?.id)
            state.likes.push(like.post)
    },

    [UserMutations.LIKE_DELETED](state: UserState, like: Like): void {
        if (like.post.toString() in state.posts) {
            const post = state.posts[like.post.toString()]
            state.posts[like.post.toString()] = {
                id: post.id,
                author: post.author,
                content: post.content,
                likeCount: post.likeCount - 1,
                commentCount: post.commentCount,
            }
        }

        state.likes = state.likes.filter(value => value != like.post)
    },

    [UserMutations.FETCH_POSTS](state: UserState, posts: Array<Post>): void {
        for (const post of posts)
            state.posts[post.id.toString()] = post
    },

    [UserMutations.POST_CREATED](state: UserState, post: Post): void {
        state.posts[post.id.toString()] = post
    },
}

export default createStore<UserState>({
    state,
    getters,
    mutations,
    actions,
    strict: process.env.NODE_ENV !== 'production'
})
