<template>
  <div class="grid">
    <div class="column"></div>
    <div class="column">
      <h1>Profile</h1>
      <h3>Upload or change your profile picture</h3>
      <div class="photo">
        <button class="btnphoto" type="button" style="font-size: 20px">+</button>
      </div>
      <h3>Your introduction:</h3>
      <div class="introtext">
        <textarea id="introduce" name="introduce" rows="20" cols="41"></textarea>
      </div>
    </div>
    <div class="column">
      <div class="datatext">
        <label for="fullname">Full name</label>
        <input type="text" id="fullname" name="fullname" required>
        <label for="age">Age</label>
        <input type="text" id="age" name="age" required>
        <label for="gender">Gender</label>
        <input type="text" id="gender" name="gender" required>
        <label for="proficient">Native language(s)</label>
        <div class="field is-grouped is-grouped-multiline" id="proficient">
          <div class="control" v-for="tag in proficient" :key="tag">
            <div class="tags are-large has-addons">
              <span class="tag is-info">{{ tag }}</span>
              <a class="tag is-delete is-danger"/>
            </div>
          </div>
          <div class="control">
            <div class="tags">
              <span class="tag is-large is-light is-success">
                +
              </span>
            </div>
          </div>
        </div>
        <label for="learning">Learning language(s)</label>
        <div class="field is-grouped is-grouped-multiline" id="learning">
          <div class="control" v-for="tag in learning" :key="tag">
            <div class="tags are-large has-addons">
              <span class="tag is-info">{{ tag }}</span>
              <a class="tag is-delete is-danger"/>
            </div>
          </div>
          <div class="control">
            <div class="tags">
              <span class="tag is-large is-light is-success">
                +
              </span>
            </div>
          </div>
        </div>
        <label for="email">E-mail</label>
        <input type="text" id="email" name="email" required>
        <label for="addpass">Add a password</label>
        <input type="password" id="addpass" name="addpass" required>
      </div>
      <div class="regbutton">
        <a href="feed.html">
          <button class="btnregister" type="button" style="font-size: 16px">Save</button>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {api} from "@/service/api";
import {useStore} from "vuex";
import {UserState} from "@/store";
import {useRouter} from "vue-router";
import {UserMutations} from "@/store/actions";
import Language from "@/interface/Language"

export default defineComponent({
  name: "Profile",
  async setup() {
    const router = useRouter()
    const proficient = ref<Array<string>>()
    const learning = ref<Array<string>>()
    const store = useStore<UserState>()
    await store.dispatch(UserMutations.FETCH_SELF)

    try {
      const languages: Array<Language> = (await api.get(`languages`)).data

      const response = await api.get(`/users/${store.state.self!.snowflake}/languages`)
      const p = response.data.proficient.map((value: Record<string, any>) => value.language)
      const l = response.data.learning.map((value: Record<string, any>) => value.language)
      proficient.value = p.map((value: string) => languages.find(v => v.code == value)?.language)
      learning.value = l.map((value: string) => languages.find(v => v.code == value)?.language)

    } catch (e) {
      console.error(e)
      alert("Something went wrong!")
      await router.push("/")
    }
    return {proficient, learning}
  }
})
</script>

<style scoped lang="sass">

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
  padding: auto
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

input[type=text], input[type=password], select
  width: 100%
  padding: 10px 1px
  margin: 10px 0
  border-radius: 4em
  border: 1px solid #ccc

</style>