<template>
  <Feed/>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Feed from '@/components/FeedComponent.vue';

export default defineComponent({
  name: 'Home',
  components: {
    Feed,
  },
});
</script>
