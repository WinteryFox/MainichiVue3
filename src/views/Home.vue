<template>
  <Suspense>
    <template #default>
      <Feed/>
    </template>
    <template #fallback>
      <LoaderComponent
          title="Mainichi"
          subtitle="Loading"/>
    </template>
  </Suspense>

  <Suspense>
    <template #default>
      <router-view/>
    </template>
    <template #fallback>
      <LoaderComponent
          title="Mainichi"
          subtitle="Loading"/>
    </template>
  </Suspense>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import Feed from '@/views/Feed.vue';
import LoaderComponent from "@/components/LoaderComponent.vue";
import {useStore} from "vuex";
import {UserState} from "@/store";
import {UserMutations} from "@/store/actions";

export default defineComponent({
  name: 'Home',

  components: {
    LoaderComponent,
    Feed
  },

  async setup() {
    const store = useStore<UserState>()

    await store.dispatch(UserMutations.FETCH_SELF)
  }
});
</script>
