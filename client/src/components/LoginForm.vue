<template>
  <form @submit.prevent="submit">
    <Spinner v-if="isLoading || getUserData.isLoading" size="60" />

    <h3>Zaloguj się!</h3>

    <input type="text" v-model="username" placeholder="Login/E-mail" />
    <span v-if="error.username" class="error">
      {{ error.username }}
    </span>

    <input type="password" v-model="password" placeholder="Hasło" />
    <span v-if="error.password" class="error">
      {{ error.password }}
    </span>

    <span v-if="error.form" class="error">{{ error.form }}</span>

    <div class="form-group">
      <input type="checkbox" :id="`checkbox-${id}`" v-model="remember" />
      <label :for="`checkbox-${id}`">Zapamiętaj mnie!</label>
      <router-link to="/rejestracja">Zarejestruj się!</router-link>
    </div>

    <button class="btn" type="submit">Zaloguj się</button>
  </form>
</template>

<script>
import Spinner from "./Spinner.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "LoginForm",
  components: {
    Spinner,
  },
  props: ["id"],
  data() {
    return {
      username: "test",
      password: "Test123",
      remember: false,
      error: {},
      isLoading: false,
    };
  },
  methods: {
    ...mapActions(["login"]),
    submit() {
      this.isLoading = true;
      this.error = {};

      const { username, password, remember } = this;
      fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password, remember }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.error) {
            this.error = e.error;
            return;
          }
          if (e.token) {
            this.login(e);
            return;
          }
        })
        .catch((err) => {
          this.error.form = "Coś poszło nie tak, spróbuj ponownie!";
          console.log(err);
        })
        .finally(() => (this.isLoading = false));
    },
  },
  computed: {
    ...mapGetters(["getUserData"]),
  },
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  position: relative;
}

.form-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 0;
}

.form-group a {
  margin-right: 7px;
  color: $gray;
  text-decoration: none;
  font-size: 14px;
}

.form-group input {
  padding: 0;
  height: initial;
  width: initial;
  margin-bottom: 0;
  position: absolute;
  left: -11111px;
  cursor: pointer;

  &:focus {
    + label:befor {
      box-shadow: 0 1px 4px rgba(255, 255, 255, 0.6);
    }
  }
}

.form-group label {
  position: relative;
  cursor: pointer;
  color: $gray;
  font-size: 14px;
}

.form-group label:before {
  content: "";
  -webkit-appearance: none;
  background-color: transparent;
  border: 2px solid $primary;
  padding: 8px;
  display: inline-block;
  position: relative;
  vertical-align: middle;
  cursor: pointer;
  margin-right: 5px;
}

.form-group input:checked + label:after {
  content: "";
  display: block;
  position: absolute;
  top: 3px;
  left: 7px;
  width: 6px;
  height: 11px;
  border: solid $primary;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>