<template>
  <div class="box my-3 py-3">
    <div class="is-size-5 has-text-black">
      <p>{{ post.content }}</p>
    </div>

    <div>
      <span class="dropdown-divider"/>
      <div class="is-flex is-justify-content-space-between">
        <router-link class="has-text-grey"
                     :to="`/users/${props.post.author}`">
          <div class="is-flex is-justify-content-left">
            <figure class="image is-32x32 mr-3">
              <img
                  class="is-rounded"
                  :src="avatar"
                  alt="avatar"/>
            </figure>
            <p class="is-size-5">{{ user.username }}</p>
          </div>
        </router-link>

        <div class="is-flex is-align-self-center">
          <div class="is-flex is-align-items-center">
            <button class="button is-small no-border">
              <span class="icon">
                <i class="material-icons-outlined">favorite</i>
              </span>
            </button>
            <span class="mx-1">{{ post.likeCount }}</span>
          </div>
          <div class="is-flex is-align-items-center">
            <button class="button is-small no-border">
              <span class="icon"><i class="material-icons">comment</i></span>
            </button>
            <span class="mx-1">{{ post.commentCount }}</span>
          </div>
          <button class="button is-small no-border">
            <span class="icon"><i class="material-icons">share</i></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Post from "@/interface/Post"
import {defineComponent, PropType} from "vue";
import {apiUri} from "@/service/api";
import {useStore} from "vuex";
import PartialUser from "@/interface/PartialUser";

export default defineComponent({
  props: {
    post: {
      type: Object as PropType<Post>,
      required: true
    }
  },

  setup(props) {
    const store = useStore()
    const user: PartialUser = store.state.users[props.post.author.toString()]
    const avatar = `${apiUri}/avatars/${user.avatar}.png`

    return {
      props,
      user,
      avatar
    }
  }
})
</script>

<style scoped>
.no-border {
  border: none;
}
</style>
