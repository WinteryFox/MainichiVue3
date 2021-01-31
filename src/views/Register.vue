<template>
  <ModalComponent active>
    <div class="box" v-if="!challenge">
      <div class="title mb-5 has-text-centered">Create account</div>

      <div class="field">
        <label class="label" for="email">Email</label>
        <div class="control">
          <input class="input" id="email" type="email" v-model="form.email">
        </div>
      </div>

      <div class="field">
        <label class="label" for="username">Username</label>
        <div class="control">
          <input class="input" id="username" type="text" v-model="form.username">
        </div>
      </div>

      <div class="field">
        <label class="label" for="password">Password</label>
        <div class="control">
          <input class="input" id="password" type="password"/>
        </div>
      </div>

      <div class="field">
        <label class="label">Gender</label>
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
            Other
          </label>
        </div>
      </div>

      <fieldset class="field is-flex is-justify-content-space-between">
        <legend class="label">Birthday</legend>

        <SelectComponent :values="years"
                         label="Year"
                         v-model="birthday.year"/>

        <span style="width: 20px"/>

        <SelectComponent :values="months"
                         label="Month"
                         v-model="birthday.month"/>

        <span style="width: 20px"/>

        <SelectComponent :values="days"
                         label="Day"
                         v-model="birthday.day"/>
      </fieldset>

      <div class="field control">
        <button class="button is-fullwidth is-primary"
            @click.once="register">
          Register
        </button>
      </div>
    </div>

    <div class="box" v-else>
      <RecaptchaComponent @update="register"/>
    </div>
  </ModalComponent>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";
import {api} from "@/service/api";
import RecaptchaComponent from "@/components/RecaptchaComponent.vue";
import ModalComponent from "@/components/ModalComponent.vue";
import Error from "@/interface/Error";
import SelectComponent from "@/components/SelectComponent.vue";

export default defineComponent({
  name: "Register",

  components: {
    SelectComponent,
    ModalComponent,
    RecaptchaComponent
  },

  async setup() {
    const form = reactive({
      captcha: null,
      email: "",
      username: "",
      gender: "",
      summary: ""
    })
    const birthday = reactive({
      year: "",
      month: "",
      day: ""
    })
    const challenge = ref<boolean>(false)

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

    async function register() {
      try {
        await api.post(
            "/register",
            form
        )
      } catch (e) {
        const error: Error = e.response.data

        if (error.status == 400) {
          challenge.value = true
        } else {
          console.error(e)
          alert("Something went wrong, try again later!")
        }
      }
    }

    return {
      register,
      form,
      challenge,
      birthday,
      years: [...Array(110).keys()].map(value => (value + 1900).toString()).reverse(),
      months: getMonthList(navigator.languages[0], "long"),
      days: [...Array(31).keys()].map(value => (value + 1).toString())
    }
  }
})
</script>

<style scoped lang="sass">
</style>
