<template>
  <div>
    <div class="wrapper">
      <Spinner v-if="isLoading && !data" size="60" />
      <div v-else>
        <Spinner v-if="isLoading" size="60" />
        <Meme v-if="data" :key="data._id" :data="data" />
        <button @click="fetchData" class="btn">Losuj</button>
      </div>
    </div>
  </div>
</template>

<script>
import Meme from "../components/Meme.vue";
import Spinner from "../components/Spinner.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "Random",
  components: { Meme, Spinner },
  data() {
    return {
      data: null,
      isLoading: true,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    ...mapActions(["logout"]),
    fetchData() {
      this.isLoading = true;
      fetch(`/api/meme/random`, {
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
          if (e.meme) {
            this.data = e.meme;
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
.btn {
  width: 100%;
  border-radius: 2px;
  padding: 8px 0;
  font-size: 18px;

  @media (min-width: 768px) {
    font-size: 20px;
  }
}

.wrapper {
  position: relative;
  min-height: 150px;
}
</style>