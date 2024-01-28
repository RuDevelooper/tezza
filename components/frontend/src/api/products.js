import session from './session';

export default {
  fetchAll() {
    return session.get('/products/');
  },
  fetchById(id) {
    return session.get(`/products/${id}`);
  },
  create(payload) {
    return session.post('/products/', payload);
  },
  update(id, payload) {
    return session.get(`/products/${id}`, payload);
  },
  find(payload) {
    return session.get(`/products/?search=${payload}`);
  },
};