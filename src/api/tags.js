import apiClient from './client';

export default {
  getAll() {
    return apiClient.get('/tags');
  },
  getById(id) {
    return apiClient.get(`/tags/${id}`);
  },
};
