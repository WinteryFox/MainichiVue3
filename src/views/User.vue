<template>
  <ModalComponent active @update:model-value="close">
    <div class="box">
      <div class="is-flex is-align-items-center">
        <AvatarComponent :avatar="user.avatar" size="96"/>

        <div class="is-flex is-flex-direction-column ml-3 user">
          <span class="is-size-3 username">{{ user.username }}</span>

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
        <span style="white-space: pre-line" v-if="user.summary != null">{{ user.summary }}</span>
        <span v-else>{{ user.username }} hasn't written a self-introduction yet.</span>
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
    await store.dispatch(UserMutations.FETCH_USER_BATCH, [route.params.id])

    const user: PartialUser = store.state.users[route.params.id.toString()]
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

<style lang="sass">
.user
  min-width: 0

  .username
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis

.image
  flex-shrink: 0
</style>
