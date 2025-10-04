import { createRouter, createWebHistory } from "vue-router";

import Archive from "@/views/Archive/index.vue";
import Archives from "@/views/Archives.vue";
import Home from "@/views/Home.vue";
import NotFound from "@/views/NotFound.vue";

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
    path: "/archive/:uuid",
    name: "Archive",
    component: Archive
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
