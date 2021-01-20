import {apiUri} from "@/service/api";
import {UserMutations} from "@/store/actions";
import store from "@/store"

const events: Record<string, UserMutations> = {
    "LIKE_CREATED": UserMutations.LIKE_CREATED,
    "LIKE_DELETED": UserMutations.LIKE_DELETED,
    "POST_CREATED": UserMutations.POST_CREATED,
}

const publisher = new EventSource(
    `${apiUri}/events`,
    {
        withCredentials: true
    }
)

publisher.onmessage = e => {
    const event = JSON.parse(e.data)
    store.commit(events[event.type], event.data)
}
