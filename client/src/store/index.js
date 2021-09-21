import { createStore } from "vuex";
import { useToast } from "vue-toastification";

const toast = useToast();

export default createStore({
  state: {
    token: localStorage.getItem("token") || "",
    isAdmin: null,
    userData: {
      createdAt: null,
      memesCreated: null,
      comments: null,
      username: null,
      image: "default.jpg",
      isLoading: !!localStorage.getItem("token"),
      error: null,
    },
    categories: [],
    closeCategories: [],
  },
  mutations: {
    REMOVE_TOKEN(state, err) {
      state.token = "";
      state.userData = {
        createdAt: null,
        memesCreated: null,
        comments: null,
        username: null,
        image: null,
        isLoading: false,
        error: err,
      };
      state.isAdmin = null;
      localStorage.token = "";
    },
    SET_TOKEN(state, { token, userData }) {
      state.userData = { ...state.userData, ...userData, isLoading: false };
      state.isAdmin = userData.accountType == "Admin";
      state.token = token;
      localStorage.token = token;
    },
    SET_USER_DATA(
      state,
      { createdAt, memesCreated, comments, image, username, accountType }
    ) {
      state.userData = {
        ...state.userData,
        createdAt,
        image,
        memesCreated,
        comments,
        username,
        isLoading: false,
      };
      state.isAdmin = accountType == "Admin";
    },
    SET_CATEGORIES(state, { categories, closeCategories }) {
      state.categories = categories;
      state.closeCategories = closeCategories;
    },
    SET_IMAGE(state, image) {
      state.userData.image = image;
    },
  },
  actions: {
    setImage({ commit }, image) {
      commit("SET_IMAGE", image);
    },
    logout({ commit, getters }) {
      if (getters.isAuthenticated) toast.info("Zostałeś wylogowany!");
      commit("REMOVE_TOKEN");
    },
    login({ commit }, { token, userData }) {
      commit("SET_TOKEN", { token, userData });
    },
    fetchUserData({ getters, commit }) {
      const url = "/api/auth/verify";
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + getters.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.auth == false) {
            commit("REMOVE_TOKEN");
            return;
          }
          commit("SET_USER_DATA", e.userData);
        })
        .catch((err) => {
          commit("REMOVE_TOKEN", err);
        });
    },
    fetchCategories({ commit }) {
      fetch("/api/category")
        .then((e) => e.json())
        .then((e) => {
          commit("SET_CATEGORIES", {
            categories: e.categories,
            closeCategories: e.closeCategories,
          });
        });
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.isAdmin,
    getToken: (state) => state.token,
    getUserData: (state) => state.userData,
    getCategories: (state) => {
      const { categories, closeCategories } = state;
      return { categories, closeCategories };
    },
  },
});
