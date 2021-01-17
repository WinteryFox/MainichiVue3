<template>
  <slot
      name="activator"
      role="dialog"
      v-bind:on="handlers"/>

  <div class="modal" :class="{ 'is-active': isActive }">
    <div class="modal-background" @click="close"/>
    <div class="modal-content">
      <slot/>
    </div>
    <button
        class="modal-close is-large"
        aria-label="close"
        @click="close"/>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";

export default defineComponent({
  props: {
    modelValue: Boolean,
    active: {
      type: Boolean,
      default: false
    }
  },

  emits: [
    "update:modelValue"
  ],

  setup(props, {emit}) {
    const isActive = computed<boolean>(() => Boolean(props.modelValue) || props.active)

    const handlers = {
      click: () => {
        emit("update:modelValue", true)
      }
    }

    function close() {
      emit("update:modelValue", false)
    }

    return {
      props,
      handlers,
      isActive,
      close
    }
  }
})
</script>
