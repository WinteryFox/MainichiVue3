<template>
  <figure v-if="avatar != null"
          class="image"
          style="margin-left: -4px"
          :style="{ 'width': `${size}px`, 'height': `${size}px` }">
    <img class="is-rounded avatar"
         :src="`${apiUri}/avatars/${avatar}.png`"
         alt="avatar"/>
  </figure>
  <span v-else
        class="icon"
        :style="{ 'width': `${size}px`, 'height': `${size}px` }">
    <i class="material-icons"
    :style="{ 'font-size': `${size}px` }">
      account_circle
    </i>
  </span>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {apiUri} from "@/service/api";

export default defineComponent({
  name: "AvatarComponent",

  props: {
    avatar: String,
    size: String || Number,
  },

  setup(props) {
    return {
      props,
      apiUri
    }
  }
})
</script>
