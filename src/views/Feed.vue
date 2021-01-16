<template>
  <div class="container">
    <div v-for="post in posts" :key="post.snowflake">
      <PostComponent
          :key="post.snowflake"
          :post="post"/>
      <span class="dropdown-divider m-0"/>
    </div>
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
import {useStore} from "vuex"
import {UserMutations} from "@/store/actions"
import ModalComponent from "@/components/ModalComponent.vue"
import {useRouter} from "vue-router"
import User from "@/interface/User"
import {UserState} from "@/store"
import Post from "@/interface/Post";

export default defineComponent({
  components: {
    ModalComponent,
    PostComponent
  },

  async setup() {
    const store = useStore<UserState>()

    const posts = computed<Array<Post>>(() => {
      const posts = Object.values(store.state.posts)

      return posts.sort((v1, v2) => v1.snowflake > v2.snowflake ? -1 : 1)
    })
    const self = computed<User | null>(() => store.state.self)

    const createOverlay = ref<boolean>(false)
    const content = ref<string>("")

    await store.dispatch(UserMutations.FETCH_POSTS)

    async function createPost() {
      createOverlay.value = false

      try {
        const params = new URLSearchParams()
        params.append("content", content.value)

        await api.post("/posts", params)
      } catch (e) {
        console.error(e)
        alert("Something went wrong, try again later!")
      }
    }

    async function likePost() {
      await api.post("/posts/")
    }

    return {
      posts,
      self,
      createOverlay,
      content,
      likePost,
      createPost
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

.container
  background-color: $white-bis
  margin: 0

@include tablet
  .container
    padding: 0 20%
    max-width: 100% !important

.buttons
  z-index: 2
  position: fixed
  right: 0
  bottom: 0
</style>
