<template>
  <HeaderComponent/>
  <Suspense>
    <template #default>
      <router-view/>
    </template>
    <template #fallback>
      <LoaderComponent title="Mainichi"
                       subtitle="Loading"/>
    </template>
  </Suspense>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";
import {useStore} from "vuex";
import {UserState} from "@/store";
import {UserMutations} from "@/store/actions";

export default defineComponent({
  components: {
    LoaderComponent,
    HeaderComponent
  },

  setup() {
    useStore<UserState>().dispatch(UserMutations.FETCH_SELF)
  }
})
</script>

<style lang="sass">
@import "~@/assets/main.sass"

html, body
  height: 100%

#app
  display: flex
  flex-direction: column
  flex-basis: auto
  min-height: 100%
  font-family: 'Roboto', sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  background-color: $white-bis
</style>
