import apiClient from './client';

export default {
  getByPostId(postId) {
    return apiClient.get(`/comments/post/${postId}`);
  },
  create(comment) {
    return apiClient.post('/comments', comment);
  },
};
