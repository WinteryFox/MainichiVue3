<template>
  <section>
    <AvatarComponent :avatar="avatar"
                     size="80"
                     style="margin-left: 0"/>
    <label for="upload">
        <span role="button"
              tabindex="0"
              aria-label="upload user profile">
          <i class="material-icons">
            upload
          </i>
        </span>
    </label>
    <input type="file"
           id="upload"
           accept="image/png"
           @change="updateAvatar"/>
  </section>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {api} from "@/service/api";
import Error from "@/interface/Error";
import AvatarComponent from "@/components/AvatarComponent.vue";

export default defineComponent({
  name: "AvatarUploadComponent",

  components: {
    AvatarComponent
  },

  props: {
    avatar: String
  },

  setup(props) {
    async function updateAvatar(event: Event) {
      if (!event.target ||
          !(event.target instanceof HTMLInputElement) ||
          !event.target.files ||
          event.target.files.length != 1) {
        alert("Oh no, something went wrong! Try again later!")
        return
      }

      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          await api.patch("/users/@me", {avatar: reader.result})
          alert("Successfully updated avatar!")
        } catch (e) {
          const error: Error = e.response.data
          if (error.status == 400) {
            if (error.code == 4005) {
              alert("Avatar must be 256x256 pixels, and be less than 256kB in size.")
            }
          } else if (error.status == 500) {
            alert("Something went wrong while processing your avatar, try again later!")
          }
        }
      }

      reader.readAsDataURL(event.target.files[0])
    }

    return {
      updateAvatar,
      props
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

section
  position: relative
  height: 80px
  width: 80px

figure
  margin: 0 !important

input#upload
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  opacity: 0
  cursor: pointer
  border-radius: 50%

label span
  position: absolute
  top: 0
  right: 0
  left: auto
  height: 28px
  width: 28px
  background-color: $grey-lightest
  display: flex
  justify-content: center
  align-items: center
  border-radius: 50%
</style>