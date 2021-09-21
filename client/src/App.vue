<template>
  <div class="app">
    <Nav />
    <div class="container">
      <div class="main">
        <Breadcrumb />
        <router-view :key="isAuthenticated" />
      </div>
      <Aside />
    </div>
    <Footer />
  </div>
</template>

<script>
import Breadcrumb from "./components/Breadcrumb.vue";
import Nav from "./components/Nav.vue";
import Aside from "./components/Aside.vue";
import Footer from "./components/Footer.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "App",
  components: {
    Breadcrumb,
    Nav,
    Aside,
    Footer,
  },
  methods: {
    ...mapActions(["fetchUserData", "fetchCategories"]),
    token() {
      return localStorage.token;
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getUserData"]),
  },
  mounted() {
    this.fetchCategories();
    if (localStorage.token) {
      this.fetchUserData();
    }
  },
};
</script>

<style lang="scss">
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}
body {
  background: $dark-light;
  color: white;
}

.app {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;
}

.Vue-Toastification__container .custom-toast {
  padding: 12px 14px;
  min-height: unset;
  margin-bottom: 0.5rem;

  &.Vue-Toastification__toast--error {
    background: $primary;
  }

  &.Vue-Toastification__toast--info {
    background: $gray;
  }
}
.Vue-Toastification__container.custom-toast-container {
  top: 0 !important;

  @media (min-width: 601px) {
    top: 36px !important;
  }

  @media (min-width: 1000px) {
    top: 40px !important;
  }
}

.container {
  width: 100%;
  max-width: 1000px;
  padding-top: 50px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.main {
  width: 100%;
  max-width: 600px;
  padding: 0 4px;
}

@media (min-width: 1000px) {
  .container {
    justify-content: space-between;
  }
}
</style>
