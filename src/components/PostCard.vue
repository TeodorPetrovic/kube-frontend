<template>
  <article class="post-card">
    <router-link :to="`/post/${post.slug}`" class="post-link">
      <div v-if="post.featuredImage" class="post-image">
        <img :src="post.featuredImage" :alt="post.title" />
      </div>
      <div class="post-content">
        <h2 class="post-title">{{ post.title }}</h2>
        <div class="post-meta">
          <span class="post-date">{{ formatDate(post.publishedAt || post.createdAt) }}</span>
          <span v-if="post.categories && post.categories.length > 0" class="post-category">
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
        <p class="post-excerpt">{{ post.excerpt || truncateContent(post.content) }}</p>
        <div v-if="post.tags && post.tags.length > 0" class="post-tags">
          <router-link 
            v-for="tag in post.tags" 
            :key="tag.id"
            :to="`/tag/${tag.id}`"
            class="tag"
          >
            #{{ tag.name }}
          </router-link>
        </div>
      </div>
    </router-link>
  </article>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const truncateContent = (content) => {
  if (!content) return '';
  const plainText = content.replace(/<[^>]*>/g, '');
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
};
</script>

<style scoped>
.post-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.post-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
}

.post-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  color: #333;
}

.post-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
}

.post-date {
  display: flex;
  align-items: center;
}

.post-category {
  display: flex;
  align-items: center;
}

.category-link {
  color: #007bff;
  text-decoration: none;
}

.category-link:hover {
  text-decoration: underline;
}

.post-excerpt {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
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
</style>
