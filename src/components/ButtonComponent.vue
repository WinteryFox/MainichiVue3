<template>
  <button class="button"
          :style="colors">
    <span class="icon">
      <slot name="default"></slot>
    </span>
    <span class="meta">
      <slot name="meta"></slot>
    </span>
  </button>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";

export default defineComponent({
  name: "ButtonComponent",

  props: {
    color: String,
    background: String
  },

  setup(props) {
    const colors = computed(() => {
      return {
        "--color": props.color,
        "--background": props.background
      }
    })

    return {
      colors
    }
  }
})
</script>

<style scoped lang="sass">
.button
  border: none !important

  .icon
    border-radius: 50%
    width: 38px
    height: 38px

  &:hover, &:focus
    color: var(--color) !important
    box-shadow: none !important

    .icon
      background-color: var(--background)
</style>
