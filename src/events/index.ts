import EventSource from "eventsource";
import {apiUri} from "@/service/api";
import {UserMutations} from "@/store/actions";
import store from "@/store"

const events: Record<string, UserMutations> = {
    "LIKE_CREATE": UserMutations.LIKE_CREATE,
    "LIKE_DELETE": UserMutations.LIKE_DELETE,
    "POST_CREATE": UserMutations.POST_CREATE,
    "COMMENT_CREATE": UserMutations.COMMENT_CREATE,
}

const publisher = new EventSource(
    `${apiUri}/events`,
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    }
)

publisher.onmessage = e => {
    const event = JSON.parse(e.data)
    store.commit(events[event.type], event.data)
}
