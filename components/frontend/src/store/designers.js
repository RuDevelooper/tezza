import { createStore } from 'vuex';
import designers from '../api/designers';

export class Designer {
    constructor(designer) {
        this.id = designer.id;
        this.name = designer.name;
    }
};

export default {
    namespaced: true,
    state: {
        colors: [
            {
                id: null,
                name: null
            },
        ],
    },
    mutations: {
        setItems(state, data) {
            let items = []
            for (var i of data) {
                items.push(new Designer(i))
            };
            state.designers = items
        },
    },
    getters: {
        all(state) {
            return state.designers;
        },
    },
    actions: {
        async fetchItems({ commit }) {
            try {
                const res = await designers.fetchAll();
                commit('setItems', res.data);
            } catch (err) {
                throw err;
            }
        },
    },
    modules: {},
};
