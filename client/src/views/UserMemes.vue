<template>
  <MemeList
    :firstPagePath="`/user/${$route.params.username}/memy`"
    :pagePath="`/user/${$route.params.username}/memy`"
    :fetchPath="`/api/meme/user/${$route.params.username}`"
    routeName="UserMemes"
  />
</template>

<script>
import MemeList from "../components/MemeList.vue";

export default {
  name: "UserMemes",
  components: {
    MemeList,
  },
};
</script>