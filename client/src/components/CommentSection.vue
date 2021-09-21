<template>
  <div>
    <form @submit.prevent="submit" v-if="isAuthenticated">
      <Spinner v-if="isLoading" size="30" />
      <div>
        <textarea
          name="comment"
          v-model="message"
          placeholder="Napisz komentarz..."
        ></textarea>
        <button type="submit" class="btn">
          <SendIcon />
        </button>
      </div>
      <span v-if="error" class="error">{{ error }}</span>
    </form>
    <div>
      <div class="comments-wrapper">
        <div class="header">
          <div>{{ getCommentsAmount() }} komentarzy</div>
          <div class="sort">
            <button
              :class="sort == 'best' ? 'active' : ''"
              @click="sort = 'best'"
            >
              najlepsze
            </button>
            <button
              :class="sort == 'date' ? 'active' : ''"
              @click="sort = 'date'"
            >
              najnowsze
            </button>
          </div>
        </div>
        <div v-if="comments.length" class="comments-list">
          <div v-for="comment in sortedComments" :key="comment._id">
            <Comment
              @addComments="addComments"
              :data="comment"
              :meme="id"
              :comment="comment._id"
              :replyTo="comment._id"
              displayBottom="form"
            />
            <div class="replies-wrapper" v-if="comment.replies.length">
              <div v-for="reply in comment.replies" :key="reply._id">
                <Comment
                  @addComments="addComments"
                  :data="reply"
                  :meme="id"
                  :comment="reply._id"
                  :replyTo="comment._id"
                  displayBottom="form"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Comment from "./Comment";
import Spinner from "./Spinner";
import SendIcon from "../svg/Send.vue";
import { mapGetters } from "vuex";

export default {
  name: "Comments",
  components: {
    SendIcon,
    Comment,
    Spinner,
  },
  data() {
    return {
      message: "",
      error: null,
      isLoading: false,
      comments: this.data.comments,
      id: this.data._id,
      sort: "best",
    };
  },
  props: ["data"],
  methods: {
    submit() {
      this.error = null;
      this.isLoading = true;
      fetch(`/api/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + this.getToken,
        },
        body: JSON.stringify({ message: this.message, meme: this.id }),
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.error) {
            this.error = e.error;
            return;
          }
          if (e.comments) {
            this.comments = e.comments;
            this.message = "";
          }
        })
        .finally(() => (this.isLoading = false));
    },
    getCommentsAmount() {
      let amount = 0;
      this.comments.forEach((comment) => {
        amount++;
        comment.replies.forEach(() => {
          amount++;
        });
      });

      return amount;
    },
    addComments(comments) {
      this.comments = comments;
    },
  },
  computed: {
    ...mapGetters(["getToken", "isAuthenticated"]),
    sortedComments() {
      return this.comments.sort((a, b) => {
        return this.sort == "date"
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : b.points != a.points
          ? b.points - a.points
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  margin-bottom: 4px;
  background: $dark-medium;

  div {
    display: flex;
    padding: 8px;

    textarea {
      resize: none;
      margin: 0;
      width: 100%;
      background: $gray-dark;
    }
    button {
      padding: 0 12px;
      border-radius: 2px;
      margin-left: 8px;

      svg {
        width: 24px;
        height: 24px;
      }
    }
  }

  .error {
    margin: 4px 8px;
    margin-top: -4px;
  }
}

.comments-wrapper {
  padding: 12px;
  background: $dark-medium;
  margin-bottom: 20px;
}

.comments-list {
  margin-top: 20px;

  .comment {
    margin-bottom: 8px;
  }
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;

  button {
    border: none;
    background: none;
    color: $gray;
    cursor: pointer;
    font-size: 14px;

    &.active {
      color: $primary;
      cursor: unset;
    }
  }

  button:nth-child(2) {
    margin-left: 10px;
  }
}

.replies-wrapper {
  border-left: 1px solid $gray;
  padding-left: 10px;
  padding-top: 10px;
  margin-bottom: 10px;

  @media (min-width: 420px) {
    margin-left: 20px;
    padding-left: 20px;
  }
}
</style>