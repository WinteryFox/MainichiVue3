<template>
  <div class="container is-fluid">
    <PostComponent
        v-for="post in posts"
        :key="post.snowflake"
        :post="post"/>
  </div>

  <ModalComponent v-model="createOverlay">
    <template v-slot:activator="{ on }">
      <div class="buttons m-5">
        <button
            v-if="self != null"
            class="button is-rounded is-primary is-large px-5"
            v-on="on">
          <span class="icon"><i class="material-icons">add</i></span>
        </button>
        <button
            v-else
            class="button is-rounded is-primary is-large px-5
            has-tooltip-danger has-tooltip-arrow has-tooltip-left"
            data-tooltip="Login to create a post"
            disabled>
          <span class="icon"><i class="material-icons">add</i></span>
        </button>
      </div>
    </template>

    <div class="box">
      <div class="field">
        <div class="control">
          <label>
            <span class="subtitle">
              Time to write your beautiful post
            </span>
            <textarea
                class="textarea"
                placeholder="..."
                v-model="content"/>
          </label>
        </div>
      </div>

      <div class="field is-grouped">
        <div class="control">
          <button
              class="button is-link"
              @click="createPost">
            Create
          </button>
        </div>
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue"
import PostComponent from "@/components/PostComponent.vue"
import {api} from "@/service/api"
import Post from "@/interface/Post"
import {useStore} from "vuex"
import {UserMutations} from "@/store/actions"
import ModalComponent from "@/components/ModalComponent.vue"
import {useRouter} from "vue-router"
import User from "@/interface/User"
import {UserState} from "@/store"

export default defineComponent({
  components: {
    ModalComponent,
    PostComponent
  },

  async setup() {
    const router = useRouter()
    const store = useStore<UserState>()

    const posts = ref(new Array<Post>())
    const self = computed<User | null>(() => store.state.self)

    const createOverlay = ref<boolean>(false)
    const content = ref<string>("")

    async function fetchPosts() {
      try {
        const response = await api.get(`/posts`)
        posts.value = posts.value.concat(response.data as Array<Post>)
        posts.value.sort((p1, p2) => p1.snowflake < p2.snowflake ? -1 : 1)

        await store.dispatch(UserMutations.FETCH_USER_BATCH, posts.value.map(value => value.author))
      } catch (error) {
        alert("Something went wrong, please try again later.")
        console.error(error)
      }
    }

    await fetchPosts()

    async function createPost() {
      createOverlay.value = false

      try {
        const params = new URLSearchParams()
        params.append("content", content.value)

        const response = await api.post(
            "/posts",
            params
        )

        posts.value = new Array<Post>()
        await fetchPosts()
        await router.push(`/posts/${response.data.snowflake}`)
      } catch (e) {
        console.error(e)
        alert("Something went wrong, try again later!")
      }
    }

    return {
      posts,
      self,
      createOverlay,
      content,
      createPost
    }
  }
})
</script>

<style scoped lang="sass">
.buttons
  position: fixed
  right: 0
  bottom: 0
</style>
