<template>
  <div class="post">
    <router-link class="background" :to="postUrl"/>
    <div class="box px-3 my-0 py-2 is-shadowless">
      <div class="is-flex">
        <router-link :to="userUrl">
          <AvatarComponent class="mr-3" :avatar="user.avatar" size="59"/>
        </router-link>

        <div class="is-flex is-flex-direction-column details">
          <router-link :to="userUrl" class="is-flex user-row">
            <span class="username">{{ user.username }}</span>
            <span class="ml-2 time has-text-grey">· {{ date }}</span>
          </router-link>

          <div class="content" tabindex="0">{{ post.content }}</div>
        </div>
      </div>

      <div class="buttons mt-2">
        <button class="button is-rounded green" @click="comment">
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
        <DropdownComponent>
          <template #activator="{ on }">
            <button class="button is-rounded icon-only cyan"
                    v-on="on">
              <span class="icon"><i class="material-icons">more_horiz</i></span>
            </button>
          </template>

          <template #default>
            <a class="is-flex is-align-items-center dropdown-item" @click="copyUrl(`/posts/${post.snowflake}`)">
              <span class="icon mr-2"><i class="material-icons">link</i></span>
              Copy tweet link
            </a>
          </template>
        </DropdownComponent>
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
import moment from "moment";
import DropdownComponent from "@/components/DropdownComponent.vue";
import {copyUrl} from "@/interface/Functions"

export default defineComponent({
  components: {
    DropdownComponent,
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
    const isLiked = computed<boolean>(() =>
        store.state.likes.find(value => value == props.post.snowflake) != null
    )

    await store.dispatch(UserMutations.FETCH_USER_BATCH, [props.post.author])
    const user: PartialUser = store.state.users[props.post.author.toString()]

    const time = Number(1577836800000n + (BigInt(props.post.snowflake) >> 22n))
    const date = moment(time).fromNow(true)

    async function likePost() {
      if (!isLiked.value)
        await api.post(`/posts/${props.post.snowflake}/likes`)
      else
        await api.delete(`/posts/${props.post.snowflake}/likes`)
    }

    async function comment() {
      // TODO
    }

    const userUrl = `/users/${user.snowflake}`
    const postUrl = `/posts/${props.post.snowflake}`

    return {
      props,
      user,
      apiUri,
      likePost,
      comment,
      isLiked,
      date,
      postUrl,
      userUrl,
      copyUrl
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

.background
  position: absolute
  width: 100%
  height: 100%

.post
  position: relative

.details
  min-width: 0

.user-row
  z-index: 1

  .username
    color: $black
    font-weight: 800
    font-size: 18px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis

  .time
    flex-shrink: 0

.content
  display: flex
  color: $black
  font-size: 18px
  overflow-wrap: break-word

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
