<template>
  <div class="dropdown is-right is-up"
       :class="{ 'is-active': isActive }">
    <div class="dropdown-trigger"
         ref="dropdownRef">
      <slot
          name="activator"
          role="dialog"
          v-bind:on="handlers"/>
    </div>

    <div class="dropdown-menu" role="menu">
      <div class="dropdown-content" ref="contentRef">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "DropdownComponent",

  setup() {
    const dropdownRef = ref<HTMLDivElement | null>(null)
    const isActive = ref<boolean>(false)

    function listener(event: MouseEvent) {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
        isActive.value = false
        document.removeEventListener("click", listener)
      }
    }

    return {
      isActive,
      dropdownRef,
      handlers: {
        click: (event: MouseEvent) => {
          event.preventDefault()

          isActive.value = !isActive.value
          document.addEventListener("click", listener)
        }
      }
    }
  }
})
</script>

<style lang="sass">
.dropdown-menu
  position: relative
  display: inline
  overflow-x: hidden
  overflow-y: scroll
  max-height: 200px
</style>
