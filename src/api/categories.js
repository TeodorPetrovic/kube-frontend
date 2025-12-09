import apiClient from './client';

export default {
  getAll() {
    return apiClient.get('/categories');
  },
  getById(id) {
    return apiClient.get(`/categories/${id}`);
  },
  getBySlug(slug) {
    return apiClient.get(`/categories/slug/${slug}`);
  },
};
