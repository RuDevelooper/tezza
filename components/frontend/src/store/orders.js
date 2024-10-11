import { createStore } from 'vuex';
import orders from '../api/orders';
import { Product } from './products';
import { OrderItem } from './order_items';

class Order {
    id = null;
    number = null;
    created_at = null;
    comment_for_manager = null;
    comment_for_assembler = null;
    comment_for_picker = null;
    due_date = null;
    priority = null;
    status = null;
    products_cost = null;
    delivery_cost = null;
    delivery_tracking_number = null;
    total_cost = null;
    assembling_start = null;
    assembling_end = null;
    picked_at = null;
    shipped_at = null;
    created_by = null;
    customer = null;
    assembler = null;
    assembler_user = null;
    picker = null;

    constructor(i) {
        let assembler_user = i.assembler_user ? {
            id: i.assembler_user.id,
            first_name: i.assembler_user.first_name,
            last_name: i.assembler_user.last_name,
            full_name: i.assembler_user.first_name + ' ' + i.assembler_user.last_name,
        } : null;
        let manager_user = i.manager_user ? {
            id: i.manager_user.id,
            first_name: i.manager_user.first_name,
            last_name: i.manager_user.last_name,
            full_name: i.manager_user.first_name + ' ' + i.manager_user.last_name,
        } : null;
        let picker_user = i.picker_user ? {
            id: i.picker_user.id,
            first_name: i.picker_user.first_name,
            last_name: i.picker_user.last_name,
            full_name: i.picker_user.first_name + ' ' + i.picker_user.last_name,
        } : null;
        let designer_user = i.designer_user ? {
            id: i.designer_user.id,
            name: i.designer_user.name,
        } : null;

        let customer = i.customer ? {
            id: i.customer.id,
            organisation: i.customer.organisation,
            name: i.customer.name,
            address: i.customer.address,
            phone: i.customer.phone,
        } : null;

        let items = []
        for (var item of i.items) {
            items.push(new OrderItem(item))
        };

        this.id = i.id;
        this.number = i.number;
        this.priority = i.priority;
        this.status = i.status_name;
        this.products_cost = i.products_cost;
        this.delivery_cost = i.delivery_cost;
        this.delivery_tracking_number = i.delivery_tracking_number;
        this.total_cost = i.total_cost;
        this.created_by = i.created_by;
        this.assembler = i.assembler;
        this.picker = i.picker;
        this.assembler_user = assembler_user;
        this.manager_user = manager_user;
        this.picker_user = picker_user;
        this.designer_user = designer_user;
        this.customer = customer;
        this.items = items;
        this.discount = i.discount;
        this.comment_for_manager = i.comment_for_manager;
        this.comment_for_assembler = i.comment_for_assembler;
        this.comment_for_picker = i.comment_for_picker;
        this.created_at = i.created_at ? new Date(i.created_at) : null;
        this.due_date = i.due_date ? new Date(i.due_date) : null;
        this.assembling_start = i.assembling_start ? new Date(i.assembling_start) : null;
        this.assembling_end = i.assembling_end ? new Date(i.assembling_end) : null;
        this.picked_at = i.picked_at ? new Date(i.picked_at) : null;
        this.shipped_at = i.shipped_at ? new Date(i.shipped_at) : null;
    }

    get created_at_local_date() {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        if (this.created_at) {
            return this.created_at.toLocaleDateString('ru-RU', options);
        }
        return '-';
    }

    get assembler_deadline() {
        if (!this.due_date) return null;

        let deadline = new Date(this.due_date)
        deadline.setDate(deadline.getDate() - 5)
        return deadline
    }

    get assembler_deadline_locale_date() {
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        if (this.assembler_deadline) {
            return this.assembler_deadline.toLocaleDateString('ru-RU', options);
        }
        return '-';
    }

    get due_local_date() {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        if (this.due_date) {
            return this.due_date.toLocaleDateString('ru-RU', options);
        }
        return '-';
    }

    get customer_phone() {
        let inputNumbersValue = this.customer.phone.split(/\D/g).join('').slice(-10),
            formattedInputValue = "";

        if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
            if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
            var firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
            formattedInputValue = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
        }
        return formattedInputValue;
    }
}

export default {
    namespaced: true,
    state: {
        order: Order,
        orders: [],
        add: {
            id: null,
            number: null,
            created_at: null,
            due_date: null,
            priority: null,
            status: null,
            products_cost: null,
            delivery_cost: null,
            delivery_tracking_number: null,
            total_cost: null,
            assembling_start: null,
            assembling_end: null,
            picked_at: null,
            shipped_at: null,
            created_by: null,
            customer: null,
            assembler: null,
            picker: null
        }
    },
    mutations: {
        setOrder(state, i) {
            state.order = new Order(i);
        },
        setOrders(state, data) {
            let orders = []
            for (var i of data) {
                orders.push(new Order(i));
            };
            state.orders = orders;
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
                const res = await orders.fetchAll();
                commit('setOrders', res.data);
            } catch (err) {
                throw err;
            }
        },
        async fetchFilter({ commit }, filters) {
            try {
                const res = await orders.fetchFilter(filters);
                commit('setOrders', res.data);
            } catch (err) {
                throw err;
            }
        },
        async fetchFilter({ commit }, filters) {
            try {
                const res = await orders.fetchFilter(filters);
                commit('setOrders', res.data);
            } catch (err) {
                throw err;
            }
        },
        async fetchFilter({ commit }, filters) {
            try {
                const res = await orders.fetchFilter(filters);
                commit('setOrders', res.data);
            } catch (err) {
                throw err;
            }
        },
        async fetchById({ commit }, { id }) {
            try {
                const res = await orders.fetchById(id);
                commit('setOrder', res.data);
            } catch (err) {
                throw err;
            }
        },
        async create({ commit }, payload) {
            try {
                const res = await orders.create(payload);
                return res;
            } catch (err) {
                throw err;
            }
        },
        async update({ commit }, { id, payload }) {
            try {
                const res = await orders.update(id, payload);
                commit('setOrders', res.data);
            } catch (err) {
                throw err;
            }
        },
        async update_assembler({ commit }, { id, assembler, status, assembling_start }) {
            try {
                const res = await orders.update_assembler(id, assembler, status, assembling_start);
                commit('setOrder', res.data);
            } catch (err) {
                throw err;
            }
        },
        async update_picker({ commit }, { id, picker, shipped_at, status }) {
            try {
                const res = await orders.update_picker(id, picker, shipped_at, status);
                commit('setOrder', res.data);
            } catch (err) {
                throw err;
            }
        },
        async setOrderItemDone({ commit }, { id, status }) {
            try {
                const res = await orders.update_item(id, status);
            } catch (err) {
                throw err;
            }
        },
        async set_track_number({ commit }, { id, delivery_tracking_number }) {
            try {
                const res = await orders.set_track_number(id, delivery_tracking_number);
                commit('setOrder', res.data);
                return res;
            } catch (err) {
                throw err;
            }
        },
        async partial_update({ commit }, { id, payload }) {
            try {
                const res = await orders.partial_update(id, payload);
                commit('setOrder', res.data);
                return res;
            } catch (err) {
                throw err;
            }
        },
        async finish_order({ commit }, { id, status }) {
            try {
                const res = await orders.finish_order(id, status);
                commit('setOrder', res.data);
            } catch (err) {
                throw err;
            }
        },
    },
    modules: {},
};
