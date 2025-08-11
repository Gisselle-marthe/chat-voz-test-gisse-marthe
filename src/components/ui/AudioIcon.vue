<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 34 34"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="customClass"
  >
    <path
      d="M4.25 20.25V13.75C4.25 13.1978 4.69771 12.75 5.25 12.75H9.56589C9.79296 12.75 10.0133 12.6728 10.1906 12.5309L15.3753 8.38313C16.0301 7.85932 17 8.32549 17 9.164V24.8361C17 25.6746 16.0301 26.1408 15.3753 25.6169L10.1906 21.4692C10.0133 21.3273 9.79296 21.25 9.56589 21.25H5.25C4.69772 21.25 4.25 20.8023 4.25 20.25Z"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M22.4262 21.553C23.4366 20.3488 24.0178 18.8427 24.0782 17.2719C24.1385 15.701 23.6746 14.1548 22.7595 12.8766"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M26.7671 25.1955C28.6742 22.9227 29.729 20.0559 29.7497 17.089C29.7704 14.1221 28.7558 11.2409 26.8805 8.94163"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number
  color?: string
  customClass?: string
}

withDefaults(defineProps<Props>(), {
  size: 34,
  color: "#2E4454",
  customClass: "",
})
</script>
