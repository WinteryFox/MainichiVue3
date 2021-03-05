<template>
  <figure class="image is-flex is-flex-shrink-0"
          :style="{ 'width': `${size}px`, 'height': `${size}px` }">
    <img v-if="avatar != null"
         class="is-rounded avatar"
         :src="`${apiUri}/avatars/${avatar}.png`"
         alt="avatar"/>
    <span v-else
          class="icon"
          :style="{ 'width': `${size}px`, 'height': `${size}px` }">
      <i class="material-icons"
         :style="{ 'font-size': `${size}px` }">
        account_circle
      </i>
    </span>
  </figure>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {apiUri} from "@/service/api";

export default defineComponent({
  name: "AvatarComponent",

  props: {
    avatar: String,
    size: [String, Number],
  },

  setup(props) {
    return {
      props,
      apiUri
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

figure
  margin: 0 -4px !important

  .image, .icon
    margin: 0 !important
    border-radius: 50%
    background-color: $white
    user-select: none
    text-decoration: none
    color: $grey-dark
</style>
