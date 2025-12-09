<template>
  <div class="admin-categories">
    <div class="container">
      <div class="header">
        <h1>Manage Categories</h1>
        <router-link to="/admin" class="btn btn-secondary">← Back to Dashboard</router-link>
      </div>
      
      <div class="content-grid">
        <div class="form-section">
          <h2>{{ editingCategory ? 'Edit Category' : 'Add New Category' }}</h2>
          <form @submit.prevent="saveCategory" class="category-form">
            <div class="form-group">
              <label for="name">Name *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                :disabled="submitting"
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
            
            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                v-model="form.description"
                rows="4"
                :disabled="submitting"
              ></textarea>
            </div>
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? 'Saving...' : (editingCategory ? 'Update' : 'Create') }}
              </button>
              <button v-if="editingCategory" type="button" @click="cancelEdit" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
        
        <div class="list-section">
          <h2>Categories</h2>
          <LoadingSpinner v-if="loading" />
          
          <div v-else-if="loadError" class="error">
            {{ loadError }}
          </div>
          
          <div v-else-if="categories.length === 0" class="no-data">
            No categories yet.
          </div>
          
          <div v-else class="categories-list">
            <div v-for="category in categories" :key="category.id" class="category-item">
              <div class="category-info">
                <h3>{{ category.name }}</h3>
                <p class="slug">{{ category.slug }}</p>
                <p v-if="category.description" class="description">{{ category.description }}</p>
                <p class="posts-count">{{ category.posts?.length || 0 }} posts</p>
              </div>
              <div class="category-actions">
                <button @click="editCategory(category)" class="btn-small btn-edit">Edit</button>
                <button @click="deleteCategory(category.id)" class="btn-small btn-delete">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import categoriesAPI from '../../api/categories';

const categories = ref([]);
const loading = ref(true);
const loadError = ref('');
const submitting = ref(false);
const error = ref('');
const editingCategory = ref(null);

const form = ref({
  name: '',
  slug: '',
  description: '',
});

const loadCategories = async () => {
  loading.value = true;
  loadError.value = '';
  try {
    const response = await categoriesAPI.getAll();
    categories.value = response.data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    loadError.value = 'Failed to load categories.';
    console.error('Error loading categories:', err);
  } finally {
    loading.value = false;
  }
};

const saveCategory = async () => {
  error.value = '';
  submitting.value = true;
  
  try {
    const categoryData = {
      name: form.value.name,
      slug: form.value.slug,
      description: form.value.description || null,
    };
    
    if (editingCategory.value) {
      await categoriesAPI.update(editingCategory.value.id, categoryData);
    } else {
      await categoriesAPI.create(categoryData);
    }
    
    form.value = { name: '', slug: '', description: '' };
    editingCategory.value = null;
    await loadCategories();
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save category.';
    console.error('Error saving category:', err);
  } finally {
    submitting.value = false;
  }
};

const editCategory = (category) => {
  editingCategory.value = category;
  form.value = {
    name: category.name,
    slug: category.slug,
    description: category.description || '',
  };
};

const cancelEdit = () => {
  editingCategory.value = null;
  form.value = { name: '', slug: '', description: '' };
  error.value = '';
};

const deleteCategory = async (id) => {
  if (!confirm('Are you sure you want to delete this category?')) {
    return;
  }
  
  try {
    await categoriesAPI.delete(id);
    categories.value = categories.value.filter(c => c.id !== id);
  } catch (err) {
    alert('Failed to delete category: ' + (err.response?.data?.message || err.message));
    console.error('Error deleting category:', err);
  }
};

onMounted(() => {
  loadCategories();
});
</script>

<style scoped>
.admin-categories {
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
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

.content-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
}

.form-section,
.list-section {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-section h2,
.list-section h2 {
  margin-top: 0;
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
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #007bff;
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

.form-actions {
  display: flex;
  gap: 1rem;
}

.error-message {
  padding: 0.75rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.error {
  padding: 2rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  text-align: center;
}

.no-data {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: background 0.3s;
}

.category-item:hover {
  background: #f8f9fa;
}

.category-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.category-info .slug {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.875rem;
  font-family: monospace;
}

.category-info .description {
  margin: 0 0 0.5rem 0;
  color: #555;
}

.category-info .posts-count {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-edit {
  background: #28a745;
  color: #fff;
}

.btn-edit:hover {
  background: #218838;
}

.btn-delete {
  background: #dc3545;
  color: #fff;
}

.btn-delete:hover {
  background: #c82333;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .category-item {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
