<template>
  <div ref="recaptchaRef"/>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {ReCaptchaInstance} from "@/recaptcha";

export default defineComponent({
  name: "RecaptchaComponent",

  async setup(_, {emit}) {
    const recaptchaRef = ref<HTMLDivElement | null>(null)

    const script: HTMLScriptElement = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit"
    script.async = true
    script.defer = true
    script.onload = () => {
      const w: Window & { grecaptcha?: ReCaptchaInstance } = window

      if (w.grecaptcha && recaptchaRef.value) {
        const recaptcha: ReCaptchaInstance = w.grecaptcha
        const ref: HTMLDivElement = recaptchaRef.value

        recaptcha.ready(() => {
          recaptcha.render(ref, {
            sitekey: "6LcTaDkaAAAAAGziQ5UKXFE8yRLd9Plkx576xvv_",
            callback: (token: string) => {
              emit("update", token)
            }
          })
        })
      }
    }

    document.head.appendChild(script)

    return {
      recaptchaRef
    }
  }
})
</script>

<style scoped>

</style>