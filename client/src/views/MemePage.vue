<template>
  <div class="meme-wrapper">
    <Spinner v-if="isLoading" size="50" />
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <Meme :data="data" />
      <CommentSection :data="data" />
    </div>
  </div>
</template>

<script>
import Meme from "../components/Meme.vue";
import CommentSection from "../components/CommentSection.vue";
import Spinner from "../components/Spinner.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MemePage",
  components: {
    Meme,
    CommentSection,
    Spinner,
  },
  data() {
    return {
      data: null,
      error: null,
      isLoading: true,
    };
  },
  mounted() {
    this.fetchMemeData();
  },
  methods: {
    ...mapActions(["logout"]),
    fetchMemeData() {
      this.error = null;
      this.data = null;
      this.isLoading = true;

      const { id } = this.$route.params;
      fetch(`/api/meme/single/${id}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.isNotFound) return this.$router.replace("/404");
          if (e.auth == false) return this.logout();

          let params = {
            title: e.meme.title,
            isOnMainPage: e.meme.isOnMainPage,
          };

          if (e.meme.category) {
            const { name, urlName, isForAuthUsers } = e.meme.category;
            params = { ...params, name, urlName, isForAuthUsers };
          }

          this.$router.replace({ params });
          if (e.error) {
            this.error = e.error;
            return;
          }
          this.data = e.meme;
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
.meme-wrapper {
  position: relative;
  min-height: 150px;
}
</style>