<template>
  <div class="loading">
    <div class="spinner"></div>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  message: {
    type: String,
    default: 'Loading...',
  },
});
</script>

<style scoped>
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading p {
  margin-top: 1rem;
  color: #666;
}
</style>
