<template>
  <div class="grid">
    <div class="column"></div>
    <div class="column">
      <router-link class="btndiscard" to="/">
        <span class="icon"><i class="material-icons">arrow_back_ios_new</i></span>
      </router-link>
      <h1>Profile</h1>
      <h3>Upload or change your profile picture</h3>
      <div class="photo">
        <section>
          <div
              id="user-avatar"
              aria-label="user avatar">
            <AvatarComponent :avatar="avatar"
                             size="194"
                             style="margin-left: 0"/>
          </div>
          <input type="file" name="upload" id="upload" accept="image/png" @change="updateAvatar"/>
          <label for="upload">
            <span role="button" tabindex="0" aria-label="upload user profile">
              <i class="material-icons">
                upload
              </i>
            </span>
          </label>
        </section>
      </div>
      <h3>Your introduction:</h3>
      <div class="introtext">
        <textarea id="introduce" name="introduce" rows="13" cols="41" v-model="form.summary"/>
      </div>
    </div>
    <div class="column">
      <div class="datatext">
        <label for="email">E-mail</label>
        <input type="text" id="email" name="email" :value="email" disabled>
        <label for="fullname">Full name</label>
        <input type="text" id="fullname" name="fullname" v-model="form.username" required>
        <label for="age">Birthday</label>
        <input type="date" class="pr-3" id="age" name="age" v-model="form.birthday" required>
        <label for="gender">Gender</label>
        <div class="control" id="gender">
          <label class="radio">
            <input type="radio" value="M" name="gender" v-model="form.gender">
            Male
          </label>
          <label class="radio">
            <input type="radio" value="F" name="gender" v-model="form.gender">
            Female
          </label>
          <label class="radio">
            <input type="radio" :value="null" name="gender" v-model="form.gender">
            Other
          </label>
        </div>
      </div>
      <div class="regbutton">
        <button class="btnregister" type="button" style="font-size: 16px" @click="updateUser">Save</button>
      </div>
      <label for="proficient">Native language(s)</label>
      <div class="field is-grouped is-grouped-multiline" id="proficient">
        <div class="control" v-for="tag in proficient" :key="tag">
          <div class="tags are-medium has-addons">
            <span class="tag is-info is-rounded">{{ tag.language }}</span>
            <a class="tag is-delete is-danger is-rounded" @click="removeProficient(tag)"/>
          </div>
        </div>
        <DropdownComponent>
          <template class="tags" #activator="{ on }">
            <a class="tag is-medium is-light is-success is-rounded" v-on="on">
              +
            </a>
          </template>
          <template #default>
            <a v-for="language in languages"
               :key="language.code"
               class="dropdown-item"
               @click="addProficient(language)">
              {{ language.language }}
            </a>
          </template>
        </DropdownComponent>
      </div>
      <label for="learning">Learning language(s)</label>
      <div class="field is-grouped is-grouped-multiline" id="learning">
        <div class="control" v-for="tag in learning" :key="tag">
          <div class="tags are-medium has-addons">
            <span class="tag is-info is-rounded">{{ tag.language }}</span>
            <a class="tag is-delete is-danger is-rounded" @click="removeLearning(tag)"/>
          </div>
        </div>
        <DropdownComponent>
          <template class="tags" #activator="{ on }">
            <a class="tag is-medium is-light is-success is-rounded" v-on="on">
              +
            </a>
          </template>
          <template #default>
            <a v-for="language in languages"
               :key="language.code"
               class="dropdown-item"
               @click="addLearning(language)">
              {{ language.language }}
            </a>
          </template>
        </DropdownComponent>
      </div>
      <div class="regbutton">
        <button class="btnregister" type="button" style="font-size: 16px" @click="updateLanguages">Save</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {reactive, defineComponent, ref} from "vue";
import {api} from "@/service/api";
import {useStore} from "vuex";
import {UserState} from "@/store";
import {UserMutations} from "@/store/actions";
import Language, {Learning} from "@/interface/Language"
import AvatarComponent from "@/components/AvatarComponent.vue";
import DropdownComponent from "@/components/DropdownComponent.vue";

