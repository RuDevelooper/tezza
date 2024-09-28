import session from './session';

export default {
  fetchAll() {
    return session.get('/orders/');
  },
  fetchFilter(filters) {
    return session.get(`/orders/?${filters}`);
  },
  fetchById(id) {
    return session.get(`/orders/${id}`);
  },
  create(payload) {
    return session.post('/orders/', payload);
  },
  update(id, payload) {
    return session.put(`/orders/${id}/`, payload);
  },
  update_assembler(id, assembler, status, assembling_start) {
    return session.patch(`/orders/${id}/`, { assembler, status, assembling_start });
  },
  update_item(id, status) {
    return session.patch(`/order_items/${id}/`, { status });
  },
};
