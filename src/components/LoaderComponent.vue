<template>
  <ModalComponent active>
    <div class="loader-wrapper is-active">
      <div class="loader is-loading"/>
      <div class="loader-title">
        {{ props.title }}
      </div>
      <div class="loader-subtitle">
        {{ props.subtitle }}
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import ModalComponent from "@/components/ModalComponent.vue"

export default defineComponent({
  name: "LoaderComponent",

  components: {
    ModalComponent
  },

  props: {
    title: String,
    subtitle: String
  },

  setup(props) {
    return {props}
  }
})
</script>

<style lang="sass" scoped>
@import "~bulma/bulma.sass"

.loader-wrapper
  @extend .is-flex
  @extend .is-flex-direction-column

  overflow: hidden
  top: 0
  left: 0
  width: 100%
  height: 100%
  transition: opacity .3s
  display: flex
  justify-content: center
  align-items: center
  opacity: 0
  z-index: -1

  .loader-title
    @extend .has-text-white
    font-size: 32px

  .loader-subtitle
    @extend .has-text-light
    font-size: 16px

  .loader
    width: 80px
    height: 80px

  &.is-active
    opacity: 1
    z-index: 1
</style>