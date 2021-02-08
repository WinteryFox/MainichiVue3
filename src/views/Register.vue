<template>
  <ModalComponent active>
    <div class="box">
      <StepsComponent step-count="4"
                      v-model="step">
        <div v-if="step === 1">
          <div class="title mb-5 has-text-centered">
            Essential information
          </div>

          <div class="field">
            <label class="label" for="email">Email*</label>
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
            <label class="label" for="password">Password*</label>
            <div class="control">
              <input class="input"
                     id="password"
                     type="password"
                     v-model="form.password"/>
            </div>
          </div>

          <div class="field">
            <label class="label" for="repeat">Repeat password*</label>
            <input class="input"
                   id="repeat"
                   type="password"
                   v-model="passwordRepeat"/>
          </div>

          <button class="button is-fullwidth is-primary"
                  @click="validate1">
            Next
          </button>
        </div>

        <div v-else-if="step === 2">
          <div class="title mb-5 has-text-centered">
            Who are you?
          </div>

          <div class="field">
            <label class="label" for="username">Display name*</label>
            <div class="control">
              <input class="input" id="username" type="text" v-model="form.username">
            </div>
          </div>

          <div class="field">
            <label class="label">Gender*</label>
            <div class="control">
              <label class="radio">
                <input class="radio" type="radio" value="F" v-model="form.gender">
                Female
              </label>

              <label class="radio">
                <input class="radio" type="radio" value="M" v-model="form.gender">
                Male
              </label>

              <label class="radio">
                <input class="radio" type="radio" :value="null" v-model="form.gender">
                Other / Prefer not to say
              </label>
            </div>
          </div>

          <fieldset class="field is-flex is-justify-content-space-between">
            <legend class="label">Birthday*</legend>

            <SelectComponent :values="years"
                             label="Year"
                             id="year"
                             v-model="birthday.year"/>

            <span aria-hidden="true" style="width: 20px"/>

            <SelectComponent :values="months"
                             label="Month"
                             id="month"
                             v-model="birthday.month"/>

            <span aria-hidden="true" style="width: 20px"/>

            <SelectComponent :values="days"
                             label="Day"
                             id="day"
                             v-model="birthday.day"/>
          </fieldset>

          <div class="buttons is-flex is-justify-content-space-between">
            <button class="button is-danger"
                    @click="step = 1">
              Previous
            </button>

            <button class="button is-primary"
                    @click="validate2">
              Next
            </button>
          </div>
        </div>

        <div v-else-if="step === 3">
          <div class="title mb-5 has-text-centered">
            Self-introduction
          </div>

          <label for="summary" class="label">
            Write a short self-introduction that other people will see
            when they visit your profile.
          </label>
          <textarea id="summary" class="input textarea" v-model="form.summary"/>

          <div class="buttons mt-4 is-flex is-justify-content-space-between">
            <button class="button is-danger"
                    @click="step = 2">
              Previous
            </button>

            <button class="button is-primary"
                    @click="validate3">
              Next
            </button>
          </div>
        </div>

        <div v-else-if="step === 4">
          <div class="title mb-5 has-text-centered">
            Beep boop?
          </div>

          <RecaptchaComponent class="is-flex is-justify-content-center" @update="register"/>
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
import moment from "moment";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {UserState} from "@/store";

export default defineComponent({
  name: "Register",

  components: {
    RecaptchaComponent,
    StepsComponent,
    SelectComponent,
    ModalComponent
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
      try {
        await api.post(
            "/register",
            {
              captcha: token,
              gender: form.gender,
              email: form.email,
              password: form.password,
              summary: form.summary,
              username: form.username,
              birthday: new Date(birthday.year, moment().month(birthday.month).month(), birthday.day).toISOString()
            }
        )
      } catch (e) {
        const error: Error = e.response.data

        if (error.status == 400) {
          if (error.code == 4007) {
            step.value = 1
            await nextTick()
            const email = document.getElementById("email") as HTMLInputElement
            email.classList.add("is-danger")
            alert("User with that email already exists.")

            return
          }
        } else {
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

    return {
      register,
      form,
      birthday,
      passwordRepeat,
      step,
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

<style scoped lang="sass">
</style>
