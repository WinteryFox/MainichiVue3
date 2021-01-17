<template>
  <ModalComponent active @update:model-value="close">
    <PostComponent :post="post"/>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from "@/components/ModalComponent.vue"
import {computed, defineComponent} from "vue";
import {useRoute, useRouter} from "vue-router";
import PostComponent from "@/components/PostComponent.vue";
import Post from "@/interface/Post";
import {useStore} from "vuex";
import {UserState} from "@/store";
import {UserMutations} from "@/store/actions";

export default defineComponent({
  name: "Post",

  components: {PostComponent, ModalComponent},

  async setup() {
    const store = useStore<UserState>()
    const router = useRouter()
    const route = useRoute()
    const post = computed<Post | null>(() => store.state.posts[route.params.id.toString()]);

    if (post.value == null)
      await store.dispatch(UserMutations.FETCH_POSTS, route.params.id)

    function close() {
      router.push("/")
    }

    return {
      close,
      post
    }
  }
})
</script>
