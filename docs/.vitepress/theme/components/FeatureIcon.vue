<script setup>
defineProps({
  icon: String,
  title: String,
  details: String
})
</script>

<template>
  <div class="feature-icon-card">
    <div class="icon-wrapper">
      <img :src="`/x-cli/icons/${icon}.svg`" :alt="title" class="feature-svg-icon" />
    </div>
    <h3>{{ title }}</h3>
    <p>{{ details }}</p>
  </div>
</template>

<style scoped>
.feature-icon-card {
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
}

.feature-icon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-svg-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
}

p {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
}
</style>
