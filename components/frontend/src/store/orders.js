import { createStore } from 'vuex';
import orders from '../api/orders';
import { Product } from './products';

class OrderItem {
    constructor(item) {
        this.id = item.id;
        this.status = item.status;
        this.status_name = item.status_name;
        this.priority = item.priority;
        this.product = new Product(item.product);
        this.price = item.price;
        this.order = item.order;
    }
}

class Order {
    id = null;
    number = null;
    created_at = null;
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
    picker = null;

    constructor(i) {
        let assembler = i.assembler ? {
            id: i.assembler.id,
            first_name: i.assembler.first_name,
            last_name: i.assembler.last_name,
            full_name: i.assembler.first_name + ' ' + i.assembler.last_name,
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

        let comments = []
        for (var item of i.comments) {
            comments.push(
                {

                    id: item.id,
                    user: {
                        id: item.user.id,
                        first_name: item.user.first_name,
                        last_name: item.user.last_name,
                    },
                    comment: item.comment,
                    added_at: new Date(item.added_at) || item.added_at,
                    order: item.order,
                }
            )
        };

        this.id = i.id;
        this.number = i.number;
        this.priority = i.priority;
        this.status = i.status;
        this.products_cost = i.products_cost;
        this.delivery_cost = i.delivery_cost;
        this.delivery_tracking_number = i.delivery_tracking_number;
        this.total_cost = i.total_cost;
        this.created_by = i.created_by;
        this.assembler = i.assembler;
        this.picker = i.picker;
        this.assembler = assembler;
        this.customer = customer;
        this.items = items;
        this.comments = comments;
        this.created_at = new Date(i.created_at) || i.created_at;
        this.due_date = new Date(i.due_date) || i.due_date;
        this.assembling_start = new Date(i.assembling_start) || i.assembling_start;
        this.assembling_end = new Date(i.assembling_end) || i.assembling_end;
        this.picked_at = new Date(i.picked_at) || i.picked_at;
        this.shipped_at = new Date(i.shipped_at) || i.shipped_at;
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

    get assembler_deadline_locale_date() {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          };
        if (this.due_date) {
            let deadline = new Date(this.due_date)
            deadline.setDate(deadline.getDate() - 5)
            return deadline.toLocaleDateString('ru-RU', options);
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
                // commit('setOrders', res.data);
            } catch (err) {
                console.log(err)
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
        async setOrderItemDone({ commit }, { id, status }) {
            try {
                const res = await orders.update_item(id, status);
            } catch (err) {
                throw err;
            }
        },
    },
    modules: {},
};
