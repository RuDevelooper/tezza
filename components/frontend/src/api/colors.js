import session from './session';

export default {
  fetchAll() {
    return session.get('/colors/');
  },
  fetchById(id) {
    return session.get(`/colors/${id}`);
  },
  create(payload) {
    return session.post('/colors/', payload);
  },
  update(id, payload) {
    return session.get(`/colors/${id}`, payload);
  },
  find(payload) {
    return session.get(`/colors/?search=${payload}`);
  },
};