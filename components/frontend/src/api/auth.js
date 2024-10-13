import session from './session';

export default {
  login(username, password) {
    return session.post('/login/', { username, password });
  },
  user() {
    return session.get('/user/');
  },
  logout() {
    return session.get('/logout/', {});
  },
  createAccount(username, password1, password2, email) {
    return session.post('/registration/', { username, password1, password2, email });
  },
  changeAccountPassword(password1, password2) {
    return session.post('/password/change/', { password1, password2 });
  },
  sendAccountPasswordResetEmail(email) {
    return session.post('/password/reset/', { email });
  },
  resetAccountPassword(uid, token, new_password1, new_password2) { // eslint-disable-line camelcase
    return session.post('/password/reset/confirm/', { uid, token, new_password1, new_password2 });
  },
  getAccountDetails() {
    return session.get('/user/');
  },
  updateAccountDetails(data) {
    return session.patch('/user/', data);
  },
  verifyAccountEmail(key) {
    return session.post('/registration/verify-email/', { key });
  },
};