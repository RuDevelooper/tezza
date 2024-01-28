import { createStore } from 'vuex';
import sides from '../api/sides';

export default {
    namespaced: true,
    state: {
        sides: [
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
                items.push(
                    {
                        id: i.id,
                        title: i.title
                    }
                )
            };
            state.sides = items
        },
    },
    getters: {
        all(state) {
            return state.sides;
        },
    },
    actions: {
        async fetchItems({ commit }) {
            try {
                const res = await sides.fetchAll();
                commit('setItems', res.data);
            } catch (err) {
                throw err;
            }
        },
    },
    modules: {},
};
