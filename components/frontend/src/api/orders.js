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
  partial_update(id, payload) {
    return session.patch(`/orders/${id}/`, payload);
  },
  update_assembler(id, assembler, status, assembling_start) {
    return session.patch(`/orders/${id}/`, { assembler, status, assembling_start });
  },
  update_picker(id, picker, shipped_at, status) {
    return session.patch(`/orders/${id}/`, { picker, shipped_at, status });
  },
  set_track_number(id, delivery_tracking_number) {
    return session.patch(`/orders/${id}/`, { delivery_tracking_number });
  },
  finish_order(id, status) {
    return session.patch(`/orders/${id}/`, { status });
  },
  update_item(id, status) {
    return session.patch(`/order_items/${id}/`, { status });
  },
};
