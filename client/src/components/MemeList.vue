<template>
  <div class="memes-list-wrapper">
    <div v-if="data && data.error" class="error-message">
      {{ data.error }}
    </div>
    <div v-else-if="data && data.docs">
      <Spinner v-if="isLoading" size="50" />
      <div>
        <Meme v-for="meme in data.docs" :key="meme._id" :data="meme" />
      </div>
      <Pagination
        v-if="data.totalPages > 1"
        :data="data"
        :firstPagePath="firstPagePath"
        :pagePath="pagePath"
      />
    </div>
    <Spinner v-else size="50" />
  </div>
</template>

<script>
import Meme from "../components/Meme.vue";
import Pagination from "../components/Pagination.vue";
import Spinner from "../components/Spinner.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MemeList",
  components: {
    Meme,
    Pagination,
    Spinner,
  },
  props: ["firstPagePath", "pagePath", "fetchPath", "routeName"],
  data() {
    return {
      data: null,
      isLoading: true,
    };
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    $route(to, from) {
      if (to.name == this.routeName) {
        this.$nextTick(() => {
          this.fetchData();
        });
      }
    },
  },
  methods: {
    ...mapActions(["logout"]),
    fetchData() {
      this.isLoading = true;
      let { page } = this.$route.params;
      if (!page) {
        page = 1;
      }
      page -= 1;

      fetch(`${this.fetchPath}/${page}`, {
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.isNotFound) return this.$router.replace("/404");
          if (e.auth == false) {
            this.logout();
            if (this.$route.meta.requiresAuth) this.$router.push("/");
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
.memes-list-wrapper {
  position: relative;
  min-height: 150px;
  overflow: hidden;

  .meme-wrapper:last-child {
    margin-bottom: 0;
  }
}
</style>