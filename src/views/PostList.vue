<template>
  <div class="post-list">
    <div class="container">
      <h1>Blog Posts</h1>
      
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <div v-else-if="publishedPosts.length === 0" class="no-posts">
        <p>No posts available yet.</p>
      </div>
      
      <div v-else class="posts-grid">
        <PostCard v-for="post in publishedPosts" :key="post.id" :post="post" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import PostCard from '../components/PostCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import postsAPI from '../api/posts';

const posts = ref([]);
const loading = ref(true);
const error = ref('');

const publishedPosts = computed(() => {
  return posts.value
    .filter(post => post.isPublished)
    .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
});

onMounted(async () => {
  try {
    const response = await postsAPI.getAll();
    posts.value = response.data;
  } catch (err) {
    error.value = 'Failed to load posts. Please try again later.';
    console.error('Error loading posts:', err);
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

h1 {
  margin-bottom: 2rem;
  font-size: 2.5rem;
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

.no-posts {
  padding: 3rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #666;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
