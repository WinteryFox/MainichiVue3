<template>
  <nav class="navbar has-shadow"
       role="navigation"
       aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item py-0" to="/">
        <img class="mr-3"
             src="/logo.svg"
             alt="branding"/>
        <p class="navbar-item heading is-size-4 mb-0">{{ $t("nav.branding") }}</p>
      </router-link>

      <a @click.prevent="hamburger"
         :class="{ 'is-active': isEnabled }"
         ref="hamburgerRef"
         role="button"
         class="navbar-burger"
         aria-label="menu"
         aria-expanded="false"
         style="user-select: none"
         v-if="self !== null">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu"
         :class="{ 'is-active': isEnabled }"
         ref="navMenuRef">
      <div class="navbar-end">
        <div class="navbar-item has-dropdown"
             v-if="self !== null">
          <router-link
              to="/profile"
              class="navbar-item is-flex">
            <AvatarComponent :avatar="self.avatar" size="24" class="mr-2"/>
            {{ self.username }}
          </router-link>
          <a class="navbar-item is-flex" @click="logout">
            <span class="icon mr-2 has-text-danger"><i class="material-icons">logout</i></span>
            {{ $t("nav.logout") }}
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {useStore} from "vuex";
import {UserMutations} from "@/store/actions";
import User from "@/interface/User";
import {UserState} from "@/store";
import AvatarComponent from "@/components/AvatarComponent.vue";

export default defineComponent({
  name: "HeaderComponent",

  components: {
    AvatarComponent
  },

  setup() {
    const store = useStore<UserState>()
    const self = computed<User | null>(() => store.state.self)

    const hamburgerRef = ref<HTMLAnchorElement | null>(null)
    const navMenuRef = ref<HTMLDivElement | null>(null)
    const isEnabled = ref<boolean>(false)

    const hideListener = (event: MouseEvent) => {
      const navMenu = navMenuRef.value
      const hamburger = hamburgerRef.value
      const target = event.target

      if (navMenu && hamburger) {
        if (!navMenu.contains(target as Node) && !hamburger.contains(target as Node)) {
          isEnabled.value = false
          document.removeEventListener("click", hideListener)
        }
      }
    }

    const hamburger = () => {
      isEnabled.value = !isEnabled.value
      if (isEnabled.value)
        document.addEventListener("click", hideListener)
    }

    function logout() {
      window.localStorage.removeItem("token")
      store.commit(UserMutations.FETCH_SELF, null)
    }

    return {
      hamburgerRef,
      navMenuRef,
      isEnabled,
      hamburger,
      hideListener,
      self,
      logout
    }
  }
})
</script>

<style lang="sass" scoped>
@import '~@/assets/main.sass'

.heading
  color: $primary
  font-weight: 800

.avatar
  margin-left: -0.25rem
  width: 28px !important
  height: 28px !important

  @include touch
    width: 24px !important
    height: 24px !important
</style>
