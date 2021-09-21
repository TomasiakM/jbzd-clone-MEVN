<template>
  <MemeList
    firstPagePath="/ulubione"
    pagePath="/ulubione"
    fetchPath="/api/meme/favorites"
    routeName="FavoriteMemes"
  />
</template>

<script>
import MemeList from "../components/MemeList.vue";

export default {
  name: "FavoriteMemes",
  components: {
    MemeList,
  },
};
</script>