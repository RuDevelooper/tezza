import session from './session';

export default {
  fetchAll() {
    return session.get('/users/');
  },
  fetchById(id) {
    return session.get(`/users/${id}`);
  },
  create(payload) {
    return session.post('/users/', payload);
  },
  update(id, payload) {
    return session.get(`/users/${id}`, payload);
  },
  find(payload) {
    return session.get(`/users/?search=${payload}`);
  },
};