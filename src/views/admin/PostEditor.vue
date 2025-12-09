<template>
  <div class="admin-post-editor">
    <div class="container">
      <div class="header">
        <h1>{{ isEdit ? 'Edit Post' : 'New Post' }}</h1>
        <router-link to="/admin/posts" class="btn btn-secondary">← Back to Posts</router-link>
      </div>
      
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="loadError" class="error">
        <p>{{ loadError }}</p>
      </div>
      
      <form v-else @submit.prevent="savePost" class="post-form">
        <div class="form-row">
          <div class="form-group">
            <label for="title">Title *</label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              required
              :disabled="submitting"
              @input="generateSlug"
            />
          </div>
          
          <div class="form-group">
            <label for="slug">Slug *</label>
            <input
              id="slug"
              v-model="form.slug"
              type="text"
              required
              :disabled="submitting"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            v-model="form.excerpt"
            rows="3"
            :disabled="submitting"
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="content">Content *</label>
          <textarea
            id="content"
            v-model="form.content"
            rows="15"
            required
            :disabled="submitting"
          ></textarea>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="featuredImage">Featured Image URL</label>
            <input
              id="featuredImage"
              v-model="form.featuredImage"
              type="url"
              :disabled="submitting"
            />
          </div>
          
          <div class="form-group">
            <label for="publishedAt">Published Date</label>
            <input
              id="publishedAt"
              v-model="form.publishedAt"
              type="datetime-local"
              :disabled="submitting"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="metaTitle">Meta Title (SEO)</label>
            <input
              id="metaTitle"
              v-model="form.metaTitle"
              type="text"
              :disabled="submitting"
            />
          </div>
          
          <div class="form-group">
            <label for="metaDescription">Meta Description (SEO)</label>
            <input
              id="metaDescription"
              v-model="form.metaDescription"
              type="text"
              :disabled="submitting"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="categories">Categories</label>
            <select
              id="categories"
              v-model="form.categoryIds"
              multiple
              :disabled="submitting"
            >
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <small>Hold Ctrl/Cmd to select multiple</small>
          </div>
          
          <div class="form-group">
            <label for="tags">Tags</label>
            <select
              id="tags"
              v-model="form.tagIds"
              multiple
              :disabled="submitting"
            >
              <option v-for="tag in tags" :key="tag.id" :value="tag.id">
                {{ tag.name }}
              </option>
            </select>
            <small>Hold Ctrl/Cmd to select multiple</small>
          </div>
        </div>
        
        <div class="form-group checkbox-group">
          <label>
            <input
              v-model="form.isPublished"
              type="checkbox"
              :disabled="submitting"
            />
            <span>Published</span>
          </label>
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Saving...' : 'Save Post' }}
          </button>
          <router-link to="/admin/posts" class="btn btn-secondary">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import postsAPI from '../../api/posts';
import categoriesAPI from '../../api/categories';
import tagsAPI from '../../api/tags';

const route = useRoute();
const router = useRouter();

const isEdit = computed(() => !!route.params.id);
const postId = computed(() => route.params.id);

const form = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  publishedAt: '',
  metaTitle: '',
  metaDescription: '',
  categoryIds: [],
  tagIds: [],
  isPublished: false,
});

const categories = ref([]);
const tags = ref([]);
const loading = ref(true);
const loadError = ref('');
const submitting = ref(false);
const error = ref('');
const slugGenerated = ref(false);

const generateSlug = () => {
  if (!isEdit.value && !slugGenerated.value) {
    form.value.slug = form.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
};

const loadData = async () => {
  loading.value = true;
  loadError.value = '';
  
  try {
    const [categoriesRes, tagsRes] = await Promise.all([
      categoriesAPI.getAll(),
      tagsAPI.getAll(),
    ]);
    
    categories.value = categoriesRes.data;
    tags.value = tagsRes.data;
    
    if (isEdit.value) {
      const postRes = await postsAPI.getById(postId.value);
      const post = postRes.data;
      
      form.value = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        content: post.content,
        featuredImage: post.featuredImage || '',
        publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
        metaTitle: post.metaTitle || '',
        metaDescription: post.metaDescription || '',
        categoryIds: post.categories?.map(c => c.id) || [],
        tagIds: post.tags?.map(t => t.id) || [],
        isPublished: post.isPublished,
      };
      slugGenerated.value = true;
    }
  } catch (err) {
    loadError.value = 'Failed to load data. Please try again.';
    console.error('Error loading data:', err);
  } finally {
    loading.value = false;
  }
};

const savePost = async () => {
  error.value = '';
  submitting.value = true;
  
  try {
    const postData = {
      title: form.value.title,
      slug: form.value.slug,
      excerpt: form.value.excerpt || null,
      content: form.value.content,
      featuredImage: form.value.featuredImage || null,
      publishedAt: form.value.publishedAt || null,
      metaTitle: form.value.metaTitle || null,
      metaDescription: form.value.metaDescription || null,
      categoryIds: form.value.categoryIds,
      tagIds: form.value.tagIds,
      isPublished: form.value.isPublished,
    };
    
    if (isEdit.value) {
      await postsAPI.update(postId.value, postData);
    } else {
      await postsAPI.create(postData);
    }
    
    router.push('/admin/posts');
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save post. Please try again.';
    console.error('Error saving post:', err);
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.admin-post-editor {
  padding: 2rem 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  margin: 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s;
  border: none;
  cursor: pointer;
  display: inline-block;
}

.btn-primary {
  background: #007bff;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: #fff;
}

.btn-secondary:hover {
  background: #545b62;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.post-form {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input:disabled,
.form-group textarea:disabled,
.form-group select:disabled {
  background: #e9ecef;
  cursor: not-allowed;
}

.form-group select[multiple] {
  height: 150px;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.875rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
}

.error {
  padding: 2rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  text-align: center;
}

.error-message {
  padding: 0.75rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
