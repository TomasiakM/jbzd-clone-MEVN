<template>
  <div class="loader-wrapper">
    <div
      class="loader"
      :style="{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${size / 8}px`,
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "Spinner",
  props: ["size"],
};
</script>

<style lang="scss" scoped>
.loader-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba($color: #000000, $alpha: 0.4);
  z-index: 11;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loader {
  border: 1px solid rgba($color: #ffffff, $alpha: 0.6);
  border-top: 1px solid $primary;
  border-radius: 50%;
  animation: spin 1.3s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>