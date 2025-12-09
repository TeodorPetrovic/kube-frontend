<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} My Blog. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.footer {
  background: #333;
  color: #fff;
  margin-top: auto;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  text-align: center;
}

.footer-content p {
  margin: 0;
}
</style>
