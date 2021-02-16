<template>
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

      <div class="box is-flex is-flex-direction-column">
        <PostComponent :post="post"/>

        <span class="dropdown-divider"/>

        <div class="is-flex mt-3">
          <AvatarComponent class="mr-3"
                           size="59"
                           :avatar="author.avatar"/>

          <div class="control text">
            <textarea class="textarea"
                      aria-label="Reply"
                      :placeholder="`Replying to @${author.username}`"
                      v-model="commentContent"></textarea>
          </div>
        </div>

        <div class="control is-align-self-flex-end mt-3">
          <button class="button is-primary"
                  @click="postComment">
            Reply
          </button>
        </div>
      </div>
    </ModalComponent>
    <ButtonComponent color="rgb(224, 36, 94)"
                     background="rgba(224, 36, 94, 0.1)"
                     @click="likePost">
      <template #default>
        <i class="material-icons liked" v-if="isLiked">favorite</i>
        <i class="material-icons" v-else>favorite_outline</i>
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
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import DropdownComponent from "@/components/DropdownComponent.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import {api} from "@/service/api";
import Post from "@/interface/Post";
import {useStore} from "vuex";
import {UserState} from "@/store";
import {copyUrl} from "@/interface/Functions";
import PostComponent from "@/components/PostComponent.vue";
import AvatarComponent from "@/components/AvatarComponent.vue";
import PartialUser from "@/interface/PartialUser";

export default defineComponent({
  name: "PostControlsComponent",

  components: {
    AvatarComponent,
    PostComponent,
    DropdownComponent,
    ButtonComponent,
    ModalComponent
  },

  props: {
    post: {
      type: Object as PropType<Post>,
      required: true
    }
  },

  setup(props) {
    const store = useStore<UserState>()

    const author = computed<PartialUser | null>(() => store.state.users[props.post.author])

    const isLiked = computed<boolean>(() =>
        store.state.likes.find(value => value == props.post.id) != null)
    const commentOverlay = ref<boolean>(false)
    const commentContent = ref<string>("")

    async function likePost() {
      if (!isLiked.value)
        await api.post(`/posts/${props.post.id}/likes`)
      else
        await api.delete(`/posts/${props.post.id}/likes`)
    }

    async function postComment() {
      await api.post(`/posts/${props.post.id}/comments`, {
        content: commentContent.value
      })
      commentContent.value = ""
      commentOverlay.value = false
    }

    return {
      commentOverlay,
      commentContent,
      likePost,
      postComment,
      isLiked,
      copyUrl,
      author
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

.liked
  color: $pink

.text
  width: 100%
</style>