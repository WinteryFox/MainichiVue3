import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import moment from "moment";
require("@/assets/main.sass")

createApp(App).use(store).use(router).mount('#app')

moment.locale(navigator.languages[0])
