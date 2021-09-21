import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import SecondPage from "../views/SecondPage.vue";
import Random from "../views/Random.vue";
import Register from "../views/Register.vue";
import Upload from "../views/Upload.vue";
import MemePage from "../views/MemePage.vue";
import CategoryPage from "../views/CategoryPage.vue";
import CloseCategoryPage from "../views/CloseCategoryPage.vue";
import FavoriteMemes from "../views/FavoriteMemes.vue";
import UserPage from "../views/UserPage.vue";
import UserMemes from "../views/UserMemes.vue";
import UserComments from "../views/UserComments.vue";
import TagPage from "../views/TagPage.vue";
import Settings from "../views/Settings.vue";
import NotFound from "../views/NotFound.vue";
import { useToast } from "vue-toastification";

const toast = useToast();

const routes = [
  {
    name: "HomePage",
    path: "/",
    component: HomePage,
    alias: "/str/:page",
    meta: { breadcrumb: [{ name: "Strona główna", path: "/" }] },
  },
  {
    name: "SecondPage",
    path: "/oczekujace/:page?",
    component: SecondPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { name: "Strona główna", path: "/" },
        { name: "Oczekujące", path: "/oczekujace" },
      ],
    },
  },
  {
    name: "CategoryPage",
    path: "/kategoria/:category/:page?",
    component: CategoryPage,
    meta: {
      breadcrumb: [
        { name: "Strona główna", path: "/" },
        { name: "", path: "/kategoria", isCategory: true },
      ],
    },
  },
  {
    name: "CloseCategoryPage",
    path: "/nsfw/:category/:page?",
    component: CloseCategoryPage,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { name: "Strona główna", path: "/" },
        { name: "", path: "/nsfw", isCategory: true },
      ],
    },
  },
  {
    name: "TagPage",
    path: "/tag/:tag/:page?",
    component: TagPage,
    meta: {
      breadcrumb: [
        { name: "Strona główna", path: "/" },
        { name: "", path: "/tag", isTag: true },
      ],
    },
  },
  {
    name: "MemePage",
    path: "/meme/:id",
    component: MemePage,
    meta: {
      breadcrumb: [{ name: "Loading...", path: "/" }],
    },
  },
  {
    name: "UserPage",
    path: "/user/:username",
    component: UserPage,
    meta: {
      breadcrumb: [
        { name: "Strona główna", path: "/" },
        { name: "", path: "#", isUser: true },
      ],
    },
    children: [
      {
        name: "UserMemes",
        path: "memy/:page?",
        component: UserMemes,
      },
      {
        name: "UserComments",
        path: "komentarze/:page?",
        component: UserComments,
      },
    ],
  },
  {
    name: "FavoriteMemes",
    path: "/ulubione/:page?",
    component: FavoriteMemes,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { name: "Strona główna", path: "/" },
        { name: "Ulubione", path: "/ulubione" },
      ],
    },
  },
  {
    path: "/upload",
    name: "Upload",
    component: Upload,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { name: "Strona główna", path: "/" },
        { name: "Upload", path: "/upload" },
      ],
    },
  },
  {
    path: "/losowe",
    name: "Random",
    component: Random,
    meta: {
      breadcrumb: [
        { name: "Strona główna", path: "/" },
        { name: "Losowe", path: "/losowe" },
      ],
    },
  },
  {
    path: "/rejestracja",
    name: "Register",
    component: Register,
    meta: {
      breadcrumb: [
        { name: "Strona główna", path: "/" },
        { name: "Rejestracja", path: "/rejestracja" },
      ],
    },
  },
  {
    path: "/ustawienia",
    name: "Settings",
    component: Settings,
    meta: {
      requiresAuth: true,
      breadcrumb: [
        { name: "Strona główna", path: "/" },
        { name: "Ustawienia", path: "/ustawienia" },
      ],
    },
  },
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return { ...savedPosition, behavior: "smooth" };
    }
    return { left: 0, top: 0, behavior: "smooth" };
  },
});

router.beforeEach((to, from, next) => {
  const token = localStorage["token"];

  if (to.meta.requiresAuth) {
    if (token) {
      next();
    } else {
      toast.error("Strona dla zalogowanych!");
      if (!from.meta.requiresAuth) {
        next({ name: from.name, params: from.params });
      } else {
        next({ name: "HomePage" });
      }
    }
  } else {
    next();
  }
});

export default router;
