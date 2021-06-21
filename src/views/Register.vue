<template>
  <ModalComponent @update:model-value="close" active>
    <div class="box">
      <StepsComponent step-count="4"
                      v-model="step">
        <div v-if="step === 1">
          <div class="title mb-5 has-text-centered">
            {{ $t("register.step-1.title") }}
          </div>

          <div class="field">
            <label class="label" for="email">{{ $t("register.forms.email") }}*</label>
            <div class="control">
              <input class="input"
                     id="email"
                     type="email"
                     v-model="form.email"
                     required
                     pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"/>
            </div>
          </div>

          <div class="field">
            <label class="label" for="password">{{ $t("register.forms.password") }}*</label>
            <div class="control">
              <input class="input"
                     id="password"
                     type="password"
                     v-model="form.password"/>
            </div>
          </div>

          <div class="field">
            <label class="label" for="repeat">{{ $t("register.forms.password-repeat") }}*</label>
            <input class="input"
                   id="repeat"
                   type="password"
                   v-model="passwordRepeat"/>
          </div>

          <button class="button is-fullwidth is-primary"
                  @click="validate1">
            {{ $t("register.next") }}
          </button>
        </div>

        <div v-else-if="step === 2">
          <div class="title mb-5 has-text-centered">
            {{ $t("register.step-2.title") }}
          </div>

          <div class="field">
            <label class="label" for="username">{{ $t("register.forms.username") }}*</label>
            <div class="control">
              <input class="input" id="username" type="text" v-model="form.username">
            </div>
          </div>

          <div class="field">
            <label class="label">{{ $t("register.forms.gender") }}*</label>
            <div class="control">
              <label class="radio">
                <input class="radio" type="radio" value="F" v-model="form.gender">
                {{ $t("register.forms.female") }}
              </label>

              <label class="radio">
                <input class="radio" type="radio" value="M" v-model="form.gender">
                {{ $t("register.forms.male") }}
              </label>

              <label class="radio">
                <input class="radio" type="radio" :value="null" v-model="form.gender">
                {{ $t("register.forms.other") }}
              </label>
            </div>
          </div>

          <fieldset class="field is-flex is-justify-content-space-between">
            <legend class="label">{{ $t("register.forms.birthday") }}*</legend>

            <SelectComponent :values="years"
                             :label="$t('register.forms.year')"
                             id="year"
                             v-model="birthday.year"
                             dropup/>

            <span aria-hidden="true" style="width: 20px"/>

            <SelectComponent :values="months"
                             :label="$t('register.forms.month')"
                             id="month"
                             v-model="birthday.month"
                             dropup/>

            <span aria-hidden="true" style="width: 20px"/>

            <SelectComponent :values="days"
                             :label="$t('register.forms.day')"
                             id="day"
                             v-model="birthday.day"
                             dropup/>
          </fieldset>

          <div class="buttons is-flex is-justify-content-space-between">
            <button class="button is-danger"
                    @click="step = 1">
              {{ $t("register.previous") }}
            </button>

            <button class="button is-primary"
                    @click="validate2">
              {{ $t("register.next") }}
            </button>
          </div>
        </div>

        <div v-else-if="step === 3">
          <div class="title mb-5 has-text-centered">
            {{ $t("register.step-3.title") }}
          </div>

          <label for="summary" class="label">
            {{ $t("register.step-3.description") }}
          </label>
          <textarea id="summary" class="input textarea" v-model="form.summary"/>

          <div class="buttons mt-4 is-flex is-justify-content-space-between">
            <button class="button is-danger"
                    @click="step = 2">
              {{ $t("register.previous") }}
            </button>

            <button class="button is-primary"
                    @click="validate3">
              {{ $t("register.next") }}
            </button>
          </div>
        </div>

        <div v-else-if="step === 4">
          <div class="title mb-5 has-text-centered">
            {{ $t("register.step-4.title") }}
          </div>

          <RecaptchaComponent class="is-flex is-justify-content-center"
                              @update="register"
                              v-if="!isLoading"/>
          <LoaderComponent :title="$t('register.creating')"
                           :subtitle="$t('waiting')"
                           v-else/>
        </div>
      </StepsComponent>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import {defineComponent, reactive, ref, nextTick, watch} from "vue";
import {api} from "@/service/api";
import RecaptchaComponent from "@/components/RecaptchaComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import Error from "@/interface/Error";
import SelectComponent from "@/components/SelectComponent.vue";
import StepsComponent from "@/components/StepsComponent.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";
import moment from "moment";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {UserState} from "@/store";
import {UserMutations} from "@/store/actions";

