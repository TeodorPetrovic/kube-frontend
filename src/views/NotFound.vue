<template>
  <div class="not-found">
    <div class="container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <router-link to="/" class="btn">Go to Home</router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  padding: 2rem 20px;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #007bff;
}

h2 {
  font-size: 2rem;
  margin: 1rem 0;
  color: #333;
}

p {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: background 0.3s;
}

.btn:hover {
  background: #0056b3;
}
</style>
