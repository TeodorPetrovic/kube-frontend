<template>
  <div class="tag-posts">
    <div class="container">
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <router-link to="/blog" class="btn">Back to Blog</router-link>
      </div>
      
      <div v-else>
        <header class="page-header">
          <h1>#{{ tag?.name || 'Tag' }}</h1>
        </header>
        
        <div v-if="tagPosts.length === 0" class="no-posts">
          <p>No posts with this tag yet.</p>
        </div>
        
        <div v-else class="posts-grid">
          <PostCard v-for="post in tagPosts" :key="post.id" :post="post" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import PostCard from '../components/PostCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import tagsAPI from '../api/tags';

const route = useRoute();
const tag = ref(null);
const loading = ref(true);
const error = ref('');

const tagPosts = computed(() => {
  if (!tag.value?.posts) return [];
  return tag.value.posts
    .filter(post => post.isPublished)
    .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
});

onMounted(async () => {
  try {
    const response = await tagsAPI.getById(route.params.id);
    tag.value = response.data;
  } catch (err) {
    error.value = 'Tag not found.';
    console.error('Error loading tag:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #007bff;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
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

.no-posts {
  padding: 3rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
