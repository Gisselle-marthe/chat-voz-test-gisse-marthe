<template>
  <svg
    :width="size"
    :height="size * 0.857"
    viewBox="0 0 28 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :class="customClass"
  >
    <path
      d="M23 1H5C2.79086 1 1 2.79086 1 5V15C1 17.2091 2.79086 19 5 19H16L22 23V19H23C25.2091 19 27 17.2091 27 15V5C27 2.79086 25.2091 1 23 1Z"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 11C8 11.5523 7.55228 12 7 12C6.44772 12 6 11.5523 6 11C6 10.4477 6.44772 10 7 10C7.55228 10 8 10.4477 8 11Z"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M14 11C14 11.5523 13.5523 12 13 12C12.4477 12 12 11.5523 12 11C12 10.4477 12.4477 10 13 10C13.5523 10 14 10.4477 14 11Z"
      :stroke="color"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M20 11C20 11.5523 19.5523 12 19 12C18.4477 12 18 11.5523 18 11C18 10.4477 18.4477 10 19 10C19.5523 10 20 10.4477 20 11Z"
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
  size: 28,
  color: "#2E4454",
  customClass: "",
})
</script>