export default defineComponent({
  name: "Profile",

  components: {
    DropdownComponent,
    AvatarComponent
  },

  async setup() {
    const proficient = ref<Array<Language>>([])
    const learning = ref<Array<Learning>>([])
    const store = useStore<UserState>()
    await store.dispatch(UserMutations.FETCH_SELF)
    const languages: Array<Language> = (await api.get("/languages")).data

    const email = store.state.self?.email
    const form = reactive({
      username: store.state.self?.username,
      birthday: store.state.self?.birthday,
      gender: store.state.self?.gender,
      summary: store.state.self?.summary
    })

    try {
      const response = await api.get(`/users/${store.state.self?.id}/languages`)
      proficient.value = (response.data.proficient as Array<string>)
          .map(value => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const lang = languages.find(v => v.code == value)!!
            const code = lang.code
            const language = lang.language
            return {
              code,
              language
            }
          })
          .sort((v1, v2) => v1.language.localeCompare(v2.language))
      learning.value = response.data.learning
          .map((value: Learning) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const lang = languages.find(v => v.code == value["language"])!!
            const code = lang.code
            const language = lang.language
            const proficiency = value["proficiency"]
            return {
              code,
              language,
              proficiency
            }
          })
          .sort((v1: Learning, v2: Learning) => v1.language.localeCompare(v2.language))
    } catch (e) {
      console.error(e)
      alert("Something went wrong!")
    }

    async function updateAvatar(event: Event) {
      try {
        const target = event.target as HTMLInputElement
        const files = target.files as FileList
        const form = new FormData()
        form.append('avatar', files[0])

        await api.patch("/users/@me", form)
        alert("Successfully updated avatar!")
      } catch (e) {
        alert(e.response.data.message)
      }
    }

    async function updateUser() {
      try {
        await api.post("/users/@me", form)
        alert("Successfully saved user details!")
      } catch (e) {
        alert(e.response.data.message)
      }
    }

    function addProficient(language: Language) {
      proficient.value.push(language)
      proficient.value.sort((v1, v2) => v1.language.localeCompare(v2.language))
    }

    function addLearning(language: Learning) {
      learning.value.push(language)
      learning.value.sort((v1, v2) => v1.language.localeCompare(v2.language))
    }

    function removeProficient(tag: Language) {
      proficient.value = proficient.value.filter(value => value.code != tag.code)
      proficient.value.sort((v1, v2) => v1.language.localeCompare(v2.language))
    }

    function removeLearning(tag: Learning) {
      learning.value = learning.value.filter(value => value.code != tag.code)
      learning.value.sort((v1, v2) => v1.language.localeCompare(v2.language))
    }

    async function updateLanguages() {
      await api.post(
          "/users/@me/languages",
          {
            proficient: proficient.value.map(v => v.code),
            learning: learning.value.map(v => v.code)
          }
      )
      alert("Successfully saved language preferences.")
    }

    return {
      email,
      form,
      proficient,
      learning,
      addProficient,
      addLearning,
      removeProficient,
      removeLearning,
      updateLanguages,
      updateUser,
      updateAvatar,
      avatar: store.state.self?.avatar,
      languages,
    }
  }
})
</script>

<style scoped lang="sass">
@import "~@/assets/main.sass"

a.tag:hover
  text-decoration: none
  user-select: none

.btndiscard
  display: flex
  align-items: center
  justify-content: center
  width: 40px
  height: 40px
  border-radius: 50%
  border: 1px solid #ccc
  float: left
  background-color: #f0f0f0
  color: $black

  &:hover
    background-color: #F5B22E
    border: 1px double #F5B22E
    color: white

section
  position: relative
  height: 200px
  width: 200px

#user-avatar
  height: inherit
  width: inherit
  border: 3px solid $info
  border-radius: 50%
  transition: ease-out 200ms

input#upload
  display: none

label span
  position: absolute
  bottom: 0
  right: 0
  height: 60px
  width: 60px
  background-color: $info
  display: grid
  place-items: center
  border-radius: 50%
  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2) 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)
  transition: ease-out 200ms
  cursor: pointer

  &:hover
    box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)
    background-color: $info-dark

.grid
  background-image: url("~@/assets/background.png")
  background-size: cover
  height: 900px
  width: auto
  display: flex

h1
  text-align: center
  font-family: "Arial", sans-serif
  margin: 1em
  font-size: 32px

h3
  text-align: center
  font-family: "Arial", sans-serif
  margin: 1em
  font-size: 24px

.grid
  display: flex
  width: 100%

.column
  flex: 1
  padding: 50px

.grid .column
  flex-grow: 1

.btnregister
  width: 15em
  height: 2.5em
  border-radius: 20px
  border: 1px solid #ccc
  margin: 1em


.regbutton
  display: flex
  justify-content: center


.btnregister:hover
  background-color: #F5B22E
  border-color: #F5B22E
  color: white


.btnphoto
  width: 8em
  height: 8em
  border-radius: 4em
  border: 1px solid #ccc
  font-size: 20px

.photo
  display: flex
  justify-content: center
  margin-top: 1em
  margin-bottom: 4em


.introtext
  display: flex
  justify-content: center
  margin-top: 1em
  margin-left: 1em

.datatext
  font-family: "Arial", sans-serif
  margin-top: 5em
  padding: 2em


#fullname, #age, #gender,
#natlang, #email, #addpass
  margin-bottom: 2em
  padding-left: 10px

input[type=text], input[type=password], input[type=date], select
  width: 100%
  padding: 10px 1px
  margin: 10px 0
  border-radius: 4em
  border: 1px solid #ccc

</style>