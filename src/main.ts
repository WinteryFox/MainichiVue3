import {createApp} from "vue"
import App from "@/App.vue"
import router from "@/router"
import store from "@/store"
import VueI18n from "@/localization"
import moment from "moment"

require("@/assets/main.sass")
require("@/events")

moment.locale(navigator.languages[0])

const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueI18n)
app.mount('#app')
