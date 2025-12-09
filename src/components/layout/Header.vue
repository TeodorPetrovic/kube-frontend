<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <router-link to="/">
            <h1>My Blog</h1>
          </router-link>
        </div>
        
        <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <nav class="nav" :class="{ 'nav-open': mobileMenuOpen }">
          <ul class="nav-list">
            <li>
              <router-link to="/" @click="closeMobileMenu">Home</router-link>
            </li>
            <li>
              <router-link to="/blog" @click="closeMobileMenu">Blog</router-link>
            </li>
            <li v-for="menu in menus" :key="menu.id" class="nav-item">
              <template v-if="menu.submenus && menu.submenus.length > 0">
                <a href="#" @click.prevent class="dropdown-toggle">
                  {{ menu.title }}
                  <span class="arrow">▼</span>
                </a>
                <ul class="dropdown">
                  <li v-for="submenu in menu.submenus" :key="submenu.id">
                    <a :href="submenu.url" @click="closeMobileMenu">{{ submenu.title }}</a>
                  </li>
                </ul>
              </template>
              <template v-else>
                <a v-if="menu.url" :href="menu.url" @click="closeMobileMenu">{{ menu.title }}</a>
              </template>
            </li>
            <li>
              <router-link to="/admin" @click="closeMobileMenu" class="admin-link">Admin</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import menusAPI from '../../api/menus';

const menus = ref([]);
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

onMounted(async () => {
  try {
    const response = await menusAPI.getAll();
    menus.value = response.data.filter(menu => menu.isActive);
  } catch (error) {
    console.error('Error loading menus:', error);
  }
});
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo a {
  text-decoration: none;
  color: #333;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.mobile-menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background: #333;
  transition: 0.3s;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-item {
  position: relative;
}

.nav-list a,
.dropdown-toggle {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.nav-list a:hover,
.dropdown-toggle:hover {
  color: #007bff;
}

.arrow {
  font-size: 0.7rem;
}

.dropdown {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  list-style: none;
  padding: 0.5rem 0;
  margin: 0;
  min-width: 200px;
  z-index: 1000;
}

.nav-item:hover .dropdown {
  display: block;
}

.dropdown li {
  padding: 0;
}

.dropdown a {
  display: block;
  padding: 0.5rem 1rem;
  color: #333;
}

.dropdown a:hover {
  background: #f8f9fa;
  color: #007bff;
}

.admin-link {
  color: #28a745 !important;
  font-weight: 600;
}

.admin-link:hover {
  color: #218838 !important;
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }
  
  .nav {
    position: fixed;
    top: 69px;
    left: 0;
    right: 0;
    background: #fff;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease-in-out;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .nav-open {
    max-height: 80vh;
    overflow-y: auto;
  }
  
  .nav-list {
    flex-direction: column;
    gap: 0;
    padding: 1rem;
  }
  
  .nav-item {
    border-bottom: 1px solid #eee;
  }
  
  .nav-list a,
  .dropdown-toggle {
    display: block;
    padding: 1rem 0;
  }
  
  .dropdown {
    position: static;
    box-shadow: none;
    display: none;
    padding-left: 1rem;
  }
  
  .nav-item:hover .dropdown {
    display: block;
  }
}
</style>
