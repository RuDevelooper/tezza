import session from './session';

export default {
  fetchAll() {
    return session.get('/materials/');
  },
  fetchById(id) {
    return session.get(`/materials/${id}`);
  },
  create(payload) {
    return session.post('/materials/', payload);
  },
  update(id, payload) {
    return session.get(`/materials/${id}`, payload);
  },
  find(payload) {
    return session.get(`/materials/?search=${payload}`);
  },
};