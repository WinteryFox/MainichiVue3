<template>
  <div class="sel"
       ref="selRef">
    <div class="values"
         :class="{ 'dropup': dropup }"
         ref="valuesRef"
         v-if="expanded">
      <a class="value"
         v-for="value in filteredValues"
         :key="value"
         @click="clickValue(value)">
        {{ value }}
      </a>

      <span class="value"
            v-if="filteredValues.length === 0">
        No results
      </span>
    </div>

    <div class="flex"
         @click="click">
      <input type="text"
             aria-label=""
             ref="textRef"
             :placeholder="label"
             v-model="text"
             @input="input"
             @focusout="focusOut">
      <span class="icon"><i class="material-icons">expand_more</i></span>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType, ref} from "vue";

export default defineComponent({
  name: "SelectComponent",

  props: {
    modelValue: [String, Number],
    values: {
      type: Array as PropType<Array<string | number>>,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    dropup: {
      type: Boolean,
      default: false,
      required: false
    }
  },

  emits: [
    "update:modelValue"
  ],

  setup(props, {emit}) {
    const text = ref<string | number>(props.modelValue || "")
    const textRef = ref<HTMLInputElement | null>(null)
    const expanded = ref<boolean>(false)
    const filteredValues = ref<Array<string | number>>(props.values)
    const selRef = ref<HTMLDivElement | null>(null)

    function clickHandler(event: MouseEvent) {
      if (event.target && selRef.value && !selRef.value.contains(event.target as Node)) {
        document.removeEventListener("click", clickHandler)
        expanded.value = false
      }
    }

    function click() {
      if (textRef.value) {
        textRef.value.focus()
        expanded.value = true
        document.addEventListener("click", clickHandler)
      }
    }

    function clickValue(value: string) {
      text.value = value
      expanded.value = false
      emit("update:modelValue", value)
    }

    function focusOut(event: FocusEvent) {
      if (event.relatedTarget && selRef.value && !selRef.value.contains(event.relatedTarget as Node))
        expanded.value = false
    }

    function input() {
      expanded.value = true
      filteredValues.value = props.values.filter(value =>
          value.toString().startsWith(text.value.toString()))

      if (filteredValues.value.length == 1) {
        expanded.value = false
        emit("update:modelValue", filteredValues.value[0])
      } else {
        emit("update:modelValue", "")
      }
    }

    return {
      props,
      filteredValues,
      textRef,
      click,
      clickValue,
      input,
      focusOut,
      selRef,
      text,
      expanded
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

.sel
  position: relative
  display: flex
  height: 40px
  border: 1px solid $grey-lighter
  border-radius: 3px
  box-shadow: inset 0 0.0625em 0.125em $grey-lightest
  background-color: white

  &.is-danger
    border: 1px solid $danger

  &:hover
    cursor: text

  .flex
    display: flex
    align-items: center
    justify-content: space-between
    width: 100%
    height: 40px
    padding: 0 8px

    .la
      position: absolute
      user-select: none
      color: $grey-light

    input[type=text]
      width: 100%
      min-width: 3px
      border: none
      font-size: 16px

      &:focus, &:focus-visible
        outline: none

    .icon
      user-select: none

  .dropup
    top: auto !important
    bottom: 40px

  .values
    position: absolute
    display: flex
    text-decoration: none
    flex-direction: column
    top: 40px
    width: 100%
    max-height: 200px
    overflow-y: auto
    z-index: 1
    background-color: $white
    border: 1px solid $grey-light
    border-radius: 4px

    .value
      color: $black
      font-size: 18px
      padding: 2px 10px
      user-select: none

      &:hover
        background-color: $grey-lightest
</style>
