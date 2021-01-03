<template>
  <nav class="navbar has-shadow"
       role="navigation"
       aria-label="main navigation">
    <div class="navbar-brand">
      <router-link class="navbar-item py-0" to="/">
        <img class="mr-3"
             src="/logo.png"
             alt="branding"
             width="112"
             height="28"/>
        <p class="heading is-size-4 mb-0">PenWeb</p>
      </router-link>

      <a @click.prevent="hamburger"
         :class="{ 'is-active': isEnabled }"
         ref="hamburgerRef"
         role="button"
         class="navbar-burger"
         aria-label="menu"
         aria-expanded="false"
         style="user-select: none">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu"
         :class="{ 'is-active': isEnabled }"
         ref="navMenuRef">
      <div class="navbar-end">
        <a
            :href="loginUri"
            class="navbar-item is-flex"
            v-if="self === null">
          <span class="icon mr-2"><i class="material-icons">login</i></span>
          Login
        </a>
        <router-link
            to="/profile"
            class="navbar-item is-flex"
            v-else>
          <span class="icon mr-2"><img :src="avatar" alt="avatar"/></span>
          {{ self.username }}
        </router-link>
        <div class="dropdown-divider"/>
        <a class="navbar-item is-flex is-disabled">
          <span class="icon mr-2">
            <i class="material-icons">
              dark_mode
            </i>
          </span>
          Dark mode
        </a>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {UserMutations} from "@/store/actions";
import {apiUri} from "@/service/api";
import User from "@/interface/User";
import {UserState} from "@/store";

export default defineComponent({
  setup() {
    const store = useStore<UserState>()
    const loginUri = `${apiUri}/oauth2/authorization/google`
    const self = computed<User | null>(() => store.state.self)
    const avatar = computed<string>(() =>
        self.value != null ?
            `${apiUri}/avatars/${self.value.avatar}.png` :
            "https://upload.wikimedia.org/wikipedia/commons/2/24/Missing_avatar.svg")
    onMounted(async () => await store.dispatch(UserMutations.FETCH_SELF))

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
      if (isEnabled.value) {
        document.addEventListener("click", hideListener)
      }
    }

    return {
      hamburgerRef,
      navMenuRef,
      isEnabled,
      hamburger,
      hideListener,
      self,
      avatar,
      loginUri
    }
  }
})
</script>
