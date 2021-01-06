<template>
  <ModalComponent active @close="close">
    <PostComponent :post="post"/>
  </ModalComponent>
</template>

<script lang="ts">
import ModalComponent from "@/components/ModalComponent.vue"
import {defineComponent, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import PostComponent from "@/components/PostComponent.vue";
import {api} from "@/service/api";
import Post from "@/interface/Post";

export default defineComponent({
  name: "Post",

  components: {PostComponent, ModalComponent},

  async setup() {
    const router = useRouter()
    const route = useRoute()
    const post = ref<Post | null>(null);

    try {
      const response = await api.get(`/posts/${route.params.snowflake}`)
      post.value = response.data
    } catch (e) {
      alert("Something went wrong!")
      await router.push("/")
    }

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
