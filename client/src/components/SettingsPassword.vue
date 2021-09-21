<template>
  <form @submit.prevent="submit">
    <Spinner v-if="isLoading" size="60" />
    <input type="password" v-model="password" placeholder="Hasło" />
    <span class="error" v-if="error.password">{{ error.password }}</span>

    <input type="password" v-model="newPassword" placeholder="Nowe hasło" />
    <span class="error" v-if="error.newPassword">
      {{ error.newPassword }}
    </span>

    <input
      type="password"
      v-model="confirmNewPassword"
      placeholder="Powtórz nowe hasło"
    />
    <span class="error" v-if="error.confirmNewPassword">
      {{ error.confirmNewPassword }}
    </span>

    <span class="error" v-if="error.form">
      {{ error.form }}
    </span>

    <button type="submit" class="btn">Zmień hasło</button>
  </form>
</template>

<script>
import Spinner from "./Spinner.vue";
import { mapActions, mapGetters } from "vuex";
import { useToast } from "vue-toastification";

const toast = useToast();

export default {
  name: "SettingsPassword",
  components: {
    Spinner,
  },
  data() {
    return {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
      error: {},
      isLoading: false,
    };
  },
  methods: {
    ...mapActions(["logout"]),
    submit() {
      this.error = {};
      this.isLoading = true;
      const { password, newPassword, confirmNewPassword } = this;
      fetch(`/api/user/password`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + this.getToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, newPassword, confirmNewPassword }),
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.auth == false) {
            this.logout();
            this.$router.push("/");
          }
          if (e.error) this.error = { ...e.error };

          if (e.success) {
            toast.success("Hasło zostało pomyślnie zmienione!");
          }
        })
        .finally(() => (this.isLoading = false));
    },
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;

  button {
    margin-top: 8px;
    border-radius: 2px;
  }
}
</style>