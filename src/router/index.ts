import { createRouter, createWebHistory } from "vue-router";

import Article from "@/views/Article/index.vue";
import Articles from "@/views/Articles.vue";
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/articles",
    name: "Articles",
    component: Articles
  },
  {
    path: "/article/:uuid",
    name: "Article",
    component: Article
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
