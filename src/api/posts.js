import apiClient from './client';

export default {
  getAll() {
    return apiClient.get('/posts');
  },
  getBySlug(slug) {
    return apiClient.get(`/posts/slug/${slug}`);
  },
  getById(id) {
    return apiClient.get(`/posts/${id}`);
  },
};
