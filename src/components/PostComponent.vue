<template>
  <router-link :to="`/posts/${props.post.snowflake}`">
    <div class="box my-3 py-3">
      <router-link class="user is-flex"
                   :to="`/users/${props.post.author}`">
        <AvatarComponent :avatar="user.avatar" size="59"/>
        <div class="is-flex is-flex-direction-column ml-2 has-text-black">
          <span class="username">{{ user.username }}</span>
          <span class="content">{{ post.content }}</span>
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
        <button class="button is-rounded icon-only cyan">
          <span class="icon"><i class="material-icons">share</i></span>
        </button>
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

.user
  .image
    display: flex
    flex-shrink: 0

  .username
    overflow-wrap: break-word
    font-weight: 800
    font-size: 18px

  .content
    font-size: 18px

.buttons
  justify-content: space-evenly

  .button
    flex-basis: 59px
    border: none
    transition-property: color
    transition-duration: 0.2s
    padding: 0

    &.icon-only
      flex-basis: 38px
      padding: 0 !important

    .icon
      width: 38px
      height: 38px
      border-radius: 50%

    &:focus
      box-shadow: none

    &:hover
      .icon
        transition-property: background-color
        transition-duration: 0.2s

    &.pink
      &:hover, &:focus
        color: $pink
        outline-style: none
        box-shadow: none
        .icon
          background-color: rgba($pink, 0.1)
      &:focus .icon
        box-shadow: rgba($pink, 0.5) 0 0 0 2px inset

    &.cyan
      &:hover, &:focus
        color: $cyan
        outline-style: none
        box-shadow: none
        .icon
          background-color: rgba($cyan, 0.1)
      &:focus .icon
        box-shadow: rgba($cyan, 0.5) 0 0 0 2px inset

    &.green
      &:hover, &:focus
        color: $green
        outline-style: none
        box-shadow: none
        .icon
          background-color: rgba($green, 0.1)
      &:focus .icon
        box-shadow: rgba($green, 0.5) 0 0 0 2px inset

    .liked
      color: $pink
</style>
