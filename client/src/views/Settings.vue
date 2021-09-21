<template>
  <div class="settings-wrapper">
    <div class="tabs">
      <button
        :class="['btn', tabOpened != 'pass' && 'dark']"
        @click="tabOpened = 'pass'"
      >
        Hasło
      </button>
      <button
        :class="['btn', tabOpened != 'avatar' && 'dark']"
        @click="tabOpened = 'avatar'"
      >
        Avatar
      </button>
    </div>
    <div class="tab">
      <SettingsPassword v-if="tabOpened == 'pass'" />
      <SettingsAvatar v-if="tabOpened == 'avatar'" />
    </div>
  </div>
</template>

<script>
import SettingsPassword from "../components/SettingsPassword.vue";
import SettingsAvatar from "../components/SettingsAvatar.vue";
import { mapGetters } from "vuex";

export default {
  name: "Settings",
  data() {
    return {
      tabOpened: "pass",
    };
  },
  components: {
    SettingsPassword,
    SettingsAvatar,
  },
  watch: {
    getToken() {
      if (!this.getToken) this.$router.push("/");
    },
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
};
</script>

<style lang="scss" scoped>
.settings-wrapper {
  position: relative;
}

.tabs {
  margin-top: 16px;
  display: flex;
  gap: 4px;

  button {
    flex: 1;
    padding: 6px 0;
    border-radius: 4px;
    font-size: 16px;

    &.btn:hover {
      background: $primary;
    }

    &.btn.dark:hover {
      background: $dark;
    }
  }
}

.tab {
  background: $dark;
  padding: 8px 0;
  margin-top: 8px;
}
</style>