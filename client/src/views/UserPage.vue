<template>
  <div class="user-page-wrapper">
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="data">
      <div class="user-wrapper">
        <Spinner size="50" v-if="isLoading" />
        <div class="user-info">
          <div class="user-details">
            <img :src="`/api/image/${data.image}`" :alt="data.username" />
            <div>
              <h3>{{ data.username }}</h3>
              <div>
                <span><ImageIcon /> {{ data.memesCreated }}</span>
                <span><CommentIcon /> {{ data.commentsCreated }}</span>
                <span><FlagIcon /> {{ getCreatedAtDate() }}</span>
              </div>
            </div>
          </div>
          <div class="rank">
            <span>
              <LikeIcon /> {{ profileUpVotes }}
              <button
                :class="isUpVoted ? 'active' : ''"
                @click="upVoteProfile"
                v-if="data.isVisible"
              >
                +
              </button>
            </span>
            <span><TrophyIcon /> {{ userRank }}</span>
          </div>
        </div>
      </div>
      <div class="links">
        <router-link :to="{ name: 'UserMemes' }">
          Memy użytkownika
        </router-link>
        <router-link :to="{ name: 'UserComments' }">
          Komentarze użytkownika
        </router-link>
      </div>
      <router-view v-if="data" :key="data.username"></router-view>
    </div>
    <Spinner size="50" v-else />
  </div>
</template>

<script>
import Spinner from "../components/Spinner.vue";
import ImageIcon from "../svg/Image.vue";
import CommentIcon from "../svg/Comment.vue";
import FlagIcon from "../svg/Flag.vue";
import TrophyIcon from "../svg/Trophy.vue";
import LikeIcon from "../svg/Like.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "UserPage",
  components: {
    Spinner,
    ImageIcon,
    CommentIcon,
    FlagIcon,
    TrophyIcon,
    LikeIcon,
  },
  data() {
    return {
      data: null,
      profileUpVotes: 0,
      userRank: 0,
      isVisible: false,
      isUpVoted: false,
      isLoading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    "$route.params.username"(to, from) {
      if (this.$route.params.username) this.fetchData();
    },
  },
  methods: {
    ...mapActions(["logout"]),
    fetchData() {
      this.isLoading = true;
      this.error = null;
      const { username } = this.$route.params;

      fetch(`/api/user/info/${username}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.isNotFound) return this.$router.replace("/404");
          if (e.auth == false) return this.logout();

          this.profileUpVotes = e.data.profileUpVotes;
          this.userRank = e.data.userRank;
          this.isUpVoted = e.data.isUpVoted;
          this.data = e.data;
        })
        .finally(() => (this.isLoading = false));
    },
    getImageSrc() {
      const { data } = this;

      if (!data || !data.image) return `/api/storage/profilePic/default.jpg`;
      return `/api/storage/profilePic/${data.image}`;
    },
    getCreatedAtDate() {
      const { createdAt } = this.data;
      const d = new Date(createdAt);
      let day = d.getDate();
      day = day < 10 ? "0" + day : day;
      let month = d.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      const year = d.getFullYear();

      return `${day}.${month}.${year}`;
    },
    upVoteProfile() {
      fetch(`/api/user/like/${this.data.username}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.success) {
            this.isUpVoted = e.isUpVoted;
            this.profileUpVotes = e.profileUpVotes;
            this.userRank = e.userRank;
          }
        });
    },
  },
  computed: {
    ...mapGetters(["getToken"]),
  },
};
</script>

<style lang="scss" scoped>
.user-page-wrapper {
  position: relative;
  min-height: 100px;
}

.user-wrapper {
  position: relative;
  min-height: 100px;
  margin-bottom: 20px;
}
.user-info {
  display: flex;
  flex-direction: column;

  img {
    width: 75px;
    height: 75px;
    border-radius: 50%;

    @media (min-width: 768px) {
      width: 100px;
      height: 100px;
    }
  }

  .rank {
    background: $dark;
    border-radius: 5px;
    padding: 10px;
    padding-left: 16px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    min-width: 120px;

    span {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      position: relative;

      svg {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }

      button {
        width: 24px;
        height: 24px;
        position: absolute;
        right: -30px;
        top: 50%;
        transform: translateY(-50%);
        border: none;
        color: white;
        font-size: 18px;
        border-radius: 50%;
        background: $primary;
        cursor: pointer;

        &.active {
          background: $green;
        }
      }
    }

    @media (min-width: 768px) {
      flex-direction: column;
      margin-top: 0;

      & > span:nth-child(1) {
        margin-bottom: 20px;
      }

      span button {
        left: -28px;
      }
    }
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.user-details {
  display: flex;
  align-items: center;

  & > div:nth-child(2) {
    margin-left: 10px;

    h3 {
      font-size: 15px;

      @media (min-width: 768px) {
        font-size: 22px;
      }
    }

    div {
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
    }

    span {
      font-size: 14px;
      margin-right: 16px;
      display: flex;
      align-items: center;

      svg {
        width: 18px;
        height: 18px;
        margin: 2px 6px 2px 0;
      }
    }

    @media (min-width: 768px) {
      margin-left: 20px;
    }
  }
}

.links {
  display: flex;
  font-size: 13px;
  margin-bottom: 20px;

  a {
    background: $dark;
    color: white;
    text-decoration: none;
    width: 100%;
    text-align: center;
    padding: 8px 0;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:nth-child(1) {
      margin-right: 2px;
    }
    &:nth-child(2) {
      margin-left: 2px;
    }

    &.router-link-active {
      background: $primary;
    }
  }

  @media (min-width: 768px) {
    font-size: 16px;
  }
}
</style>