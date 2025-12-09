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
  create(category) {
    return apiClient.post('/categories', category);
  },
  update(id, category) {
    return apiClient.patch(`/categories/${id}`, category);
  },
  delete(id) {
    return apiClient.delete(`/categories/${id}`);
  },
};
