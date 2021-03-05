<template>
  <div class="box">
    <PostComponent :post="post"/>
    <PostControlsComponent class="is-justify-content-space-evenly"
                           :post="post"/>
    <div v-for="comment in comments" :key="comment.id">
      <div class="dropdown-divider"/>
      <CommentComponent :comment="comment"/>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {useRoute, useRouter} from "vue-router";
import PostComponent from "@/components/PostComponent.vue";
import Post from "@/interface/Post";
import {useStore} from "vuex";
import {UserState} from "@/store";
import {UserMutations} from "@/store/actions";
import {api} from "@/service/api";
import CommentComponent from "@/components/CommentComponent.vue";
import PostControlsComponent from "@/components/PostControlsComponent.vue";

export default defineComponent({
  name: "Post",

  components: {
    PostControlsComponent,
    PostComponent,
    CommentComponent
  },

  async setup() {
    const store = useStore<UserState>()
    const router = useRouter()
    const route = useRoute()
    const post = computed<Post | null>(() => store.state.posts[route.params.id.toString()]);

    if (post.value == null)
      await store.dispatch(UserMutations.FETCH_POSTS, route.params.id) // TODO

    const comments = (await api.get(`/posts/${post.value?.id}/comments`)).data

    function close() {
      router.push("/")
    }

    return {
      close,
      post,
      comments
    }
  }
})
</script>

<style lang="sass" scoped>
.box
  display: flex
  flex-direction: column
  flex-grow: 1
  width: 100%
  max-width: 568px
  margin: 0 auto
</style>
