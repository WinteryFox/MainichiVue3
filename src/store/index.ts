import {createStore} from 'vuex'
import {ADD_USER, ADD_USER_BATCH, FETCH_USER, FETCH_USER_BATCH} from "@/store/actions";
import {api} from "@/service/api";
import User from "@/interface/User";
import {UserState, state} from "@/store/UserState";

export default createStore<UserState>({
    state,

    mutations: {
        [ADD_USER](state, user: User) {
            console.debug(`Pushing user ${user.snowflake} to store`)
            state.users[user.snowflake.toString()] = user
        },

        [ADD_USER_BATCH](state, batch: Set<User>) {
            console.debug(`Pushing user batch to store`)

            for (const user of batch)
                state.users[user.snowflake.toString()] = user
        }
    },

    actions: {
        async [FETCH_USER]({commit, state}, snowflake: bigint): Promise<User> {
            if (!(snowflake.toString() in state.users)) {
                console.debug(`Fetching user ${snowflake}`)
                const response = await api.get(`/users/${snowflake}`)
                if (response.status === 200)
                    commit(ADD_USER, response.data[0])
                else
                    throw new Error("API returned non-2xx code")

                return response.data
            }

            console.debug(`Returning user ${snowflake} from store`)
            return new Promise(resolve => resolve(state.users[snowflake.toString()]))
        },

        async [FETCH_USER_BATCH]({commit, state}, snowflakes: Array<bigint>): Promise<Array<User>> {
            console.debug(`Fetching user batch ${snowflakes.toString()}`)
            const toFetch = snowflakes.filter(value => !(value.toString() in state.users)).toString()
            const response = await api.get(`/users/${toFetch}`)

            commit(ADD_USER_BATCH, response.data)
            return response.data
        }
    },

    strict: process.env.NODE_ENV !== 'production'
})
