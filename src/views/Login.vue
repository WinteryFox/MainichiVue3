<template>
  <ModalComponent active @update:model-value="$router.push('/')">
    <div class="box">
      <div class="title mb-5 has-text-centered">
        {{ $t("register.login") }}
      </div>

      <div class="control field">
        <label class="label" for="email">{{ $t("register.forms.email") }}</label>
        <input class="input"
               type="email"
               id="email"
               ref="emailRef"
               v-model="form.email">
      </div>

      <div class="control field">
        <label class="label" for="password">{{ $t("register.forms.password") }}</label>
        <input class="input"
               type="password"
               id="password"
               ref="passwordRef"
               v-model="form.password">
      </div>

      <button class="button is-fullwidth is-primary"
              ref="loginRef"
              :class="{ 'is-loading': isLoading }"
              :disabled="isLoading"
              @click="login">
        {{ $t("register.login") }}
      </button>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watch} from "vue";
import ModalComponent from "@/components/ModalComponent.vue";
import {api} from "@/service/api";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {UserState} from "@/store";
import {UserMutations} from "@/store/actions";

export default defineComponent({
  name: "Login",

  components: {
    ModalComponent
  },

  setup() {
    const router = useRouter()
    const store = useStore<UserState>()
    watch(() => store.state.self, () => router.push("/"))

    const form = reactive({
      email: "",
      password: ""
    })

    const emailRef = ref<HTMLInputElement | null>(null)
    const passwordRef = ref<HTMLInputElement | null>(null)
    const isLoading = ref<boolean>(false)

    async function login() {
      isLoading.value = true
      try {
        const response = await api.post("/login", form)

        window.localStorage.setItem("token", response.data.token)
        await store.dispatch(UserMutations.FETCH_SELF)
      } catch (error) {
        if (error.response.status === 401) {
          isLoading.value = false
          emailRef.value?.classList.add("is-danger")
          passwordRef.value?.classList.add("is-danger")
          alert("Username or password is incorrect")
        } else {
          isLoading.value = false
          alert("Something went wrong, try again later!")
        }
      }
    }

    return {
      login,
      form,
      emailRef,
      passwordRef,
      isLoading
    }
  }
})
</script>
