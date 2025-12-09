<template>
  <div class="static-page">
    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="container">
      <div class="error">
        <p>{{ error }}</p>
        <router-link to="/" class="btn">Back to Home</router-link>
      </div>
    </div>
    
    <article v-else-if="page" class="container">
      <header class="page-header">
        <h1>{{ page.title }}</h1>
      </header>
      
      <div class="page-content" v-html="sanitizeHtml(page.content)"></div>
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import pagesAPI from '../api/pages';
import { sanitizeHtml } from '../utils/sanitize';

const route = useRoute();
const page = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const response = await pagesAPI.getBySlug(route.params.slug);
    page.value = response.data;
    
    if (!page.value.isPublished) {
      error.value = 'This page is not available.';
    }
  } catch (err) {
    error.value = 'Page not found.';
    console.error('Error loading page:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 20px;
}

.error {
  padding: 2rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  text-align: center;
}

.error .btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2.5rem;
  line-height: 1.2;
}

.page-content {
  line-height: 1.8;
  color: #333;
}

.page-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.page-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
}

.page-content :deep(p) {
  margin-bottom: 1rem;
}

.page-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.page-content :deep(a) {
  color: #007bff;
  text-decoration: none;
}

.page-content :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
}
</style>
