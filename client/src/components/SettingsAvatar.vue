<template>
  <div class="avatar-wrapper">
    <Spinner v-if="isLoading" size="60" />
    <div for="image" class="image">
      <vue-cropper
        ref="cropper"
        :src="`/api/image/${getUserData.image}`"
        preview=".preview"
        :style="{ maxWidth: '100%' }"
        :autoCropArea="1"
        :aspect-ratio="1"
        :viewMode="1"
        :movable="false"
        :zoomable="false"
        :background="false"
      />
    </div>
    <div class="image-text">
      <div v-if="image.file">Wybrany plik: {{ image.file.name }}</div>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
    <div class="preview-section">
      <p>Podgląd:</p>
      <div class="preview"></div>
    </div>
    <div class="btns">
      <input
        type="file"
        id="image"
        name="image"
        accept="image/jpeg,image/png"
        @change="handleChange"
        :style="{ display: 'none' }"
      />
      <label for="image">
        <button class="btn gray">Wybierz zdjęcie</button>
      </label>
      <button class="btn" @click="uploadImage">Zapisz</button>
    </div>
  </div>
</template>

<script>
import VueCropper from "vue-cropperjs";
import Spinner from "./Spinner.vue";
import "cropperjs/dist/cropper.css";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "SettingsAvatar",
  data() {
    return {
      image: {
        file: null,
        url: null,
      },
      error: null,
      isLoading: false,
    };
  },
  components: {
    VueCropper,
    Spinner,
  },
  methods: {
    ...mapActions(["setImage", "logout"]),
    handleChange(e) {
      this.error = null;
      const image = e.target.files[0];
      if (image) {
        const acceptedImages = ["image/jpeg", "image/png"];
        if (acceptedImages.includes(image.type)) {
          this.image = {
            file: image,
            url: URL.createObjectURL(image),
          };
          this.$refs.cropper.replace(this.image.url);
        } else {
          this.image = {
            file: image,
            url: null,
          };
          this.$refs.cropper.replace(
            `/api/storage/profilePic/${this.getUserData.image}`
          );
          this.error =
            "Dozwolone są jedynie pliki z rozszerzeniem: .jpg, .jpeg, .png!";
        }
      } else {
        this.image = { image: null, url: null };
        this.$refs.cropper.replace(
          `/api/storage/profilePic/${this.getUserData.image}`
        );
      }
    },
    uploadImage() {
      if (this.error) return;
      this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
        this.isLoading = true;

        const formData = new FormData();

        formData.append("image", blob);
        fetch("/api/user/image", {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + this.getToken,
          },
          body: formData,
        })
          .then((e) => e.json())
          .then((e) => {
            console.log(e);
            if (e.auth === false) {
              this.logout();
              this.$router.push("/");
            }
            if (e.error) this.error = e.error;
            if (e.image) this.setImage(e.image);
          })
          .finally(() => (this.isLoading = false));
      });
    },
  },
  computed: {
    ...mapGetters(["getUserData", "getToken"]),
  },
};
</script>

<style lang="scss" scoped>
.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image {
  max-width: 300px;

  & > input[type="file"] {
    display: none;
  }
}

.image-text {
  text-align: center;
  max-width: 100%;
  word-wrap: break-word;
  margin-top: 8px;
  font-size: 14px;
}

.btns {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 8px;
}

label {
  cursor: pointer;
  button {
    pointer-events: none;
  }
}

button {
  padding: 8px 0;
  width: 150px;
  border-radius: 2px;
}

.preview-section {
  margin: 8px 0;

  p {
    font-size: 14px;
    text-align: center;
    margin-bottom: 4px;
  }
}

.preview {
  width: 120px;
  height: 120px;
  overflow: hidden;
}

.error {
  color: $primary;
}
</style>