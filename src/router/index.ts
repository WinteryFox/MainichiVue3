import { createRouter, createWebHistory } from "vue-router"

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import(/* webpackChunkName: "Home" */ "@/views/Feed.vue"),
    },
    {
      path: "/users/:id",
      component: () => import(/* webpackChunkName: "User" */ "@/views/User.vue")
    },
    {
      path: "/posts/:id",
      component: () => import(/* webpackChunkName: "Post" */ "@/views/Post.vue")
    },
    {
      path: "/profile",
      component: () => import(/* webpackChunkName: "Profile" */ "@/views/Profile.vue")
    },
    {
      path: "/register",
      component: () => import(/* webpackChunkName: "Register" */ "@/views/Register.vue")
    },
    {
      path: "/login",
      component: () => import(/* webpackChunkName: "Login" */ "@/views/Login.vue")
    }
  ]
})
