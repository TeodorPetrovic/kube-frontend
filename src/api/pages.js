import apiClient from './client';

export default {
  getAll() {
    return apiClient.get('/pages');
  },
  getBySlug(slug) {
    return apiClient.get(`/pages/slug/${slug}`);
  },
  getById(id) {
    return apiClient.get(`/pages/${id}`);
  },
};
