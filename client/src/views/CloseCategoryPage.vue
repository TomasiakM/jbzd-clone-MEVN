<template>
  <MemeList
    :firstPagePath="`/close-category/${$route.params.category}`"
    :pagePath="`/close-category/${$route.params.category}`"
    :fetchPath="`/api/meme/close-category/${$route.params.category}`"
    routeName="CloseCategoryPage"
  />
</template>

  <script>
import MemeList from "../components/MemeList.vue";

export default {
  name: "CloseCategoryPage",
  components: {
    MemeList,
  },
};
</script>