import { createStore } from 'vuex';
import materials from '../api/materials';


export class Material {
    constructor(color) {
        this.id = color.id;
        this.title = color.title;
    }
};

export default {
    namespaced: true,
    state: {
        materials: [
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
                items.push(new Material(i))
            };
            state.materials = items
        },
    },
    getters: {
        all(state) {
            return state.materials;
        },
    },
    actions: {
        async fetchItems({ commit }) {
            try {
                const res = await materials.fetchAll();
                commit('setItems', res.data);
            } catch (err) {
                throw err;
            }
        },
    },
    modules: {},
};
