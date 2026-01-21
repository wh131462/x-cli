<script setup>
defineProps({
  name: String,
  size: {
    type: String,
    default: '1.2em'
  },
  color: {
    type: String,
    default: 'currentColor'
  }
})
</script>

<template>
  <img
    :src="`/x-cli/icons/${name}.svg`"
    :style="{
      width: size,
      height: size,
      display: 'inline-block',
      verticalAlign: 'middle',
      filter: color !== 'currentColor' ? undefined : 'var(--icon-filter)'
    }"
    :alt="name"
  />
</template>

<style>
:root {
  --icon-filter: none;
}

.dark {
  --icon-filter: invert(1);
}
</style>
