<template>
  <div>
    <div class="admin-action" v-if="isAdmin">
      <button
        @click="addOnMainPage"
        :class="[
          'btn',
          ((data.category && data.category.isForAuthUsers) ||
            data.isOnMainPage) &&
            'disabled',
        ]"
      >
        Dodaj na główną
      </button>
      <button class="btn" @click="deleteMeme">Usuń</button>
    </div>
    <div class="action">
      <button class="btn dark spam" @click="spam">
        <FlagIcon />
      </button>
      <button
        :class="['btn dark favorite', isFavorite && 'active']"
        @click="favorite()"
      >
        <StarIcon />
      </button>
      <button :class="['btn like', isLiked && 'active']" @click="upVote">
        +{{ upVotes }}
      </button>
    </div>
  </div>
</template>

<script>
import StarIcon from "../svg/Star.vue";
import FlagIcon from "../svg/Flag.vue";
import { useToast } from "vue-toastification";
import { mapActions, mapGetters } from "vuex";

const toast = useToast();

export default {
  name: "MemeAction",
  props: ["data"],
  data() {
    return {
      isLiked: this.data.isLiked,
      isFavorite: this.data.isFavorite,
      upVotes: this.data.upVotes,
    };
  },
  components: {
    StarIcon,
    FlagIcon,
  },
  methods: {
    ...mapActions(["logout"]),
    upVote() {
      if (!this.isAuthenticated) {
        return toast.error("Nie jesteś zalogowany!");
      }

      fetch(`/api/meme/action/like/${this.data._id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.auth == false) this.logout();
          if (e.success) {
            this.isLiked = e.isLiked;
            this.upVotes = e.upVotes;
          }
        });
    },
    spam() {
      toast("¯\\_( ͡° ͜ʖ ͡°)_/¯");
    },
    favorite() {
      if (!this.isAuthenticated) return toast.error("Nie jesteś zalogowany!");

      fetch(`/api/meme/action/favorite/${this.data._id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.auth == false) this.logout();
          if (e.success) {
            this.isFavorite = e.isFavorite;
          }
        });
    },
    addOnMainPage() {
      fetch(`/api/admin/addToMainPage/${this.data._id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.auth == false) this.logout();
          if (e.error) {
            toast.error(e.error);
          }
          if (e.success) {
            toast.success(e.message);
          }
        });
    },
    deleteMeme() {
      fetch(`/api/admin/meme/${this.data._id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.auth == false) this.logout();
          if (e.error) {
            toast.error(e.error);
          }
          if (e.success) {
            toast.success(e.message);
          }
        });
    },
  },
  computed: {
    ...mapGetters(["getToken", "isAuthenticated", "isAdmin"]),
  },
};
</script>


<style lang="scss" scoped>
.action,
.admin-action {
  display: flex;
  margin-top: 4px;
  gap: 4px;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    border: none;
    color: white;
    font-size: 20px;
    border-radius: 2px;
    cursor: pointer;
  }
}

.action button {
  height: 35px;

  &.favorite {
    svg {
      fill: white;
      width: 26px;
      height: 26px;
    }

    &.active {
      background: $yellow;
    }
  }

  &.like.btn {
    width: 100%;

    &.active {
      background: $green;
    }
  }
}

.admin-action button {
  width: 100%;
  font-size: 14px;
  padding: 8px 0;

  &.disabled {
    pointer-events: none;
    background: $gray;
  }
}

@media (min-width: 350px) {
  .action button {
    min-width: 50px;
    height: 40px;
    font-size: 22px;
  }
}
</style>