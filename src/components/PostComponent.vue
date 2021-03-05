<template>
  <div class="post">
    <router-link class="background" :to="postUrl"/>
    <div class="py-2">
      <div class="is-flex">
        <router-link :to="userUrl" class="avatar mr-3">
          <AvatarComponent :avatar="author.avatar" size="59"/>
        </router-link>

        <div class="is-flex is-flex-direction-column details">
          <router-link :to="userUrl" class="is-flex user-row">
            <span class="username">{{ author.username }}</span>
            <span class="ml-2 time has-text-grey">· {{ date }}</span>
          </router-link>

          <div class="content" tabindex="0">{{ post.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Post from "@/interface/Post"
import {computed, defineComponent, PropType, ref} from "vue";
import {apiUri} from "@/service/api";
import {useStore} from "vuex";
import PartialUser from "@/interface/PartialUser";
import {UserState} from "@/store";
import AvatarComponent from "@/components/AvatarComponent.vue";
import moment from "moment";
import {copyUrl} from "@/interface/Functions"

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

  setup(props) {
    const store = useStore<UserState>()
    const author = computed<PartialUser>(() => store.state.users[props.post.author])

    const time = Number(1609459200000n + (BigInt(props.post.id) >> 22n))
    const date = ref(moment(time).fromNow(true))
    setInterval(() => date.value = moment(time).fromNow(true), 60000)

    const userUrl = `/users/${author.value.id}`
    const postUrl = `/posts/${props.post.id}`

    return {
      apiUri,
      date,
      postUrl,
      userUrl,
      copyUrl,
      author
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

.avatar
  z-index: 1
  position: static
  color: $grey-dark

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
  word-break: break-word
  white-space: pre-line
</style>