export default defineComponent({
  name: "Register",

  components: {
    RecaptchaComponent,
    StepsComponent,
    SelectComponent,
    ModalComponent,
    LoaderComponent
  },

  async setup() {
    const router = useRouter()
    const store = useStore<UserState>()

    watch(() => store.state.self, () => router.push("/"))

    const step = ref<number>(1)
    const form = reactive({
      captcha: null,
      email: "",
      username: "",
      gender: null,
      summary: "",
      password: ""
    })
    const birthday = reactive({
      year: 0,
      month: "",
      day: 0
    })
    const passwordRepeat = ref<string>("")
    const isLoading = ref<boolean>(false)

    function getMonthList(
        locales?: string | string[],
        format: "long" | "short" = "long"
    ): string[] {
      const year = new Date().getFullYear();
      const monthList = [...Array(12).keys()];
      const formatter = new Intl.DateTimeFormat(locales, {
        month: format
      });

      const getMonthName = (monthIndex: number) =>
          formatter.format(new Date(year, monthIndex));

      return monthList.map(getMonthName);
    }

    async function register(token: string) {
      isLoading.value = true
      try {
        const response = await api.post(
            "/register",
            {
              captcha: token,
              gender: form.gender,
              email: form.email,
              password: form.password,
              summary: form.summary,
              username: form.username,
              birthday: new Date(
                  Date.UTC(
                      birthday.year,
                      moment().month(birthday.month).month(),
                      birthday.day
                  )
              ).toISOString()
            }
        )

        window.localStorage.setItem("token", response.data.token)
        await store.dispatch(UserMutations.FETCH_SELF)
      } catch (e) {
        const error: Error = e.response.data
        isLoading.value = false

        if (error.status == 400) {
          if (error.code == 4007) {
            step.value = 1
            await nextTick()
            const email = document.getElementById("email") as HTMLInputElement
            email.classList.add("is-danger")
            alert("User with that email already exists.")

            return
          }
        } else if (error.status == 402) {
          alert("You cannot register for an account when you're logged in.")
        } else {
          step.value = 1
          alert("Something went wrong, try again later!")
        }
      }

      await router.push("/")
    }

    function validate1() {
      const email = document.getElementById("email") as HTMLInputElement
      const password = document.getElementById("password") as HTMLInputElement
      const repeat = document.getElementById("repeat") as HTMLInputElement
      let error = false

      if (!email.checkValidity()) {
        email.reportValidity()
        email.classList.add("is-danger")
        error = true
      } else {
        email.classList.remove("is-danger")
      }

      if (!form.password.length || form.password != passwordRepeat.value) {
        password.classList.add("is-danger")
        repeat.classList.add("is-danger")
        error = true
      } else {
        password.classList.remove("is-danger")
        repeat.classList.remove("is-danger")
      }

      if (!error)
        step.value = 2
    }

    function validate2() {
      const username = document.getElementById("username") as HTMLInputElement
      const year = document.getElementById("year") as HTMLDivElement
      const month = document.getElementById("month") as HTMLDivElement
      const day = document.getElementById("day") as HTMLDivElement
      let error = false

      if (!form.username.length || form.username.length > 32) {
        username.classList.add("is-danger")
        error = true
      } else {
        username.classList.remove("is-danger")
      }

      if (!birthday.year) {
        year.classList.add("is-danger")
        error = true
      } else {
        year.classList.remove("is-danger")
      }

      if (!birthday.month) {
        month.classList.add("is-danger")
        error = true
      } else {
        month.classList.remove("is-danger")
      }

      if (!birthday.day) {
        day.classList.add("is-danger")
        error = true
      } else {
        day.classList.remove("is-danger")
      }

      if (!error)
        step.value = 3
    }

    function validate3() {
      const summary = document.getElementById("summary") as HTMLInputElement

      if (!form.summary.length || form.summary.length > 2048) {
        summary.classList.add("is-danger")
      } else {
        summary.classList.remove("is-danger")
        step.value = 4
      }
    }

    function close() {
      router.push("/")
    }

    return {
      register,
      form,
      birthday,
      passwordRepeat,
      step,
      isLoading,
      close,
      validate1,
      validate2,
      validate3,
      years: [...Array(110).keys()].map(value => (value + 1900).toString()).reverse(),
      months: getMonthList(navigator.languages[0], "long"),
      days: [...Array(31).keys()].map(value => (value + 1).toString())
    }
  }
})
</script>
