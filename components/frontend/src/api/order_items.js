import session from './session';

export default {
  fetchAll() {
    return session.get('/order_items/');
  },
  fetchFilter(filters) {
    return session.get(`/order_items/?${filters}`);
  },
  fetchById(id) {
    return session.get(`/order_items/${id}`);
  },
  create(payload) {
    return session.post('/order_items/', payload);
  },
  update(id, payload) {
    return session.get(`/order_items/${id}`, payload);
  },
  find(payload) {
    return session.get(`/order_items/?search=${payload}`);
  },
};