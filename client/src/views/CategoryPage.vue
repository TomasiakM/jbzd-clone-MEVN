<template>
  <MemeList
    :firstPagePath="`/kategoria/${$route.params.category}`"
    :pagePath="`/kategoria/${$route.params.category}`"
    :fetchPath="`/api/meme/category/${$route.params.category}`"
    routeName="CategoryPage"
  />
</template>

<script>
import MemeList from "../components/MemeList.vue";

export default {
  name: "CategoryPage",
  components: {
    MemeList,
  },
};
</script>