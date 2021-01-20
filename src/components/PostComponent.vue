<template>
  <div class="post">
    <router-link class="background" :to="postUrl"/>
    <div class="py-2">
      <div class="is-flex">
        <router-link :to="userUrl" class="avatar mr-3">
          <AvatarComponent :avatar="user.avatar" size="59"/>
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
        <ModalComponent v-model="commentOverlay">
          <template v-slot:activator="{ on }">
            <ButtonComponent color="rgb(23, 191, 99)"
                             background="rgba(23, 191, 99, 0.1)"
                             v-on="on">
              <template #default>
                <i class="material-icons">comment</i>
              </template>
              <template #meta>
                <span>{{ post.commentCount }}</span>
              </template>
            </ButtonComponent>
          </template>
          <div class="box">
            <div class="field">
              <div class="control">
                <label>
                  <span class="subtitle">Time to write your comment</span>
                  <textarea
                      class="textarea"
                      placeholder="Comment here...."
                      v-model="commentContent"/>
                </label>
              </div>
            </div>

            <div class="field is-grouped">
              <div class="control">
                <button
                    class="button is-link"
                    @click="comment">
                  Create
                </button>
              </div>
            </div>
          </div>
        </ModalComponent>
        <ButtonComponent color="rgb(224, 36, 94)"
                         background="rgba(224, 36, 94, 0.1)"
                         @click="likePost">
          <template #default>
            <i class="material-icons liked" v-if="isLiked">favorite</i>
            <i class="material-icons-outlined" v-else>favorite</i>
          </template>
          <template #meta>
            <span :class="{ 'liked': isLiked }">{{ post.likeCount }}</span>
          </template>
        </ButtonComponent>
        <DropdownComponent>
          <template #activator="{ on }">
            <ButtonComponent color="rgb(29, 161, 242)"
                             background="rgba(29, 161, 242, 0.1)"
                             icon-only="true"
                             v-on="on">
              <span class="icon"><i class="material-icons">more_horiz</i></span>
            </ButtonComponent>
          </template>

          <template #default>
            <a class="is-flex is-align-items-center dropdown-item" @click="copyUrl(`/posts/${post.id}`)">
              <span class="icon mr-2"><i class="material-icons">link</i></span>
              Copy post link
            </a>
          </template>
        </DropdownComponent>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Post from "@/interface/Post"
import {computed, defineComponent, PropType, ref} from "vue";
import {api, apiUri} from "@/service/api";
import {useStore} from "vuex";
import PartialUser from "@/interface/PartialUser";
import {UserMutations} from "@/store/actions";
import {UserState} from "@/store";
import AvatarComponent from "@/components/AvatarComponent.vue";
import moment from "moment";
import DropdownComponent from "@/components/DropdownComponent.vue";
import {copyUrl} from "@/interface/Functions"
import ButtonComponent from "@/components/ButtonComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";

export default defineComponent({
  components: {
    ButtonComponent,
    DropdownComponent,
    AvatarComponent,
    ModalComponent
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
        store.state.likes.find(value => value == props.post.id) != null
    )

    await store.dispatch(UserMutations.FETCH_USER_BATCH, [props.post.author])
    const user: PartialUser = store.state.users[props.post.author.toString()]

    const time = Number(1609459200000n + (BigInt(props.post.id) >> 22n))
    const date = ref(moment(time).fromNow(true))

    const commentOverlay = ref<boolean>(false)
    const commentContent = ref<string>("")

    async function likePost() {
      if (!isLiked.value)
        await api.post(`/posts/${props.post.id}/likes`)
      else
        await api.delete(`/posts/${props.post.id}/likes`)
    }

    async function comment() {
      await api.post(`/posts/${props.post.id}/comments`, {
        content: commentContent.value
      })
      commentOverlay.value = false
    }

    const userUrl = `/users/${user.id}`
    const postUrl = `/posts/${props.post.id}`

    setInterval(() => date.value = moment(time).fromNow(true), 60000)

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
      copyUrl,
      commentOverlay,
      commentContent
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

.buttons
  justify-content: space-evenly

.liked
  color: $pink
</style>
