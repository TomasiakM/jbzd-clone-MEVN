<template>
  <MemeList
    :firstPagePath="`/tag/${$route.params.tag}`"
    :pagePath="`/tag/${$route.params.tag}`"
    :fetchPath="`/api/meme/tag/${$route.params.tag}`"
    routeName="TagPage"
  />
</template>

<script>
import MemeList from "../components/MemeList.vue";

export default {
  name: "TagPage",
  components: {
    MemeList,
  },
};
</script>