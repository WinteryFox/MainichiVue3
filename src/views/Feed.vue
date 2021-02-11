<template>
  <div class="box feed" v-if="self != null">
    <div class="is-flex">
      <router-link :to="`/users/${self.id}`">
        <AvatarComponent tabindex="0" class="mr-3" size="59" :avatar="self?.avatar"/>
      </router-link>
      <div class="field">
        <div class="control">
          <label>
            <textarea autofocus
                      spellcheck="true"
                      rows="2"
                      cols="100"
                      class="textarea"
                      placeholder="What's happening?"
                      ref="textarea"
                      v-model="content"
                      @input="input"/>
          </label>
        </div>

        <div class="control is-pulled-right mb-3">
          <button class="button is-rounded"
                  @click="createPost"
                  ref="button"
                  disabled>
            <span class="progress-bar" ref="progress"/>
            Create post
          </button>
        </div>
      </div>
    </div>
    <span class="dropdown-divider m-0"/>
    <div v-for="post in posts" :key="post.id">
      <PostComponent
          :key="post.id"
          :post="post"/>
      <span class="dropdown-divider m-0"/>
    </div>
  </div>

  <div class="login" v-else>
    <span class="is-size-3">
      It's time to one-up your language knowledge!
    </span>
    <label class="is-size-5 mt-5">
      Get started!
    </label>
    <router-link class="button is-info is-large is-rounded mb-3" to="/login">
      Login
    </router-link>
    <router-link class="button is-info is-large is-rounded" to="/register">
      Register
    </router-link>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue"
import PostComponent from "@/components/PostComponent.vue"
import {api} from "@/service/api"
import {useStore} from "vuex"
import User from "@/interface/User"
import {UserState} from "@/store"
import Post from "@/interface/Post";
import AvatarComponent from "@/components/AvatarComponent.vue";

export default defineComponent({
  components: {
    AvatarComponent,
    PostComponent
  },

  async setup() {
    const store = useStore<UserState>()
    const posts = computed<Array<Post>>(() => {
      const posts = Object.values(store.state.posts)

      return posts.sort((v1, v2) => v1.id > v2.id ? -1 : 1)
    })
    const self = computed<User | null>(() => store.state.self)
    const content = ref<string>("")
    const textarea = ref<HTMLInputElement | null>(null)
    const button = ref<HTMLButtonElement | null>(null)
    const progress = ref<HTMLDivElement | null>(null)

    onMounted(() => textarea.value?.focus())

    function input() {
      if (button.value != null && progress.value != null) {
        button.value.disabled = content.value.length <= 16 || content.value.length >= 1024;
        progress.value.style.width = `${Math.min(content.value.length / 17 * 100, 100)}%`

        if (button.value.disabled)
          progress.value.classList.remove("active")
        else
          progress.value.classList.add("active")
      }
    }

    async function createPost() {
      try {
        await api.post("/posts", {
          content: content.value
        })
        content.value = ""
      } catch (e) {
        console.error(e)
        alert("Something went wrong, try again later!")
      }

      content.value = ""
      input()
    }

    return {
      posts,
      self,
      content,
      createPost,
      textarea,
      input,
      button,
      progress
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

.login
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  margin: auto 18px

  .button
    width: 13em

.feed
  display: flex
  flex-direction: column
  flex-grow: 1
  max-width: 568px
  margin: 0 auto

  .button
    font-size: 18px
    background: transparent
    color: $black
    z-index: 1
    border: none

  .progress-bar
    position: absolute
    height: 100%
    background-color: rgba($turquoise, 0.5)
    border-radius: 100px
    z-index: -1

  .active
    background-color: rgba($turquoise, 0.6)

  .textarea
    border: none
    resize: none
    margin-bottom: 0.75em

    &:focus
      box-shadow: 0 0 2px 2px rgba($cyan, 0.5)
</style>
