<template>
  <ul class="steps is-horizontal">
    <li class="steps-segment"
        :key="n"
        v-for="n in Number(stepCount)"
        :class="{ 'is-active': n === Number(modelValue) }">
      <span class="steps-marker">{{ n }}</span>
    </li>
  </ul>

  <div ref="contentRef">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, watch} from "vue";

export default defineComponent({
  name: "StepsComponent",

  props: {
    modelValue: [Number, String],
    stepCount: {
      type: [Number, String],
      required: false
    }
  },

  setup(props) {
    const contentRef = ref<HTMLDivElement | null>(null)

    watch(() => props.modelValue, () => {
      if (contentRef.value)
        contentRef.value.animate([
          {
            opacity: 0
          },
          {
            opacity: 1
          }
        ], {
          duration: 400,
          easing: "ease"
        })
    })

    return {
      props,
      contentRef
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

.steps
  .steps-segment::after, .steps-marker
    transition: background-color ease 400ms
    user-select: none
</style>
