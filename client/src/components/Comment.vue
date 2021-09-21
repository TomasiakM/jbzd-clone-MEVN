<template>
  <div class="comment">
    <div class="content">
      <div class="header">
        <div class="img-wrapper">
          <img
            :src="`/api/image/${data.image}`"
            :alt="`Awatar użytkownika ${data.username}`"
          />
        </div>
        <div class="header-details">
          <div class="comment-details">
            <router-link
              :to="`/user/${data.username}/memy`"
              :class="['username', data.accountType == 'Admin' ? 'admin' : '']"
            >
              {{ data.username }}
            </router-link>
            <TimeFromAdded :date="data.createdAt" />
          </div>
          <div class="comment-action">
            <button
              :class="isUpVoted ? 'active' : ''"
              @click="rateComment('like')"
            >
              <PlusIcon />
            </button>
            <span>{{ points }}</span>
            <button
              :class="isDownVoted ? 'active red' : ''"
              @click="rateComment('dislike')"
            >
              <MinusIcon />
            </button>
          </div>
        </div>
      </div>
      <div class="comment-message">{{ data.message }}</div>

      <div v-if="displayBottom == 'form' && isAuthenticated">
        <button class="comment-bottom-btn" @click="isOpen = !isOpen">
          odpowiedz
        </button>
        <form @submit.prevent="submit" v-if="isOpen">
          <Spinner v-if="isLoading" size="30" />
          <div>
            <textarea
              v-model="message"
              placeholder="Napisz odpowiedź..."
            ></textarea>
            <button type="submit" class="btn">
              <SendIcon />
            </button>
          </div>
          <span v-if="error" class="error">{{ error }}</span>
        </form>
      </div>

      <div v-if="displayBottom == 'link'">
        <router-link :to="`/meme/${meme}`" class="comment-bottom-btn"
          >Przejdź do mema</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import TimeFromAdded from "./TimeFromAdded.vue";
import { mapGetters } from "vuex";
import SendIcon from "../svg/Send.vue";
import PlusIcon from "../svg/Plus.vue";
import MinusIcon from "../svg/Minus.vue";
import Spinner from "../components/Spinner.vue";
import { useToast } from "vue-toastification";

const toast = useToast();

export default {
  name: "Comment",
  props: ["data", "meme", "comment", "replyTo", "displayBottom"],
  components: {
    SendIcon,
    PlusIcon,
    MinusIcon,
    TimeFromAdded,
    Spinner,
  },
  data() {
    return {
      isUpVoted: this.data.isUpVoted,
      isDownVoted: this.data.isDownVoted,
      points: this.data.points,
      isOpen: false,
      message: "",
      error: null,
      isLoading: false,
    };
  },
  methods: {
    submit() {
      const { meme, replyTo, message } = this;
      this.error = null;
      this.isLoading = true;

      fetch(`/api/comment`, {
        method: "POST",
        body: JSON.stringify({ message, meme, replyTo }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.error) {
            this.error = e.error;
            return;
          }
          if (e.comments) {
            this.message = "";
            this.isOpen = false;
            this.$emit("addComments", e.comments);
          }
        })
        .finally(() => (this.isLoading = false));
    },
    rateComment(type) {
      if (!this.isAuthenticated) {
        return toast.error("Nie jesteś zalogowany!");
      }

      fetch(`/api/comment/action/${type}/${this.comment}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.success) {
            this.isUpVoted = e.isUpVoted;
            this.isDownVoted = e.isDownVoted;
            this.points = e.points;
          }
        });
    },
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getToken", "getUserData"]),
  },
};
</script>

<style lang="scss" scoped>
.comment {
  display: flex;

  .content {
    display: flex;
    flex-direction: column;
    width: 100%;

    .comment-message {
      margin-top: 4px;
      word-break: break-word;
      font-size: 14px;
    }
  }
}

.header {
  display: flex;
  align-items: center;

  .img-wrapper {
    width: 40px;
    height: 40px;
    margin-right: 6px;
    display: flex;
    align-items: center;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .header-details {
    display: flex;
    flex: 1;
    min-width: 0;

    .comment-action {
      display: flex;
      align-items: center;

      span {
        margin: 0 5px;
        font-size: 15px;
      }

      button {
        width: 20px;
        height: 20px;
        border: none;
        background: $dark-light;
        color: white;
        border: 1px solid $gray-dark;
        cursor: pointer;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;

        svg {
          width: 18px;
          height: 18px;
        }

        &.active {
          border: none;
          background: $green;

          &.red {
            background: $primary;
          }
        }
      }
    }

    .comment-details {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      margin-right: 8px;
      text-overflow: ellipsis;
      white-space: nowrap;

      .username {
        color: $green;
        text-decoration: none;
        font-size: 14px;

        &.admin {
          color: $primary;
        }
      }

      .date {
        color: $gray;
        font-size: 12px;
      }
    }
  }
}

.comment-bottom-btn {
  border: none;
  color: $gray;
  width: fit-content;
  cursor: pointer;
  display: block;
  font-size: 14px;
  text-decoration: none;
  margin-left: auto;
  background: none;
}

form {
  margin: 10px 0;
  padding: 0;
  background: none;
  position: relative;

  div {
    display: flex;
  }

  textarea {
    width: 100%;
    resize: none;
    margin: 0;
    background: $gray-dark;
  }

  button {
    margin-left: 8px;
    padding: 0 12px;
    border-radius: 2px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
  .error {
    margin: 0;
  }
}

@media (min-width: 768px) {
  .header .comment-details {
    .username {
      font-size: 16px;
    }

    .date {
      font-size: 14px;
    }
  }
}
</style>