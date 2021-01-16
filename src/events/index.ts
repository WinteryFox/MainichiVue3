import {apiUri} from "@/service/api";
import {UserMutations} from "@/store/actions";
import store from "@/store"

const events = new EventSource(
    `${apiUri}/events`,
    {
        withCredentials: true
    }
)
events.onmessage = e => {
    const event = JSON.parse(e.data)
    const data = event.data

    switch (event.type) {
        case "LIKE_CREATED": {
            store.commit(UserMutations.LIKE_CREATED, data)
            break
        }
        case "LIKE_DELETED": {
            store.commit(UserMutations.LIKE_DELETED, data)
            break
        }
    }
}
