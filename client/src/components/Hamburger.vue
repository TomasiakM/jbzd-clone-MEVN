<template>
  <button
    @click="$emit('clickHandler')"
    :class="['hamburger', isOpen ? 'open' : '']"
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
</template>

<script>
export default {
  name: "Hamburger",
  props: ["isOpen"],
};
</script>

<style lang="scss" scoped>
.hamburger {
  border: none;
  background: transparent;
  width: 40px;
  height: 40px;
  position: relative;
  margin-right: 10px;
  cursor: pointer;

  span {
    display: block;
    width: 30px;
    height: 3px;
    border-radius: 4px;
    margin: 5px auto;
    transition: all 0.1s ease-in-out;
    background-color: white;
  }

  &.open span {
    &:nth-child(1) {
      transform: translateY(8px) rotate(45deg);
    }

    &:nth-child(2) {
      transform: translateX(40px);
      opacity: 0;
    }

    &:nth-child(3) {
      transform: translateY(-8px) rotate(-45deg);
    }
  }
}

@media (min-width: 1000px) {
  .hamburger {
    display: none;
  }
}
</style>