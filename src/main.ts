import {createApp} from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import moment from "moment";
require("@/assets/main.sass")
require("@/events")

const app = createApp(App)
app.use(store)
app.use(router)
app.mount('#app')

moment.locale(navigator.languages[0])
