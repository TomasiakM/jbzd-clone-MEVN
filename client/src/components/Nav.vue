<template>
  <div class="nav-wrapper">
    <div class="nav">
      <router-link to="/" class="brand">
        <img src="@/assets/logo.png" alt="Logo jbzd" />
      </router-link>
      <Hamburger :isOpen="isOpen" @clickHandler="isOpen = !isOpen" />
      <div :class="['nav-right', isOpen ? '' : 'closed-menu']">
        <div class="links">
          <router-link to="/">Najnowsze</router-link>
          <router-link :to="{ name: 'SecondPage' }">Oczekujące</router-link>
          <router-link to="/losowe">Losowe</router-link>
          <router-link to="/upload">Upload</router-link>
        </div>
        <div class="user">
          <div v-if="isAuthenticated" class="user-data">
            <img :src="`/api/image/${getUserData.image}`" alt="Twój awatar" />
            <router-link :to="`/user/${getUserData.username}/memy`">{{
              getUserData.username
            }}</router-link>
            <LogoutIcon @click="logout" />
          </div>
          <div v-else class="user-login">
            <div v-if="isLoginFormOpen">
              <LoginForm id="2" />
            </div>
            <div v-else class="user-buttons">
              <button @click="isLoginFormOpen = !isLoginFormOpen">
                Zaloguj się
              </button>
              <router-link to="/rejestracja">Zarejestruj się</router-link>
            </div>
          </div>
        </div>
        <div class="mobile-links">
          <router-link to="/">Najnowsze</router-link>
          <router-link to="/oczekujace">Oczekujące</router-link>
          <router-link to="/losowe">Losowe</router-link>
          <router-link to="/upload">Upload</router-link>
          <router-link to="/ulubione">Ulubione</router-link>
          <router-link to="/ustawienia">Ustawienia</router-link>
        </div>
        <div class="categories">
          <span>Kategorie <ArrowIcon /></span>
          <div class="category-list">
            <h3>Publiczne</h3>
            <div class="category-links">
              <router-link
                v-for="cat in getCategories.categories"
                :key="cat.id"
                :to="`/kategoria/${cat.urlName}`"
              >
                {{ cat.name }}
              </router-link>
            </div>
            <div class="close-categories" v-if="isAuthenticated">
              <h3>Zamknięte</h3>
              <div class="category-links">
                <router-link
                  v-for="cat in getCategories.closeCategories"
                  :key="cat.id"
                  :to="`/nsfw/${cat.urlName}`"
                >
                  {{ cat.name }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginForm from "./LoginForm.vue";
import Hamburger from "./Hamburger.vue";
import ArrowIcon from "../svg/SmallArrow.vue";
import LogoutIcon from "../svg/Logout.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Nav",
  components: {
    LoginForm,
    Hamburger,
    ArrowIcon,
    LogoutIcon,
  },
  data() {
    return {
      isOpen: false,
      isLoginFormOpen: false,
      categories: [],
      closeCategories: [],
    };
  },
  watch: {
    "$route.path": function () {
      this.isOpen = false;
      this.isLoginFormOpen = false;
    },
  },
  methods: {
    ...mapActions(["logout"]),
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getUserData", "getCategories"]),
  },
};
</script>

<style scoped lang="scss">
.nav-wrapper {
  background: $dark;
  position: fixed;
  width: 100%;
  z-index: 1111;
}

.user {
  width: 100%;
  max-width: 600px;
  margin: 4px auto 0;
}

.user-data {
  display: flex;
  align-items: center;
  margin: 0 4px;

  a {
    text-decoration: none;
    color: $green;
  }

  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 8px;
  }

  svg {
    width: 16px;
    height: 16px;
    fill: white;
    cursor: pointer;
    margin-left: 12px;

    &:hover {
      fill: $primary;
    }
  }
}

.user-login {
  .user-buttons {
    display: flex;
    justify-content: space-between;
    margin: 8px;

    button {
      border: none;
      background: transparent;
      color: white;
      font-size: 14px;
      margin-right: 10px;
      cursor: pointer;
    }

    a {
      color: white;
      text-decoration: none;
      font-size: 14px;
    }
  }
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  height: 40px;
  padding: 4px;
  display: flex;
  align-items: center;

  img {
    height: 100%;
  }
}

.links {
  display: none;
}
.mobile-links {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 4px;
  padding: 12px 4px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  a {
    text-decoration: none;
    color: white;
    text-align: center;
    font-size: 14px;
    padding: 16px 0;
    background: $dark-light;
    border-radius: 2px;
  }
}

@media (max-width: 999px) {
  .nav-right {
    background: $dark;
    width: 100%;
    height: calc(100vh - 40px);
    position: absolute;
    top: 40px;
    overflow-y: auto;

    &.closed-menu {
      display: none;
    }
  }

  .categories {
    display: flex;
    flex-direction: column;
    font-size: 20px;
    width: 100%;
    max-width: 600px;
    padding: 0 4px;
    margin: 10px auto;

    span {
      display: none;
    }

    button.btn {
      width: 100%;
      padding: 4px 8px;
    }

    .category-list {
      font-size: 16px;
      display: flex;
      flex-direction: column;
      font-size: 14px;

      h3 {
        color: $gray;
        margin-top: 16px;
        margin-bottom: 4px;
      }

      .close-categories h3 {
        color: $primary;
      }

      .category-links {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 4px;

        a {
          background: $primary;
          color: white;
          text-decoration: none;
          padding: 16px 0;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 2px;
        }
      }
    }
  }
}

@media (min-width: 1000px) {
  .nav {
    max-width: 1000px;
    margin: 0 auto;
  }
  .nav-right {
    height: auto;
    display: flex;
  }
  .links {
    display: flex;

    a {
      display: inline-block;
      padding: 0 12px;
      text-align: center;
      height: 40px;
      line-height: 40px;
      color: white;
      text-decoration: none;
      border-bottom: 1px solid transparent;

      &:hover {
        border-bottom: 1px solid white;
      }

      &.router-link-active {
        border-bottom: 1px solid $primary;
      }
    }
  }
  .mobile-links {
    display: none;
  }

  .categories {
    padding: 0 12px;
    position: relative;

    span {
      height: 100%;
      display: flex;
      align-items: center;
    }

    svg {
      fill: white;
      margin-left: 4px;
      transition: all 0.2s ease-in-out;
    }

    &:hover {
      svg {
        fill: $primary;
        transform: rotate(180deg);
      }

      .category-list {
        display: block;
      }
    }
  }

  .user {
    display: none;
  }

  .category-list {
    background: $dark;
    padding: 16px;
    position: absolute;
    top: 100%;
    right: 0;
    display: none;
    cursor: auto;
    width: 200px;

    h3 {
      color: $gray;
      font-size: 14px;
      margin-bottom: 10px;
    }

    .category-links {
      display: flex;
      flex-direction: column;
    }

    .close-categories {
      display: flex;
      flex-direction: column;
      h3 {
        padding-top: 10px;
        border-top: 1px solid rgba($color: $gray, $alpha: 0.4);
        margin-top: 10px;
        color: $primary;
      }
    }

    a {
      margin: 2px 0 2px 20px;
      font-size: 15px;
      color: white;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      width: fit-content;

      &:hover {
        border-bottom: 1px solid $primary;
      }
    }
  }
}
</style>
