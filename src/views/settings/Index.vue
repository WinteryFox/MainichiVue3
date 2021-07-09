<template>
  <div class="is-flex is-flex-grow-1">
    <nav class="panel is-flex-grow-1 m-0">
      <p class="panel-heading">
        Settings
      </p>
      <router-link to="/settings/account" class="panel-block">
        Account
      </router-link>
      <router-link to="/settings/profile" class="panel-block">
        Profile
      </router-link>
    </nav>

    <div class="px-6 pt-4 is-flex-grow-1">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "Settings",
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

.panel
  width: 100%
  max-width: 256px
  border-radius: 0
  box-shadow: none
  border-right: 1px solid $grey-lighter

  .panel-block
    border-bottom: 1px solid $grey-lighter
    border-radius: 0
</style>