<template>
  <div class="box my-2">
    <div class="content is-size-5 mb-0">
      {{ post.content }}
    </div>

    <div v-if="state.user != null">
      <span class="dropdown-divider"/>
      <div class="is-flex is-justify-content-space-between">
        <a class="" @click="showUser">
          <div class="is-flex is-justify-content-left">
            <figure class="image is-64x64 mr-3">
              <img
                  class="is-rounded"
                  :src="state.avatar"
                  alt="avatar"/>
            </figure>
            <p class="is-size-2">{{ state.user.username }}</p>
          </div>
        </a>

        <div class="is-align-self-center">
          <button class="button is-circular">
            <span class="icon">
              <i class="material-icons">share</i>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Post from "@/interface/Post"
import {computed, defineComponent, reactive} from "vue";
import {apiUri} from "@/service/api";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default defineComponent({
  props: {
    post: Post
  },

  setup(props) {
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      user: computed(() => store.state.users[props.post.author]),
      avatar: computed(() => `${apiUri}/avatars/${state.user.avatar}.png`)
    })

    function showUser() {
      router.push(`/users/${props.post.author}`)
    }

    return {
      props,
      state,
      showUser
    }
  }
})
</script>

<style scoped>
.is-circular {
  border-radius: 50%;
}
</style>
