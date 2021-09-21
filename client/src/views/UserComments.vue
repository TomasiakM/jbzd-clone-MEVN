<template>
  <div class="user-commetns-wrapper">
    <div v-if="data && data.error" class="error-message">{{ data.error }}</div>
    <div v-else-if="data && data.docs" class="comment-list">
      <Spinner v-if="isLoading" size="60" />
      <div class="sorting">
        <span>
          <CommentIcon />
          {{ data.totalDocs || 0 }}
        </span>
        <div>
          <button :class="sort == 'date' && 'active'" @click="sort = 'date'">
            najnowsze
          </button>
          <button :class="sort == 'best' && 'active'" @click="sort = 'best'">
            najlepsze
          </button>
        </div>
      </div>
      <div
        class="comment-wrapper"
        v-for="comment in data.docs"
        :key="comment._id"
      >
        <Comment
          :data="comment"
          :meme="comment.meme"
          :comment="comment._id"
          :replyTo="comment.replyTo"
          displayBottom="link"
        />
      </div>
      <Pagination
        v-if="data"
        :data="data"
        :firstPagePath="`/user/${$route.params.username}/komentarze`"
        :pagePath="`/user/${$route.params.username}/komentarze`"
      />
    </div>
    <Spinner v-else size="60" />
  </div>
</template>

<script>
import Comment from "../components/Comment.vue";
import Pagination from "../components/Pagination.vue";
import Spinner from "../components/Spinner.vue";
import CommentIcon from "../svg/Comment.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "UserComments",
  components: {
    Comment,
    Pagination,
    Spinner,
    CommentIcon,
  },
  data() {
    return {
      data: null,
      isLoading: true,
      sort: "best",
    };
  },
  watch: {
    $route(to, from) {
      if (to.name == "UserComments") {
        this.fetchData();
      }
    },
    sort() {
      this.fetchData();
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["logout"]),
    fetchData() {
      this.isLoading = true;
      let { username, page } = this.$route.params;
      if (!page) page = 1;
      page--;

      fetch(`/api/comment/user/${username}/${page}?sort=${this.sort}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.auth == false) {
            this.logout();
            return;
          }
          this.data = e;
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
.user-commetns-wrapper {
  position: relative;
  min-height: 150px;
}

.comment-wrapper {
  background: $dark;
  margin-top: 8px;

  .comment {
    padding: 8px;
  }
}

.comment {
  margin-top: 10px;
}

.sorting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $dark;
  padding: 12px 8px;

  span,
  div {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
  }

  button {
    border: none;
    background: none;
    color: $gray;
    cursor: pointer;

    &.active {
      color: $primary;
    }
  }
}
</style>