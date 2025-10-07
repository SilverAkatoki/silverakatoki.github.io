import { createRouter, createWebHashHistory } from "vue-router";

import Home from "@/views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/articles",
    name: "Articles",
    component: () => import("@/views/Articles.vue")
  },
  {
    path: "/article",
    name: "Article",
    component: () => import("@/views/Article/index.vue")
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
