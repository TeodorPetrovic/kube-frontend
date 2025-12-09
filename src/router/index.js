import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import PostList from '../views/PostList.vue';
import PostDetail from '../views/PostDetail.vue';
import CategoryPosts from '../views/CategoryPosts.vue';
import TagPosts from '../views/TagPosts.vue';
import StaticPage from '../views/StaticPage.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/blog',
    name: 'Blog',
    component: PostList,
  },
  {
    path: '/post/:slug',
    name: 'PostDetail',
    component: PostDetail,
  },
  {
    path: '/category/:slug',
    name: 'CategoryPosts',
    component: CategoryPosts,
  },
  {
    path: '/tag/:id',
    name: 'TagPosts',
    component: TagPosts,
  },
  {
    path: '/page/:slug',
    name: 'StaticPage',
    component: StaticPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
