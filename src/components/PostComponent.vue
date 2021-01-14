<template>
  <div class="box my-3 py-3">
    <router-link class="is-size-5 has-text-black" :to="`/posts/${props.post.snowflake}`">
      {{ post.content }}
    </router-link>

    <div>
      <span class="dropdown-divider"/>
      <div class="is-flex is-justify-content-space-between">
        <router-link class="has-text-grey"
                     :to="`/users/${props.post.author}`">
          <div class="is-flex is-justify-content-left">
            <AvatarComponent :avatar="user.avatar" size="32"/>
            <p class="is-size-5 ml-2">{{ user.username }}</p>
          </div>
        </router-link>

        <div class="is-flex is-align-self-center">
          <div class="is-flex is-align-items-center">
            <button class="button is-small no-border" @click="likePost">
              <span class="icon">
                <i class="material-icons liked" v-if="isLiked">
                  favorite
                </i>
                <i class="material-icons-outlined" v-else>
                  favorite
                </i>
              </span>
            </button>
            <span class="mx-1"
                  :class="{ 'liked': isLiked }">
              {{ post.likeCount }}
            </span>
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
import {computed, defineComponent, PropType} from "vue";
import {api, apiUri} from "@/service/api";
import {useStore} from "vuex";
import PartialUser from "@/interface/PartialUser";
import {UserMutations} from "@/store/actions";
import {UserState} from "@/store";
import AvatarComponent from "@/components/AvatarComponent.vue";

export default defineComponent({
  components: {
    AvatarComponent
  },

  props: {
    post: {
      type: Object as PropType<Post>,
      required: true
    }
  },

  async setup(props) {
    const store = useStore<UserState>()
    const isLiked = computed<boolean>(() => store.state.likes.includes(props.post.snowflake))

    await store.dispatch(UserMutations.FETCH_USER_BATCH, [props.post.author])
    const user: PartialUser = store.state.users[props.post.author.toString()]

    async function likePost() {
      if (!isLiked.value)
        await api.post(`/posts/${props.post.snowflake}/likes`)
      else
        await api.delete(`/posts/${props.post.snowflake}/likes`)
    }

    return {
      props,
      user,
      apiUri,
      likePost,
      isLiked
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

.no-border
  border: none

.liked
  color: $pink !important
</style>
