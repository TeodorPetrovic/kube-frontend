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
  create(post) {
    return apiClient.post('/posts', post);
  },
  update(id, post) {
    return apiClient.patch(`/posts/${id}`, post);
  },
  delete(id) {
    return apiClient.delete(`/posts/${id}`);
  },
};
