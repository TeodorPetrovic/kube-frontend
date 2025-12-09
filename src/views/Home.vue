<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <h1>Welcome to My Blog</h1>
        <p>Discover insightful articles, stories, and ideas</p>
      </div>
    </section>
    
    <div class="container">
      <section class="recent-posts">
        <h2>Recent Posts</h2>
        
        <LoadingSpinner v-if="loading" />
        
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
        </div>
        
        <div v-else-if="posts.length === 0" class="no-posts">
          <p>No posts available yet.</p>
        </div>
        
        <div v-else class="posts-grid">
          <PostCard v-for="post in recentPosts" :key="post.id" :post="post" />
        </div>
        
        <div v-if="posts.length > 6" class="view-all">
          <router-link to="/blog" class="btn">View All Posts</router-link>
        </div>
      </section>
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

const recentPosts = computed(() => {
  return posts.value
    .filter(post => post.isPublished)
    .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
    .slice(0, 6);
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
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 4rem 0;
  text-align: center;
  margin-bottom: 3rem;
}

.hero h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
}

.hero p {
  margin: 0;
  font-size: 1.25rem;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.recent-posts {
  margin-bottom: 3rem;
}

.recent-posts h2 {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
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

.view-all {
  text-align: center;
  margin-top: 2rem;
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

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .hero p {
    font-size: 1rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
