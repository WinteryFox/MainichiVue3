<template>
  <ModalComponent @close="close">
    <div class="box mx-2">
      <div class="is-flex is-align-items-center">
        <figure class="image is-96x96 mr-3">
          <img
              class="is-rounded"
              :src="avatar"
              alt="avatar"/>
        </figure>

        <div class="is-flex is-flex-direction-column">
          <p class="is-size-3">{{ user.username }}</p> <!-- TODO: Prevent overflow -->

          <div class="is-flex">
            <span class="icon">
              <img src="/female.svg" alt="female" v-if="user.gender === 'F'"/>
              <img src="/male.svg" alt="male" v-else-if="user.gender === 'M'"/>
              <img src="/other.svg" alt="other" v-else/>
            </span>
            <p>{{ age }}</p>
          </div>
        </div>
      </div>

      <div>
        <span class="dropdown-divider"/>
        <p>{{ user.summary }}</p>
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import ModalComponent from "@/components/ModalComponent.vue"
import {UserMutations} from "@/store/actions";
import {apiUri} from "@/service/api";
import PartialUser from "@/interface/PartialUser";

export default defineComponent({
  components: {
    ModalComponent
  },

  async setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    await store.dispatch(UserMutations.FETCH_USER_BATCH, [route.params.snowflake])

    const user: PartialUser = store.state.users[route.params.snowflake as string]
    const avatar = `${apiUri}/avatars/${user.avatar}.png`
    const age = computed(() => {
      const today = new Date();
      const birthDate = new Date(user.birthday);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    })

    function close() {
      router.push("/")
    }

    return {
      user,
      avatar,
      age,
      close
    }
  }
})
</script>
