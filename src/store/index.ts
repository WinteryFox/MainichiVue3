import {ActionContext, ActionTree, createStore, GetterTree, MutationTree} from 'vuex'
import {api} from "@/service/api";
import User from "@/interface/User";
import PartialUser from "@/interface/PartialUser";
import {UserMutations} from "@/store/actions";
import Like from "@/interface/Like";
import Post from "@/interface/Post";
import Comment from "@/interface/Comment";

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

interface Actions {
    [UserMutations.FETCH_SELF](context: ActionContext<UserState, UserState>): Promise<void>;

    [UserMutations.FETCH_USER](context: ActionContext<UserState, UserState>, id: string): Promise<void>;

    [UserMutations.FETCH_POSTS](context: ActionContext<UserState, UserState>): Promise<void>;
}

const actions: ActionTree<UserState, UserState> & Actions = {
    async [UserMutations.FETCH_SELF](context: ActionContext<UserState, UserState>): Promise<void> {
        try {
            const self = await api.get("/users/@me")
            const likes = await api.get(`/users/${self.data.id}/likes`)
            context.commit(UserMutations.FETCH_SELF, self.data)
            context.commit(UserMutations.FETCH_LIKES, likes.data)
        } catch (error) {
            if (error.response.status !== 401)
                throw error
        }

        return Promise.resolve()
    },

    async [UserMutations.FETCH_USER](context: ActionContext<UserState, UserState>, id: string): Promise<void> {
        if (!context.state.users[id]) {
            const response = await api.get(`/users/${id}`)
            context.commit(UserMutations.FETCH_USER, response.data)
        }

        return Promise.resolve()
    },

    async [UserMutations.FETCH_POSTS](context: ActionContext<UserState, UserState>): Promise<void> {
        const posts: Array<Post> = (await api.get(`/posts`)).data
        context.commit(UserMutations.FETCH_POSTS, posts)
        for (const user of posts.map(post => post.author)) {
            await context.dispatch(UserMutations.FETCH_USER, user);
        }

        return Promise.resolve()
    },
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Getters<S = UserState> {
}

export const getters: GetterTree<UserState, UserState> & Getters = {}

interface Mutations<S = UserState> {
    [UserMutations.FETCH_SELF](state: S, self: User | null): void;

    [UserMutations.FETCH_LIKES](state: S, likes: Array<string>): void;

    [UserMutations.FETCH_USER](state: S, user: PartialUser): void;

    [UserMutations.LIKE_CREATE](state: S, like: Like): void;

    [UserMutations.LIKE_DELETE](state: S, like: Like): void;

    [UserMutations.FETCH_POSTS](state: S, posts: Array<Post>): void;

    [UserMutations.COMMENT_CREATE](state: S, comment: Comment): void;
}

const mutations: MutationTree<UserState> & Mutations = {
    [UserMutations.FETCH_SELF](state: UserState, self: User | null): void {
        state.self = self;
    },

    [UserMutations.FETCH_LIKES](state: UserState, likes: Array<string>): void {
        state.likes = likes
    },

    [UserMutations.FETCH_USER](state: UserState, user: PartialUser) {
        state.users[user.id] = user
    },

    [UserMutations.LIKE_CREATE](state: UserState, like: Like): void {
        const post = state.posts[like.post]
        if (post) {
            state.posts[like.post] = {
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

    [UserMutations.LIKE_DELETE](state: UserState, like: Like): void {
        const post = state.posts[like.post]
        if (post) {
            state.posts[like.post] = {
                id: post.id,
                author: post.author,
                content: post.content,
                likeCount: post.likeCount - 1,
                commentCount: post.commentCount,
            }
        }

        if (like.liker == state.self?.id)
            state.likes = state.likes.filter(value => value != like.post)
    },

    [UserMutations.FETCH_POSTS](state: UserState, posts: Array<Post>): void {
        for (const post of posts)
            state.posts[post.id] = post
    },

    [UserMutations.POST_CREATE](state: UserState, post: Post): void {
        state.posts[post.id] = post
    },

    [UserMutations.COMMENT_CREATE](state: UserState, comment: Comment): void {
        const post = state.posts[comment.post]

        if (post)
            state.posts[comment.post] = {
                id: post.id,
                author: post.author,
                content: post.content,
                likeCount: post.likeCount,
                commentCount: post.commentCount + 1
            }
    }
}

export default createStore<UserState>({
    state,
    getters,
    mutations,
    actions,
    strict: process.env.NODE_ENV !== 'production'
})
