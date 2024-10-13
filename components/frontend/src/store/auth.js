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
    SET_USER_INFO,
} from './types';

const TOKEN_STORAGE_KEY = 'TOKEN_STORAGE_KEY';
const USER_ID = 'USER_ID';
const USER_NAME = 'USER_NAME';
const USER_GROUP = 'USER_GROUP';

const isProduction = process.env.NODE_ENV === 'production';

const initialState = {
    authenticating: false,
    error: false,
    token: null,
    user: {
        id: null,
        name: null,
        group: null,
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
        return auth.logout()
            .then(() => commit(LOGOUT))
            .finally(() => {
                commit(REMOVE_TOKEN);
                commit(REMOVE_USER_DATA);
            });
    },
    initialize({ commit }) {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        const userID = localStorage.getItem(USER_ID);
        const userName = localStorage.getItem(USER_NAME);
        const userGroup = localStorage.getItem(USER_GROUP);

        if (isProduction && !token && !(userID && userName && userGroup)) {
            commit(REMOVE_USER_DATA);
        }

        if (isProduction && token && userID && userName && userGroup) {
            commit(SET_TOKEN, token);
            commit(SET_USER_INFO, {
                user_id: userID,
                user_name: userName,
                user_group: userGroup
            });
        }

        if (!isProduction && token && userID && userName && userGroup) {
            commit(SET_TOKEN, token);
            commit(SET_USER_INFO, {
                user_id: userID,
                user_name: userName,
                user_group: userGroup
            });
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
        if (!isProduction) localStorage.setItem(TOKEN_STORAGE_KEY, token);
        session.defaults.headers.Authorization = `Token ${token}`;
        state.token = token;
    },
    [SET_USER_INFO](state, { user_id, user_name, user_group }) {
        state.user.id = user_id;
        state.user.name = user_name;
        state.user.group = user_group;
    },
    [SET_USER_DATA](state, data) {
        localStorage.setItem(USER_ID, data.id);
        if (!isProduction) localStorage.setItem(USER_ID, data.id);

        localStorage.setItem(USER_GROUP, data.groups[0]);
        if (!isProduction) localStorage.setItem(USER_GROUP, data.groups[0]);

        localStorage.setItem(USER_NAME, `${data.first_name} ${data.last_name}`);
        if (!isProduction) localStorage.setItem(USER_NAME, `${data.first_name} ${data.last_name}`);

        state.user.id = data.id;
        state.user.name = `${data.first_name} ${data.last_name}`;
        state.user.group = data.groups[0];
    },
    [REMOVE_TOKEN](state) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        delete session.defaults.headers.Authorization;
        state.token = null;
    },
    [REMOVE_USER_DATA](state) {
        localStorage.removeItem(USER_ID);
        localStorage.removeItem(USER_NAME);
        localStorage.removeItem(USER_GROUP);

        state.user.id = null;
        state.user.name = null;
        state.user.group = null;
    },
};

export default {
    namespaced: true,
    state: initialState,
    getters,
    actions,
    mutations,
};
