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
  },
  {
    path: "/tag",
    name: "Tag",
    component: () => import("@/views/Tag.vue")
  }
];

const router = createRouter({
  history: createWebHashHistory(),  // 改成 Hash 模式，要不然 Github Pages 刷新就 404 了
  routes
});

export default router;
