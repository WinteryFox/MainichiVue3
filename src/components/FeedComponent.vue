<template>
  <div class="container is-fluid">
    <PostComponent
        v-for="post in state.posts"
        :key="post.snowflake"
        :post="post"/>
  </div>
</template>

<script lang="ts">
import {reactive, onMounted, defineComponent} from "vue"
import PostComponent from "@/components/PostComponent.vue"
import {api} from "@/service/api"
import Post from "@/interface/Post"
import {useStore} from "vuex";
import {FETCH_USER_BATCH} from "@/store/actions";

export default defineComponent({
  components: {
    PostComponent
  },

  setup() {
    const store = useStore()
    const state = reactive({
      posts: new Array<Post>()
    })

    async function fetchPosts() {
      try {
        const response = await api.get(`/posts`)
        state.posts = state.posts.concat(response.data as Array<Post>)

        await store.dispatch(FETCH_USER_BATCH, state.posts.map(value => value.author))
      } catch (error) {
        alert("Something went wrong, please try again later.")
        console.error(error)
      }
    }

    onMounted(() => {
      fetchPosts()
    })

    return {
      state
    }
  }
})
</script>
