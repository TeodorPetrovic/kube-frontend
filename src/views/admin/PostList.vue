<template>
  <div class="admin-posts">
    <div class="container">
      <div class="header">
        <h1>Manage Posts</h1>
        <div class="actions">
          <router-link to="/admin" class="btn btn-secondary">← Back to Dashboard</router-link>
          <router-link to="/admin/posts/new" class="btn btn-primary">+ New Post</router-link>
        </div>
      </div>
      
      <LoadingSpinner v-if="loading" />
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>
      
      <div v-else class="posts-table">
        <table v-if="posts.length > 0">
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Categories</th>
              <th>Published</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.title }}</td>
              <td>{{ post.slug }}</td>
              <td>
                <span :class="['status', post.isPublished ? 'published' : 'draft']">
                  {{ post.isPublished ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td>
                <span v-if="post.categories && post.categories.length > 0">
                  {{ post.categories.map(c => c.name).join(', ') }}
                </span>
                <span v-else class="text-muted">None</span>
              </td>
              <td>{{ formatDate(post.publishedAt || post.createdAt) }}</td>
              <td class="actions-cell">
                <router-link :to="`/admin/posts/edit/${post.id}`" class="btn-small btn-edit">Edit</router-link>
                <button @click="deletePost(post.id)" class="btn-small btn-delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="no-data">
          <p>No posts found. Create your first post!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import postsAPI from '../../api/posts';

const router = useRouter();
const posts = ref([]);
const loading = ref(true);
const error = ref('');

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const loadPosts = async () => {
  loading.value = true;
  error.value = '';
  try {
    const response = await postsAPI.getAll();
    posts.value = response.data.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (err) {
    error.value = 'Failed to load posts. Please try again.';
    console.error('Error loading posts:', err);
  } finally {
    loading.value = false;
  }
};

const deletePost = async (id) => {
  if (!confirm('Are you sure you want to delete this post?')) {
    return;
  }
  
  try {
    await postsAPI.delete(id);
    posts.value = posts.value.filter(p => p.id !== id);
  } catch (err) {
    alert('Failed to delete post: ' + (err.response?.data?.message || err.message));
    console.error('Error deleting post:', err);
  }
};

onMounted(() => {
  loadPosts();
});
</script>

<style scoped>
.admin-posts {
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
  flex-wrap: wrap;
  gap: 1rem;
}

.header h1 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: #fff;
}

.btn-secondary:hover {
  background: #545b62;
}

.posts-table {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8f9fa;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #dee2e6;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

tbody tr:hover {
  background: #f8f9fa;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status.published {
  background: #d4edda;
  color: #155724;
}

.status.draft {
  background: #fff3cd;
  color: #856404;
}

.text-muted {
  color: #6c757d;
}

.actions-cell {
  white-space: nowrap;
}

.btn-small {
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
  margin-right: 0.5rem;
  text-decoration: none;
  display: inline-block;
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

.error {
  padding: 2rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  text-align: center;
}

.no-data {
  padding: 3rem;
  text-align: center;
  color: #666;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.5rem;
  }
}
</style>
