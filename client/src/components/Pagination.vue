<template>
  <div class="pagination-wrapper" v-if="data.totalPages != 1">
    <div class="navigation">
      <router-link
        :class="['btn', data.page == data.totalPages ? 'disabled' : '']"
        :to="`${pagePath}/${data.page + 1}`"
      >
        Następna strona
      </router-link>
      <router-link class="btn random" to="/losowe">
        <DiceIcon />
      </router-link>
    </div>
    <div class="mobile-navigation">
      <router-link
        :class="['btn', data.page == 1 ? 'disabled' : '']"
        :to="
          data.page - 1 == 1 ? firstPagePath : `${pagePath}/${data.page - 1}`
        "
      >
        <ArrowIcon type="left" />
      </router-link>
      <router-link class="btn random" to="/losowe">
        <DiceIcon />
      </router-link>
      <router-link
        :class="['btn', data.page == data.totalPages ? 'disabled' : '']"
        :to="`${pagePath}/${data.page + 1}`"
      >
        <ArrowIcon type="right" />
      </router-link>
    </div>
    <div class="pages">
      <router-link
        v-for="page in pages()"
        :key="page"
        :to="page == 1 ? firstPagePath : `${pagePath}/${page}`"
        :class="['btn', page == data.page ? 'disabled red' : '']"
      >
        <span>{{ page }}</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import ArrowIcon from "../svg/Arrow.vue";
import DiceIcon from "../svg/Dice.vue";

export default {
  name: "Pagination",
  props: ["data", "firstPagePath", "pagePath"],
  components: {
    ArrowIcon,
    DiceIcon,
  },
  methods: {
    pages() {
      let numShown = 7;
      numShown = Math.min(numShown, this.data.totalPages);
      let first = this.data.page - Math.floor(numShown / 2);
      first = Math.max(first, 1);
      first = Math.min(first, this.data.totalPages - numShown + 1);
      return [...Array(numShown)].map((k, i) => i + first);
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination-wrapper {
  margin-top: 40px;
}

.pages,
.navigation,
.mobile-navigation {
  display: flex;
  gap: 4px;
}

.mobile-navigation {
  a {
    padding: 0;
  }
}

.navigation {
  display: none;

  a {
    font-size: 20px;
  }
}

.navigation,
.mobile-navigation {
  a {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  a.btn {
    &:hover {
      background: $primary;
    }
  }
}

.pages {
  margin-top: 10px;
  display: none;
}

.random {
  min-width: 60px;
  width: auto;
  padding: 0 10px;

  svg {
    width: 45px;
    height: 45px;
  }
}

a {
  width: 100%;
  padding: 10px 0;
  text-decoration: none;
  text-align: center;
  border-radius: 2px;

  span {
    z-index: 111;
  }

  &.btn {
    background: $dark;
  }

  &.disabled {
    cursor: auto;
    pointer-events: none;
    background: rgba($color: $gray, $alpha: 0.2);

    &.red {
      background: $primary;
    }
  }
}

svg {
  width: 40px;
  height: 40px;
}

@media (min-width: 768px) {
  .navigation {
    display: flex;
  }

  .mobile-navigation {
    display: none;
  }

  .pages {
    display: flex;
  }
}
</style>