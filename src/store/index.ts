import {ActionContext, ActionTree, createStore, GetterTree, MutationTree} from 'vuex'
import {api} from "@/service/api";
import User from "@/interface/User";
import PartialUser from "@/interface/PartialUser";
import {UserMutations} from "@/store/actions";

export interface UserState {
    self: User | null;
    users: Record<string, PartialUser>;
    likes: Array<bigint>;
}

const state: UserState = {
    self: null,
    users: {},
    likes: [],
}

interface FetchSelf {
    readonly self: User;
    readonly likes: Array<bigint>;
}

interface Actions {
    [UserMutations.FETCH_SELF](context: ActionContext<UserState, UserState>): Promise<void>;

    [UserMutations.FETCH_USER_BATCH](context: ActionContext<UserState, UserState>, ids: Array<string | bigint>): Promise<void>;
}

const actions: ActionTree<UserState, UserState> & Actions = {
    async [UserMutations.FETCH_SELF](context: ActionContext<UserState, UserState>): Promise<void> {
        try {
            const self = await api.get("/users/@me")
            const likes = await api.get(`/users/${self.data.snowflake}/likes`)
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
    }
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Getters<S = UserState> {
}

export const getters: GetterTree<UserState, UserState> & Getters = {}

interface Mutations<S = UserState> {
    [UserMutations.FETCH_SELF](state: S, data: FetchSelf): void;

    [UserMutations.FETCH_USER_BATCH](state: S, users: Array<PartialUser>): void;
}

const mutations: MutationTree<UserState> & Mutations = {
    [UserMutations.FETCH_SELF](state: UserState, data: FetchSelf) {
        state.self = data.self;
        state.likes = data.likes;
    },

    [UserMutations.FETCH_USER_BATCH](state: UserState, users: Array<PartialUser>) {
        for (const user of users)
            state.users[user.snowflake.toString()] = user
    }
}

export default createStore<UserState>({
    state,
    getters,
    mutations,
    actions,
    strict: process.env.NODE_ENV !== 'production'
})
