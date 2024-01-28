import session from './session';

export default {
  fetchAll() {
    return session.get('/sides/');
  },
  fetchById(id) {
    return session.get(`/sides/${id}`);
  },
  create(payload) {
    return session.post('/sides/', payload);
  },
  update(id, payload) {
    return session.get(`/sides/${id}`, payload);
  },
  find(payload) {
    return session.get(`/sides/?search=${payload}`);
  },
};