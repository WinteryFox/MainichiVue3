<template>
  <div v-if="self !== null">
    <AvatarUploadComponent :avatar="self.avatar"/>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import User from "@/interface/User";
import {useStore} from "vuex";
import {UserState} from "@/store";
import AvatarUploadComponent from "@/components/AvatarUploadComponent.vue";

export default defineComponent({
  name: "Account",

  components: {
    AvatarUploadComponent
  },

  setup() {
    const store = useStore<UserState>()
    const self = computed<User | null>(() => store.state.self)

    return {
      self
    }
  }
})
</script>

<style scoped lang="sass">

</style>