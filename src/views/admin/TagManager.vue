<template>
  <div class="admin-tags">
    <div class="container">
      <div class="header">
        <h1>Manage Tags</h1>
        <router-link to="/admin" class="btn btn-secondary">← Back to Dashboard</router-link>
      </div>
      
      <div class="content-grid">
        <div class="form-section">
          <h2>{{ editingTag ? 'Edit Tag' : 'Add New Tag' }}</h2>
          <form @submit.prevent="saveTag" class="tag-form">
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
            
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? 'Saving...' : (editingTag ? 'Update' : 'Create') }}
              </button>
              <button v-if="editingTag" type="button" @click="cancelEdit" class="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
        
        <div class="list-section">
          <h2>Tags</h2>
          <LoadingSpinner v-if="loading" />
          
          <div v-else-if="loadError" class="error">
            {{ loadError }}
          </div>
          
          <div v-else-if="tags.length === 0" class="no-data">
            No tags yet.
          </div>
          
          <div v-else class="tags-list">
            <div v-for="tag in tags" :key="tag.id" class="tag-item">
              <div class="tag-info">
                <h3>#{{ tag.name }}</h3>
                <p class="slug">{{ tag.slug }}</p>
                <p class="posts-count">{{ tag.posts?.length || 0 }} posts</p>
              </div>
              <div class="tag-actions">
                <button @click="editTag(tag)" class="btn-small btn-edit">Edit</button>
                <button @click="deleteTag(tag.id)" class="btn-small btn-delete">Delete</button>
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
import tagsAPI from '../../api/tags';

const tags = ref([]);
const loading = ref(true);
const loadError = ref('');
const submitting = ref(false);
const error = ref('');
const editingTag = ref(null);

const form = ref({
  name: '',
  slug: '',
});

const loadTags = async () => {
  loading.value = true;
  loadError.value = '';
  try {
    const response = await tagsAPI.getAll();
    tags.value = response.data.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    loadError.value = 'Failed to load tags.';
    console.error('Error loading tags:', err);
  } finally {
    loading.value = false;
  }
};

const saveTag = async () => {
  error.value = '';
  submitting.value = true;
  
  try {
    const tagData = {
      name: form.value.name,
      slug: form.value.slug,
    };
    
    if (editingTag.value) {
      await tagsAPI.update(editingTag.value.id, tagData);
    } else {
      await tagsAPI.create(tagData);
    }
    
    form.value = { name: '', slug: '' };
    editingTag.value = null;
    await loadTags();
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save tag.';
    console.error('Error saving tag:', err);
  } finally {
    submitting.value = false;
  }
};

const editTag = (tag) => {
  editingTag.value = tag;
  form.value = {
    name: tag.name,
    slug: tag.slug,
  };
};

const cancelEdit = () => {
  editingTag.value = null;
  form.value = { name: '', slug: '' };
  error.value = '';
};

const deleteTag = async (id) => {
  if (!confirm('Are you sure you want to delete this tag?')) {
    return;
  }
  
  try {
    await tagsAPI.delete(id);
    tags.value = tags.value.filter(t => t.id !== id);
  } catch (err) {
    alert('Failed to delete tag: ' + (err.response?.data?.message || err.message));
    console.error('Error deleting tag:', err);
  }
};

onMounted(() => {
  loadTags();
});
</script>

<style scoped>
.admin-tags {
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus {
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

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tag-item {
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  transition: background 0.3s;
}

.tag-item:hover {
  background: #f8f9fa;
}

.tag-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  color: #007bff;
}

.tag-info .slug {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.875rem;
  font-family: monospace;
}

.tag-info .posts-count {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
}

.tag-actions {
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
  
  .tag-item {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
