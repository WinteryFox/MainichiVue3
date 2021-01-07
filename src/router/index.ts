import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"
import User from "@/views/User.vue"
import Post from "@/views/Post.vue"
import Profile from "@/views/Profile.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      children: [
        {
          path: "/users/:snowflake",
          component: User
        },
        {
          path: "/posts/:snowflake",
          component: Post
        }
      ]
    },
    {
      path: "/profile",
      component: Profile
    }
  ]
})


export default router
