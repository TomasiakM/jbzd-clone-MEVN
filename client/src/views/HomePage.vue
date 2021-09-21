<template>
  <MemeList
    firstPagePath="/"
    pagePath="/str"
    fetchPath="/api/meme/main"
    routeName="HomePage"
  />
</template>

<script>
import MemeList from "../components/MemeList.vue";

export default {
  name: "HomePage",
  components: {
    MemeList,
  },
};
</script>