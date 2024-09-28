import auth from '../api/auth';
import session from '../api/session';
import {
    LOGIN_BEGIN,
    LOGIN_FAILURE,
    LOGIN_SUCCESS,
    LOGOUT,
    REMOVE_TOKEN,
    REMOVE_USER_DATA,
    SET_TOKEN,
    SET_USER_DATA,
} from './types';

const TOKEN_STORAGE_KEY = 'TOKEN_STORAGE_KEY';
const USER_ID = 'USER_ID';
const USER_NAME = 'USER_NAME';
const isProduction = process.env.NODE_ENV === 'production';

const initialState = {
    authenticating: false,
    error: false,
    token: null,
    user: {
        id: null,
        name: null,
    }
};

const getters = {
    isAuthenticated: state => !!state.token,
    user: state => !!state.user,
};

const actions = {
    login({ commit }, { username, password }) {
        commit(LOGIN_BEGIN);
        return auth.login(username, password)
            .then(({ data }) => commit(SET_TOKEN, data.token))
            .then(() => auth.user(username, password)
                .then(({ data }) => commit(SET_USER_DATA, data))
                .catch(() => commit(LOGIN_FAILURE)))
            .then(() => commit(LOGIN_SUCCESS))
            .catch(() => commit(LOGIN_FAILURE));
    },
    logout({ commit }) {
        commit(REMOVE_TOKEN);
        commit(REMOVE_USER_DATA);
        return auth.logout()
            .then(() => commit(LOGOUT))
            .finally(() => {
                commit(REMOVE_TOKEN);
                commit(REMOVE_USER_DATA);
            });
    },
    initialize({ commit }) {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);

        if (isProduction && !token) {
            commit(REMOVE_USER_DATA);
        }

        if (isProduction && token) {
            commit(SET_TOKEN, token);
        }

        if (!isProduction && token) {
            commit(SET_TOKEN, token);
        }
    },
};

const mutations = {
    [LOGIN_BEGIN](state) {
        state.authenticating = true;
        state.error = false;
    },
    [LOGIN_FAILURE](state) {
        state.authenticating = false;
        state.error = true;
    },
    [LOGIN_SUCCESS](state) {
        state.authenticating = false;
        state.error = false;
    },
    [LOGOUT](state) {
        state.authenticating = false;
        state.error = false;
    },
    [SET_TOKEN](state, token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        // if (!isProduction) localStorage.setItem(TOKEN_STORAGE_KEY, token);
        session.defaults.headers.Authorization = `Token ${token}`;
        state.token = token;
    },
    [SET_USER_DATA](state, data) {
        localStorage.setItem(USER_ID, data.id);
        // if (!isProduction) localStorage.setItem(USER_ID, data.id);
        localStorage.setItem(USER_NAME, `${data.first_name} ${data.last_name}`);
        // if (!isProduction) localStorage.setItem(USER_NAME, `${data.first_name} ${data.last_name}`);

        state.user.id = data.id;
        state.user.name = `${data.first_name} ${data.last_name}`;
    },
    [REMOVE_TOKEN](state) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        delete session.defaults.headers.Authorization;
        state.token = null;
    },
    [REMOVE_USER_DATA](state) {
        localStorage.removeItem(USER_ID);
        localStorage.removeItem(USER_NAME);

        state.user.id = null;
        state.user.name = null;
    },
};

export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations,
};
