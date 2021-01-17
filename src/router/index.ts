import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/Home.vue"
import User from "@/views/User.vue"
import Post from "@/views/Post.vue"
import Profile from "@/views/Profile.vue"

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      children: [
        {
          path: "/users/:id",
          component: User
        },
        {
          path: "/posts/:id",
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
