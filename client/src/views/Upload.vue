<template>
  <form @submit.prevent="submit">
    <Spinner size="100" v-if="isLoading" />
    <h3>Dodaj mema</h3>
    <input type="text" name="title" v-model="title" placeholder="Tytuł" />

    <span class="error" v-if="error.title">
      {{ error.title }}
    </span>

    <input
      type="file"
      ref="file"
      accept="image/jpeg, image/jpg, image/png, image/gif"
      @change="setFile($event)"
    />
    <span class="error" v-if="error.file">{{ error.file }}</span>

    <textarea
      type="text"
      name="description"
      v-model="description"
      placeholder="Opis (opcjonalnie)"
    >
    </textarea>
    <span class="error" v-if="error.description">
      {{ error.description }}
    </span>

    <span class="description-limit">
      Znaki: {{ description.length }} / 4000
    </span>

    <div class="for-adults">
      <button
        @click.prevent="isForAdults = !isForAdults"
        :class="isForAdults ? 'active' : ''"
      >
        +18
      </button>
      <span>Treść dla dorosłych</span>
    </div>

    <div class="category-header">
      Wybierz kategorię <span>(opcjonalnie)</span>
    </div>
    <div class="categories">
      <button
        v-for="cat in getCategories.categories"
        :key="cat.id"
        @click.prevent="changeCategory(cat.id)"
        :class="category == cat.id ? 'active' : ''"
      >
        {{ cat.name }}
      </button>
    </div>

    <div class="category-header">Wybierz dział <span>(opcjonalnie)</span></div>
    <div class="categories">
      <button
        v-for="cat in getCategories.closeCategories"
        :key="cat.id"
        @click.prevent="changeCategory(cat.id)"
        :class="category == cat.id ? 'active' : ''"
      >
        {{ cat.name }}
      </button>
    </div>

    <span class="error" v-if="error.categories">
      {{ error.categories }}
    </span>

    <div class="tags-header">Tagi <span>(opcjonalnie)</span></div>
    <div class="tags">
      <div v-for="tag in tagList" :key="tag">
        <button v-if="findTag(tag)" @click.prevent="addTag(tag)">
          #{{ tag }}
        </button>
      </div>
    </div>

    <input
      type="text"
      name="tag"
      v-model="tagInput"
      placeholder="Aby dodać swój tag naciśnij enter lub tab"
      @keydown="addCustomTag($event)"
    />

    <div class="selected-tags">
      <div v-for="tag in tags" :key="tag">
        #{{ tag }}
        <button @click.prevent="deleteTag(tag)"><CloseIcon /></button>
      </div>
    </div>

    <div class="errors-list" v-if="error.tags?.length">
      <span class="error" v-for="err in error.tags" :key="err.id">
        {{ err.message }}
      </span>
    </div>

    <span class="error" v-if="error.form">{{ error.form }}</span>

    <div class="action">
      <button class="btn" type="reset" @click.prevent="resetForm">Reset</button>
      <button class="btn" type="submit">Dodaj</button>
    </div>
  </form>
</template>

<script>
import CloseIcon from "../svg/Close.vue";
import Spinner from "../components/Spinner.vue";
import { mapGetters } from "vuex";
import { useToast } from "vue-toastification";

const toast = useToast();

