<template>
  <div class="admin-dashboard">
    <div class="container">
      <h1>Admin Dashboard</h1>
      
      <div class="admin-nav">
        <router-link to="/admin/posts" class="admin-nav-item">
          <div class="icon">📝</div>
          <h3>Posts</h3>
          <p>Manage blog posts</p>
        </router-link>
        
        <router-link to="/admin/categories" class="admin-nav-item">
          <div class="icon">📁</div>
          <h3>Categories</h3>
          <p>Manage categories</p>
        </router-link>
        
        <router-link to="/admin/tags" class="admin-nav-item">
          <div class="icon">🏷️</div>
          <h3>Tags</h3>
          <p>Manage tags</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
}

.admin-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.admin-nav-item {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.admin-nav-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.admin-nav-item h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.admin-nav-item p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
</style>
