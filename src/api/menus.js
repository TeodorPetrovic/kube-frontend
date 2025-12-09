import apiClient from './client';

export default {
  getAll() {
    return apiClient.get('/menus');
  },
};
