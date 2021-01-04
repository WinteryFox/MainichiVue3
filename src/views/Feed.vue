<template>
  <div class="container is-fluid">
    <PostComponent
        v-for="post in posts"
        :key="post.snowflake"
        :post="post"/>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue"
import PostComponent from "@/components/PostComponent.vue"
import {api} from "@/service/api"
import Post from "@/interface/Post"
import {useStore} from "vuex";
import {UserMutations} from "@/store/actions";

export default defineComponent({
  components: {
    PostComponent
  },

  async setup() {
    const store = useStore()
    const posts = ref(new Array<Post>())

    async function fetchPosts() {
      try {
        const response = await api.get(`/posts`)
        posts.value = posts.value.concat(response.data as Array<Post>)

        await store.dispatch(UserMutations.FETCH_USER_BATCH, posts.value.map(value => value.author))
      } catch (error) {
        alert("Something went wrong, please try again later.")
        console.error(error)
      }
    }

    await fetchPosts()

    return {
      posts
    }
  }
})
</script>
