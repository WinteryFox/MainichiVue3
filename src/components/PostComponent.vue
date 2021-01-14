<template>
  <router-link :to="`/posts/${props.post.snowflake}`">
    <div class="box my-3 py-3">
      <p class="is-size-5 has-text-black">
        {{ post.content }}
      </p>

      <span class="dropdown-divider"/>
      <div class="is-flex is-justify-content-space-between">
        <router-link class="has-text-grey"
                     :to="`/users/${props.post.author}`">
          <div class="is-flex is-justify-content-left">
            <AvatarComponent :avatar="user.avatar" size="32"/>
            <p class="is-size-5 ml-2">{{ user.username }}</p>
          </div>
        </router-link>

        <div class="buttons">
          <button class="button is-rounded green">
            <span class="icon"><i class="material-icons">comment</i></span>
            <span>{{ post.commentCount }}</span>
          </button>
          <button class="button is-rounded pink" @click="likePost">
            <span class="icon">
              <i class="material-icons liked" v-if="isLiked">favorite</i>
              <i class="material-icons-outlined" v-else>favorite</i>
            </span>
            <span :class="{ 'liked': isLiked }">
              {{ post.likeCount }}
            </span>
          </button>
          <button class="button is-rounded cyan p-2">
            <span class="icon"><i class="material-icons">share</i></span>
          </button>
        </div>
      </div>
    </div>
  </router-link>
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

.button
  border: none
  transition-property: background-color, color
  transition-duration: 0.2s
  margin-left: 7px !important

  .icon
    border-radius: 50%
    width: 38px
    height: 38px

  &:hover
    .icon
      transition-property: background-color, color
      transition-duration: 0.2s

  &.pink:hover
    color: $pink
    .icon
      background-color: rgba($pink, 0.1)

  &.cyan:hover
    color: $cyan
    .icon
      background-color: rgba($cyan, 0.1)

  &.green:hover
    color: $green
    .icon
      background-color: rgba($green, 0.1)

  .liked
    color: $pink !important
</style>
