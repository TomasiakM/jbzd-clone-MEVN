<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    aria-hidden="true"
    role="img"
    width="1em"
    height="1em"
    preserveAspectRatio="xMidYMid meet"
    viewBox="0 0 24 24"
  >
    <g :transform="type == 'left' ? 'rotate(-180 12 12)' : 'rotate(0 12 12)'">
      <path
        d="M11.293 17.293l1.414 1.414L19.414 12l-6.707-6.707l-1.414 1.414L15.586 11H6v2h9.586z"
        fill="currentColor"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: "Arrow",
  props: ["type"],
};
</script>