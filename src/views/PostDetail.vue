<template>
  <div class="post-detail">
    <LoadingSpinner v-if="loading" />
    
    <div v-else-if="error" class="container">
      <div class="error">
        <p>{{ error }}</p>
        <router-link to="/blog" class="btn">Back to Blog</router-link>
      </div>
    </div>
    
    <article v-else-if="post" class="container">
      <header class="post-header">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <span class="post-date">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
          <span v-if="post.categories && post.categories.length > 0" class="post-categories">
            <router-link 
              v-for="(category, index) in post.categories" 
              :key="category.id"
              :to="`/category/${category.slug}`"
              class="category-link"
            >
              {{ category.name }}<span v-if="index < post.categories.length - 1">, </span>
            </router-link>
          </span>
        </div>
      </header>
      
      <div v-if="post.featuredImage" class="featured-image">
        <img :src="post.featuredImage" :alt="post.title" />
      </div>
      
      <div class="post-content" v-html="post.content"></div>
      
      <div v-if="post.tags && post.tags.length > 0" class="post-tags">
        <strong>Tags:</strong>
        <router-link 
          v-for="tag in post.tags" 
          :key="tag.id"
          :to="`/tag/${tag.id}`"
          class="tag"
        >
          #{{ tag.name }}
        </router-link>
      </div>
      
      <CommentsSection 
        v-if="post.id" 
        :post-id="post.id" 
        :comments="comments"
        @comment-added="loadComments"
      />
    </article>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import CommentsSection from '../components/CommentsSection.vue';
import postsAPI from '../api/posts';
import commentsAPI from '../api/comments';

const route = useRoute();
const post = ref(null);
const comments = ref([]);
const loading = ref(true);
const error = ref('');

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const loadComments = async () => {
  if (!post.value?.id) return;
  
  try {
    const response = await commentsAPI.getByPostId(post.value.id);
    comments.value = response.data;
  } catch (err) {
    console.error('Error loading comments:', err);
  }
};

onMounted(async () => {
  try {
    const response = await postsAPI.getBySlug(route.params.slug);
    post.value = response.data;
    
    if (!post.value.isPublished) {
      error.value = 'This post is not available.';
      return;
    }
    
    await loadComments();
  } catch (err) {
    error.value = 'Post not found.';
    console.error('Error loading post:', err);
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

.post-header {
  margin-bottom: 2rem;
}

.post-header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
  line-height: 1.2;
}

.post-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.post-categories {
  display: flex;
  gap: 0.5rem;
}

.category-link {
  color: #007bff;
  text-decoration: none;
}

.category-link:hover {
  text-decoration: underline;
}

.featured-image {
  margin-bottom: 2rem;
  border-radius: 8px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: auto;
  display: block;
}

.post-content {
  line-height: 1.8;
  color: #333;
  margin-bottom: 2rem;
}

.post-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.8rem;
}

.post-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.5rem;
}

.post-content :deep(p) {
  margin-bottom: 1rem;
}

.post-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.post-content :deep(a) {
  color: #007bff;
  text-decoration: none;
}

.post-content :deep(a:hover) {
  text-decoration: underline;
}

.post-content :deep(code) {
  background: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.post-content :deep(pre) {
  background: #f4f4f4;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  padding: 1.5rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
}

.post-tags strong {
  margin-right: 0.5rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #666;
  text-decoration: none;
  transition: background 0.3s;
}

.tag:hover {
  background: #007bff;
  color: #fff;
}

@media (max-width: 768px) {
  .post-header h1 {
    font-size: 2rem;
  }
  
  .post-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
