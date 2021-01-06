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
import {defineComponent, ref} from "vue";

export default defineComponent({
  props: {
    modelValue: Boolean,
    active: {
      type: Boolean,
      default: false
    }
  },

  emits: [
    "close"
  ],

  setup(props, {emit}) {
    const isActive = ref<boolean>(!!props.modelValue || props.active)

    const handlers = {
      click: () => isActive.value = true
    }

    function close() {
      isActive.value = false
      emit("close")
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
