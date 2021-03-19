import { createRouter, createWebHistory } from "vue-router"

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import(/* webpackChunkName: "Home" */ "@/views/Feed.vue"),
    },
    {
      path: "/register",
      component: () => import(/* webpackChunkName: "Register" */ "@/views/Register.vue")
    },
    {
      path: "/login",
      component: () => import(/* webpackChunkName: "Login" */ "@/views/Login.vue")
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
      path: "/settings",
      component: () => import(/* webpackChunkName: "Settings" */ "@/views/settings/Index.vue"),
      children: [
        {
          path: "/settings/account",
          component: () => import(/* webpackChunkName: "AccountSettings" */ "@/views/settings/Account.vue")
        },
        {
          path: "/settings/profile",
          component: () => import(/* webpackChunkName: "AccountProfile" */ "@/views/settings/Profile.vue")
        }
      ]
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import(/* webpackChunkName: "NotFound" */ "@/views/NotFound.vue")
    }
  ]
})
