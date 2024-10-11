import { createStore } from 'vuex';
import { Product } from './products';
import order_items from '../api/order_items';

export class OrderItem {
    constructor(item) {
        this.id = item.id;
        this.status = item.status;
        this.status_name = item.status_name;
        this.priority = item.priority;
        this.assembled_at = item.assembled_at ? new Date(item.assembled_at) : null;
        this.product = new Product(item.product);
        this.price = item.price;
        this.order = item.order;
        this.order_num = item.order_num;
    }
};

export default {
    namespaced: true,
    state: {
        order_items: [],
    },
    mutations: {
        setItems(state, data) {
            let items = []
            for (var i of data) {
                items.push(new OrderItem(i))
            };
            state.order_items = items
        },
    },
    getters: {
        all(state) {
            return state.order_items;
        },
    },
    actions: {
        async fetchItems({ commit }) {
            try {
                const res = await order_items.fetchAll();
                commit('setItems', res.data);
            } catch (err) {
                throw err;
            }
        },
        async fetchFilter({ commit }, filters) {
            try {
                const res = await order_items.fetchFilter(filters);
                commit('setItems', res.data);
            } catch (err) {
                throw err;
            }
        },
    },
    modules: {},
};
