<template>
  <div class="register-wrapper">
    <h4 v-if="isAuthenticated">
      Jesteś zalogowany, czy aby na pewno chcesz się rejestrować?
    </h4>
    <form @submit.prevent="submit">
      <Spinner v-if="isLoading" size="60" />

      <h3>Rejestracja</h3>

      <input
        type="text"
        name="username"
        v-model="username"
        placeholder="Login"
      />
      <span class="error" v-if="error.username">{{ error.username }}</span>

      <input
        type="password"
        name="password"
        v-model="password"
        placeholder="Hasło"
      />
      <span class="error" v-if="error.password">{{ error.password }}</span>

      <input
        type="password"
        name="confirm_password"
        v-model="confirm_password"
        placeholder="Powtórz hasło"
      />
      <span class="error" v-if="error.confirm_password">{{
        error.confirm_password
      }}</span>

      <input type="email" name="email" v-model="email" placeholder="E-mail" />
      <span class="error" v-if="error.email">{{ error.email }}</span>
      <span class="error" v-if="error.form">{{ error.form }}</span>

      <button class="btn" type="submit">Zarejestruj się</button>
    </form>
  </div>
</template>

<script>
import Spinner from "../components/Spinner.vue";
import { mapGetters } from "vuex";
import { useToast } from "vue-toastification";

const toast = useToast();

export default {
  name: "Register",
  components: {
    Spinner,
  },
  data() {
    return {
      username: "",
      password: "",
      confirm_password: "",
      email: "",
      isLoading: false,
      error: {},
    };
  },
  methods: {
    submit() {
      this.isLoading = true;
      this.error = {};
      const { username, password, confirm_password, email } = this;

      fetch("api/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password, confirm_password, email }),
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
          if (e.success) {
            toast.success("Konto zostało zarejestrowane!");
          }
        })
        .catch(
          () => (this.error = { form: "Coś poszło nie tak, spróbuj ponownie!" })
        )
        .finally(() => (this.isLoading = false));
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
};
</script>

<style lang="scss" scoped>
h4 {
  background: $primary;
  border-radius: 2px;
  padding: 8px 16px;
  text-align: center;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

form {
  display: flex;
  flex-direction: column;
  position: relative;

  button {
    margin-top: 8px;
  }
}
</style>