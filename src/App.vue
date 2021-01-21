<template>
  <HeaderComponent/>
  <Suspense>
    <template #default>
      <router-view/>
    </template>
    <template #fallback>
      Loading...
    </template>
  </Suspense>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import HeaderComponent from "@/components/HeaderComponent.vue";

export default defineComponent({
  components: {
    HeaderComponent
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
