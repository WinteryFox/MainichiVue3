<template>
  <ModalComponent v-if="state.user !== undefined" @close="close">
    <div class="box mx-2">
      <div class="is-flex is-align-items-center">
        <figure class="image is-96x96 mr-3">
          <img
              class="is-rounded"
              :src="state.avatar"
              alt="avatar"/>
        </figure>

        <div class="is-flex is-flex-direction-column">
          <p class="is-size-3">{{ state.user.username }}</p> <!-- TODO: Prevent overflow -->

          <div class="is-flex">
            <span class="icon">
              <img src="/female.svg" alt="female" v-if="state.user.gender === 'F'"/>
              <img src="/male.svg" alt="male" v-else-if="state.user.gender === 'M'"/>
              <img src="/other.svg" alt="other" v-else/>
            </span>
            <p>{{ state.age }}</p>
          </div>
        </div>
      </div>

      <div>
        <span class="dropdown-divider"/>
        <p>{{ state.user.summary }}</p>
      </div>
    </div>
  </ModalComponent>
</template>

<script>
import {computed, defineComponent, reactive} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import ModalComponent from "@/components/ModalComponent.vue"
import {UserMutations} from "@/store/actions";
import {apiUri} from "@/service/api";

export default defineComponent({
  components: {
    ModalComponent
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const state = reactive({
      user: computed(() => store.state.users[route.params.snowflake]),
      avatar: computed(() => `${apiUri}/avatars/${state.user.avatar}.png`),
      age: computed(() => {
        const today = new Date();
        const birthDate = new Date(state.user.birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      })
    })

    store.dispatch(UserMutations.FETCH_USER_BATCH, [route.params.snowflake])

    function close() {
      router.push("/")
    }

    return {
      state,
      close
    }
  }
})
</script>

<style lang="scss">
.is-96x96 {
  min-width: 96px;
  min-height: 96px;
}
</style>
