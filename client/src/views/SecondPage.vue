<template>
  <MemeList
    firstPagePath="/oczekujace"
    pagePath="/oczekujace"
    fetchPath="/api/meme/second"
    routeName="SecondPage"
  />
</template>

<script>
import MemeList from "../components/MemeList.vue";

export default {
  name: "SecondPage",
  components: {
    MemeList,
  },
};
</script>