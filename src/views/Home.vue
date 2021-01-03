<template>
  <Header/>
  <Feed/>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Feed from '@/views/Feed.vue';
import Header from "@/components/Header.vue";

export default defineComponent({
  name: 'Home',
  components: {
    Feed,
    Header,
  },
});
</script>
