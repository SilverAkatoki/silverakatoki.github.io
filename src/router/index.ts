import { createRouter, createWebHistory } from "vue-router";

import Archives from "@/views/Archives.vue";
import Article from "@/views/Article.vue";
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";
import Utils from "@/views/Utils.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/archives",
    name: "Archives",
    component: Archives
  },
  {
    path: "/archives/:path",
    name: "Article",
    component: Article
  },
  {
    path: "/utils",
    name: "Utils",
    component: Utils
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
