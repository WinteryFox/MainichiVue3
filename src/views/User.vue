<template>
  <ModalComponent active @close="close">
    <div class="box mx-2">
      <div class="is-flex is-align-items-center">
        <AvatarComponent :avatar="user.avatar" size="96"/>

        <div class="is-flex is-flex-direction-column ml-3">
          <p class="is-size-3">{{ user.username }}</p> <!-- TODO: Prevent overflow -->

          <div class="is-flex">
            <span class="icon">
              <img src="/female.svg" alt="female" v-if="user.gender === 'F'"/>
              <img src="/male.svg" alt="male" v-else-if="user.gender === 'M'"/>
              <img src="/other.svg" alt="other" v-else/>
            </span>
            <p v-if="age != null">{{ age }}</p>
          </div>
        </div>
      </div>

      <div>
        <span class="dropdown-divider"/>
        <p style="white-space: pre-line" v-if="user.summary != null">{{ user.summary }}</p>
        <p v-else>{{ user.username }} hasn't written a self-introduction yet.</p>
      </div>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {UserMutations} from "@/store/actions";
import {apiUri} from "@/service/api";
import PartialUser from "@/interface/PartialUser";
import ModalComponent from "@/components/ModalComponent.vue";
import AvatarComponent from "@/components/AvatarComponent.vue";

export default defineComponent({
  components: {
    AvatarComponent,
    ModalComponent
  },

  async setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    await store.dispatch(UserMutations.FETCH_USER_BATCH, [route.params.snowflake])

    const user: PartialUser = store.state.users[route.params.snowflake as string]
    const avatar = `${apiUri}/avatars/${user.avatar}.png`
    const age = computed<number | null>(() => {
      if (user.birthday != null) {
        const today = new Date();
        const birthDate = new Date(user.birthday);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        return age;
      } else {
        return null
      }
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
