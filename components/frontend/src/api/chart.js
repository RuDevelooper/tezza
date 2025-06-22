import session from './session';

export default {
  fetch(filters) {
    return session.get(`/chart/?${filters}`);
  },
};