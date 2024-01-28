import session from './session';

export default {
  fetchAll() {
    return session.get('/orders/');
  },
  fetchById(id) {
    return session.get(`/orders/${id}`);
  },
  create(payload) {
    return session.post('/orders/', payload);
  },
  update(id, payload) {
    return session.get(`/orders/${id}`, payload);
  },
  update_item(id, status) {
    return session.patch(`/order_items/${id}/`, { status });
  },
};