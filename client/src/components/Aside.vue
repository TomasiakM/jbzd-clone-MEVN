<template>
  <div class="aside">
    <div v-if="isAuthenticated && !getUserData.isLoading">
      <div class="user">
        <div class="loader" v-if="getUserData.isLoading">
          <Spinner size="45" />
        </div>
        <img
          :src="`/api/image/${getUserData.image}`"
          :alt="getUserData.username"
        />
        <div class="user-info">
          <div class="user-name">
            <span>{{ getUserData.username }}</span>
            <button @click="logout"><LogoutIcon /></button>
          </div>
          <div class="user-details">
            <div><ImageIcon /> {{ getUserData.memesCreated }}</div>
            <div><CommentIcon /> {{ getUserData.comments }}</div>
            <div><FlagIcon /> {{ getDate() }}</div>
          </div>
        </div>
      </div>
      <div class="links">
        <router-link :to="`/user/${getUserData.username}/memy`">
          Mój profil
        </router-link>
        <router-link to="/ulubione">Ulubione</router-link>
        <router-link to="/ustawienia">Ustawienia</router-link>
      </div>
    </div>
    <LoginForm id="1" v-else />
  </div>
</template>


<script>
import Spinner from "./Spinner.vue";
import LoginForm from "./LoginForm.vue";
import LogoutIcon from "../svg/Logout.vue";
import ImageIcon from "../svg/Image.vue";
import CommentIcon from "../svg/Comment.vue";
import FlagIcon from "../svg/Flag.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "Aside",
  components: {
    LoginForm,
    LogoutIcon,
    ImageIcon,
    CommentIcon,
    FlagIcon,
    Spinner,
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions(["logout"]),
    getDate() {
      const d = new Date(this.getUserData.createdAt);
      const day = d.getDate();
      const month = d.getMonth() + 1;
      const year = d.getFullYear();

      return `${day < 10 ? `0${day}` : day}.${
        month < 10 ? `0${month}` : month
      }.${year}`;
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getUserData"]),
  },
};
</script>

<style lang="scss" scoped>
.aside {
  position: sticky;
  top: 50px;
  width: 350px;
  margin-right: 4px;
  display: none;
  background: $gray-dark;
  padding: 8px;
}

.user {
  display: flex;
  position: relative;

  .loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $dark-light;
  }

  img {
    width: 120px;
    height: 120px;
    display: block;
    background: $gray-dark;
  }

  .user-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}

.user-name {
  background: $dark;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  font-size: 14px;

  span {
    max-width: 170px;
    overflow: hidden;
  }

  button {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
      fill: white;
    }

    &:hover svg {
      fill: $primary;
    }
  }
}
.user-details {
  padding: 0 8px 8px 8px;
  font-size: 15px;

  div {
    margin-top: 2px;
    display: flex;
    align-items: center;

    svg {
      margin-right: 6px;
    }
  }
}

.links {
  display: flex;
  margin-top: 10px;

  a {
    width: 100%;
    color: white;
    text-decoration: none;
    text-align: center;
    padding: 8px 0;
    font-size: 14px;
    background: $dark-light;

    &:hover {
      background: $dark;
    }
  }
}

@media (min-width: 1000px) {
  .aside {
    display: block;
  }
}
</style>