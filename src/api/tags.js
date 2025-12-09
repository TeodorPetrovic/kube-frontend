import apiClient from './client';

export default {
  getAll() {
    return apiClient.get('/tags');
  },
  getById(id) {
    return apiClient.get(`/tags/${id}`);
  },
  create(tag) {
    return apiClient.post('/tags', tag);
  },
  update(id, tag) {
    return apiClient.patch(`/tags/${id}`, tag);
  },
  delete(id) {
    return apiClient.delete(`/tags/${id}`);
  },
};
