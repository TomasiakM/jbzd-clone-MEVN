<template>
  <div class="meme-wrapper">
    <div :class="['meme', isOpen && 'open']" ref="meme">
      <div class="header card">
        <span v-if="$route.name == 'MemePage'">
          {{ data.title }}
        </span>
        <router-link :to="`/meme/${data._id}`" v-else>
          {{ data.title }}
        </router-link>
        <div class="comments">
          <CommentIcon />
          {{ totalComments() }}
        </div>
      </div>
      <div class="details card">
        <router-link
          :class="data.accountType == 'Admin' ? 'admin' : ''"
          :to="`/user/${data.author}/memy`"
          v-if="data.author"
        >
          {{ data.author }}
        </router-link>

        <TimeFromAdded :date="data.createdAt" />

        <router-link
          v-if="data.category"
          class="category"
          :to="`${data.category.isForAuthUsers ? '/nsfw' : '/kategoria'}/${
            data.category.urlName
          }`"
        >
          {{ data.category.name }}
        </router-link>
      </div>
      <div v-if="data.tags.length" class="tag-list">
        <router-link
          v-for="(tag, i) in data.tags"
          :key="i + tag"
          :to="`/tag/${tag}`"
          class="btn gray"
          >#{{ tag }}</router-link
        >
      </div>
      <div v-if="data.description" class="description card">
        {{ data.description }}
      </div>

      <div v-if="data.url">
        <div v-if="$route.name === 'MemePage'">
          <img
            ref="img"
            :src="`/api/image/${data.url}`"
            :alt="data.title"
            @load="setIsOpen"
          />
        </div>
        <router-link
          v-else
          :disabled="$route.name === 'MemePage'"
          :event="$route.name === 'MemePage' ? '' : 'click'"
          :to="`/meme/${data._id}`"
        >
          <img
            ref="img"
            :src="`/api/image/${data.url}`"
            :alt="data.title"
            @load="setIsOpen"
          />
        </router-link>
      </div>

      <button class="btn dark" v-if="!isOpen" @click="isOpen = true">
        Rozwiń
      </button>
    </div>
    <MemeAction :data="data" />
  </div>
</template>

<script>
import MemeAction from "./MemeAction.vue";
import TimeFromAdded from "./TimeFromAdded.vue";
import CommentIcon from "../svg/Comment.vue";

export default {
  name: "Meme",
  props: ["data"],
  components: {
    TimeFromAdded,
    CommentIcon,
    MemeAction,
  },
  data() {
    return {
      isOpen: true,
    };
  },
  mounted() {
    this.setIsOpen();
  },
  methods: {
    setIsOpen() {
      if (
        this.$refs.meme &&
        this.$refs.meme.clientHeight > 1000 &&
        this.$route.name != "MemePage"
      ) {
        this.isOpen = false;
      }
    },
    totalComments() {
      const { comments } = this.data;

      return comments.reduce((count, e) => {
        const { replies } = e;
        const countReplys = replies.reduce((repliesCount) => ++repliesCount, 0);
        return count + countReplys + 1;
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.meme-wrapper {
  max-width: 650px;
  margin-bottom: 50px;

  img {
    display: block;
    width: 100%;
  }

  .meme {
    max-height: 800px;
    overflow: hidden;
    position: relative;

    &.open {
      max-height: unset;
    }

    button {
      position: absolute;
      bottom: 0;
      width: 100%;
      background: $dark;
      padding: 12px 0;
      font-size: 16px;

      &:hover {
        background: rgba($color: $dark, $alpha: 0.9);
      }
    }
  }
}

.card {
  background: $dark-medium;
  padding: 8px 12px;
}

.header {
  font-size: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  a,
  span {
    color: white;
    text-decoration: none;
    word-wrap: break-word;
    min-width: 0;
  }

  .comments {
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-left: 6px;

    svg {
      margin-right: 4px;
    }
  }
}

.details {
  margin-top: 4px;
  font-size: 14px;
  display: flex;
  align-items: center;

  .admin {
    color: $primary;
  }

  span {
    margin-right: 8px;
  }

  .category {
    color: $primary;
    text-decoration: none;
    margin-left: 6px;
  }

  a {
    color: $green;
    text-decoration: none;
    margin-right: 6px;
  }
}

.tag-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin: 4px 0;
  gap: 4px;

  a {
    border-radius: 2px;
    padding: 3px 6px;
    font-size: 12px;
  }
}

.description {
  margin-top: 4px;
  font-size: 14px;
  word-wrap: break-word;
}
</style>