export default {
  name: "Upload",
  components: {
    CloseIcon,
    Spinner,
  },
  watch: {
    getToken() {
      if (!this.getToken) this.$router.push("/");
    },
  },
  data() {
    return {
      title: "",
      description: "",
      file: null,
      category: null,
      isForAdults: false,
      tags: [],
      tagInput: "",
      error: {},
      isLoading: false,
      tagList: ["humor", "meme", "pytanie", "news", "dowcipy", "sport"],
    };
  },
  computed: {
    ...mapGetters(["getToken", "getCategories"]),
  },
  methods: {
    async submit() {
      this.isLoading = true;
      this.error = {};
      let formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          title: this.title,
          isForAdults: this.isForAdults,
          description: this.description,
          category: this.category,
          tags: this.tags,
        })
      );

      if (this.file) {
        const img = this.file;
        formData.append("image", img);
      }

      fetch(`/api/meme/upload`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
        body: formData,
      })
        .then((e) => e.json())
        .then((e) => {
          if (e.auth == false) {
            this.logout();
            this.$router.push({ name: "HomePage" });
            return;
          }
          if (e.error) {
            this.error = e.error;
            return;
          }

          toast.success("Dodano mema!");
          this.resetForm();
        })
        .catch((err) => {
          console.log(err);
          this.error.form = "Coś poszło nie tak spróbuj ponownie!";
        })
        .finally(() => (this.isLoading = false));
    },
    changeCategory(cat) {
      if (this.category == cat) this.category = null;
      this.category = cat;
    },
    addTag(tag) {
      const findTag = this.tags.find((e) => e == tag);
      if (!findTag && this.tags.length < 5) this.tags = [...this.tags, tag];
    },
    addCustomTag(e) {
      // tab or enter
      if (e.keyCode == 9 || e.keyCode == 13) {
        e.preventDefault();
        if (this.tags.length < 5) {
          const input = this.tagInput.replace(/\s+/g, "");
          if (input.length >= 3) {
            this.addTag(input);
            this.tagInput = "";
          }
        }
      }
    },
    deleteTag(tag) {
      this.tags = this.tags.filter((e) => e != tag);
    },
    findTag(tag) {
      const find = this.tags.find((e) => e == tag);

      return !find;
    },
    setFile(e) {
      const file = e.target.files[0];
      if (file) {
        this.file = file;
      } else {
        e.target.value = null;
        this.file = null;
      }
    },
    resetForm() {
      this.title = "";
      this.description = "";
      this.file = null;
      this.category = null;
      this.isForAdults = false;
      this.tags = [];
      this.tagInput = "";
      this.error = {};
      this.$refs.file.value = null;
    },
  },
};
</script>

<style lang="scss" scoped>
form {
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  position: relative;

  button {
    padding: 4px 8px;
    border-radius: 2px;
    background: $gray;
    cursor: pointer;

    &.active {
      background: $primary;
    }
  }

  .tags,
  .categories {
    button {
      margin: 0 4px 4px 0;
    }
  }

  .img {
    display: flex;
    flex-direction: column;
    position: relative;

    input {
      border: 1px dashed $primary;
      border-radius: 2px;
    }
  }

  textarea {
    resize: none;
    height: 100px;
    font-family: sans-serif;
  }

  .description-limit {
    margin-top: 4px;
    font-size: 13px;
    margin-left: auto;
  }

  .for-adults {
    font-size: 14px;
    display: flex;
    align-items: center;

    button {
      margin-right: 8px;
    }
  }

  .category-header,
  .tags-header {
    font-size: 14px;
    margin-top: 8px;

    span {
      color: $gray;
    }
  }

  .categories {
    margin-top: 4px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 4px;

    button {
      background: $gray-dark;
    }
  }

  input[name="tag"] {
    margin-top: 4px;
  }

  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    margin-top: 8px;

    div {
      background: $gray-dark;
      padding: 4px;
      margin: 0 4px 4px 0;
      display: flex;
      align-items: center;
      font-size: 14px;
      border-radius: 2px;

      button {
        background: $primary;
        padding: 0;
        margin: 0 0 0 4px;
        display: flex;
        align-items: center;
        padding: 1px;

        svg {
          fill: black;
        }
      }
    }
  }
  .action {
    display: flex;
    margin-top: 4px;

    button {
      padding: 8px 16px;
    }

    button:nth-child(1) {
      margin-right: 8px;
      flex-shrink: 0;
      background: $gray;

      &:hover {
        background: rgba($color: $gray, $alpha: 0.6);
      }
    }

    button:nth-child(2) {
      width: 100%;
    }
  }
}
</style>