<template>
  <Suspense>
    <template #default>
      <Feed/>
    </template>
    <template #fallback>
      <LoaderComponent
          title="PenWeb"
          subtitle="Now loading"/>
    </template>
  </Suspense>

  <Suspense>
    <template #default>
      <router-view/>
    </template>
    <template #fallback>
      <LoaderComponent
          title="PenWeb"
          subtitle="Fetching..."/>
    </template>
  </Suspense>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Feed from '@/views/Feed.vue';
import LoaderComponent from "@/components/LoaderComponent.vue";

export default defineComponent({
  name: 'Home',

  components: {
    LoaderComponent,
    Feed
  }
});
</script>
