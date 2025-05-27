import { createStore } from 'vuex';
import products from '../api/products';
import { Material } from './materials';
import { Color } from './colors';

export class Product {
    sku = "Пусто"

    constructor(product) {
        // this.id = product.id;
        this.sku = product.sku;
        this.title = product.title;
        this.side = product.side_repr;
        this.side_point = product.side_point;
        this.size = product.size2 ? `${product.size}/${product.size2}` : product.size;
        this.price = product.price;
        this.quantity = 1;
        this.color = new Color(product.color_obj);
        this.material = new Material(product.material_obj);
    }
}


export default {
    namespaced: true,
    state: {
        bySku: [],
        add: {
            id: null,
            color: {
                id: null,
                title: null
            },
            material: {
                id: null,
                title: null
            },
            sku: null,
            title: null,
            side: null,
            size: null,
            price: null
        }
    },
    mutations: {
        setItems(state, data) {
            let items = []
            for (var i of data) {
                items.push(new Product(i))
            };
            state.bySku = items
        },
    },
    getters: {
        layout(state) {
            return state.layout;
        },
    },
    actions: {
        async fetchItems({ commit }) {
            try {
                const res = await products.fetchAll();
                commit('setOrders', res.data);
            } catch (err) {
                throw err;
            }
        },
        async fetchById({ commit }, { id }) {
            try {
                const res = await products.fetchById(id);
                commit('setOrders', res.data);
            } catch (err) {
                throw err;
            }
        },
        async create({ commit }, payload) {
            try {
                const res = await products.create(payload);
                return res
            } catch (err) {
                throw err;
            }
        },
        async update({ commit }, { id, payload }) {
            try {
                const res = await products.update(id, payload);
                commit('setOrders', res.data);
                return res
            } catch (err) {
                throw err;
            }
        },
        async find({ commit }, query) {
            try {
                const res = await products.find(query);
                commit('setItems', res.data);
            } catch (err) {
                throw err;
            }
        },
    },
    modules: {},
};
