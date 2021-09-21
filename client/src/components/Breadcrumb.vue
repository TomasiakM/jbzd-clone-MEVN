<template>
  <div class="breadcrumb">
    <div v-for="(item, i) in getBreadcrumb" :key="i">
      <router-link
        :to="item.path"
        :class="i == getBreadcrumb.length - 1 ? 'disabled' : ''"
      >
        {{ item.name }}
      </router-link>
      <span v-if="getBreadcrumb[i + 1]">></span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Breadcrumb",
  watch: {
    $route(to) {
      let { title, isOnMainPage, name, urlName, isForAuthUsers } =
        this.$route.params;
      if (title) {
        isOnMainPage = isOnMainPage == "true";

        let breadcrumb = [];

        if (isOnMainPage) {
          breadcrumb.push({ name: "Strona główna", path: "/" });
        } else {
          breadcrumb.push({ name: "Oczekujące", path: "/oczekujace" });
        }

        if (name) {
          isForAuthUsers = isForAuthUsers == "true";
          const path = isForAuthUsers ? "/nsfw" : "/kategoria";
          breadcrumb.push({ name, path: `${path}/${urlName}` });
        }

        breadcrumb.push({ name: title, path: "" });

        this.$route.meta.breadcrumb = breadcrumb;
      }
    },
  },
  computed: {
    ...mapGetters(["getCategories"]),
    getBreadcrumb() {
      const { breadcrumb } = this.$route.meta;
      if (breadcrumb) {
        const mapBreadcrumb = breadcrumb.map((e) => {
          if (e.isCategory) {
            let { category } = this.$route.params;
            const { categories, closeCategories } = this.getCategories;

            category =
              categories.find((e) => e.urlName == category) ||
              closeCategories.find((e) => e.urlName == category);

            return {
              name: category?.name || "undefined",
              path: category ? `${e.path}/${category?.urlName}` : "/",
            };
          }
          if (e.isMeme) {
            return { name: this.$route.params.id, path: "#" };
          }

          if (e.isUser) {
            const { username } = this.$route.params;
            return { name: username, path: `/user/${username}/memy` };
          }

          if (e.isTag) {
            const { tag } = this.$route.params;
            return { name: `#${tag}`, path: `/tag/${tag}` };
          }

          return e;
        });

        const { name } = this.$route;
        if (name == "UserComments") {
          const { username } = this.$route.params;
          mapBreadcrumb.push({
            name: "Komentarze",
            path: `/user/${username}/komentarze`,
          });
        }

        if (name == "UserMemes") {
          const { username } = this.$route.params;
          mapBreadcrumb.push({ name: "Memy", path: `/user/${username}/memy` });
        }

        const { page } = this.$route.params;
        if (page && page != 1)
          mapBreadcrumb.push({ name: `Strona ${page}`, path: "#" });
        return mapBreadcrumb;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  margin: 10px 0 20px;
  display: flex;
  flex-wrap: wrap;
  font-size: 14px;

  div {
    word-wrap: break-word;
    min-width: 0;
  }

  div span {
    margin: 0 8px;
    color: $gray;
  }

  a {
    text-decoration: none;
    color: white;
    word-wrap: break-word;
    min-width: 0;

    &.disabled {
      color: $gray;
      pointer-events: none;
    }
  }

  @media (min-width: 768px) {
    font-size: 16px;
  }
}
</style>