<script setup>
defineProps({
  items: Array
})
</script>

<template>
  <ul class="check-list">
    <li v-for="(item, index) in items" :key="index">
      <span class="check-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      <span>{{ item }}</span>
    </li>
  </ul>
</template>

<style scoped>
.check-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.check-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
}

.check-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.check-icon svg {
  width: 12px;
  height: 12px;
  color: white;
}
</style>
