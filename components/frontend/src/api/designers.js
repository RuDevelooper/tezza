import session from './session';

export default {
  fetchAll() {
    return session.get('/designers/');
  },
  fetchById(id) {
    return session.get(`/designers/${id}`);
  },
  create(payload) {
    return session.post('/designers/', payload);
  },
  update(id, payload) {
    return session.get(`/designers/${id}`, payload);
  },
  find(payload) {
    return session.get(`/designers/?search=${payload}`);
  },
};