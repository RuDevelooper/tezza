import { createStore } from 'vuex';
import colors from '../api/colors';

export class Color {
    constructor(color) {
        this.id = color.id;
        this.title = color.title;
    }
};

export default {
    namespaced: true,
    state: {
        colors: [
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
                items.push(new Color(i))
            };
            state.colors = items
        },
    },
    getters: {
        all(state) {
            return state.colors;
        },
    },
    actions: {
        async fetchItems({ commit }) {
            try {
                const res = await colors.fetchAll();
                commit('setItems', res.data);
            } catch (err) {
                throw err;
            }
        },
    },
    modules: {},
};
