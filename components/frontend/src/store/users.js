import { createStore } from 'vuex';
import users from '../api/users';

export class User {
    constructor(user) {
        this.id = user.id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
    }
};

export default {
    namespaced: true,
    state: {
        users: [
            {
                id: null,
                title: null
            },
        ],
    },
    mutations: {
        setItems(state, data) {
            let items = []
            for (var i of data) {
                items.push(new User(i))
            };
            state.users = items
        },
    },
    getters: {
        all(state) {
            return state.users;
        },
    },
    actions: {
        async fetchItems({ commit }) {
            try {
                const res = await users.fetchAll();
                commit('setItems', res.data);
            } catch (err) {
                throw err;
            }
        },
    },
    modules: {},
};
