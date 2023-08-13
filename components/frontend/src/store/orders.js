import { createStore } from 'vuex';
import orders from '../api/orders';

export default {
    namespaced: true,
    state: {
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
        setOrders(state, data) {
            let orders = []
            for (var i of data) {
                let assembler = {
                    id: i.assembler.id,
                    first_name: i.assembler.first_name,
                    last_name: i.assembler.last_name,
                    full_name: i.assembler.first_name + ' ' + i.assembler.last_name,
                } || i.assembler;

                let customer = {
                    id: i.customer.id,
                    organisation: i.customer.organisation,
                    name: i.customer.name,
                    address: i.customer.address,
                    phone: i.customer.phone,
                } || i.customer;

                let items = []
                for (var item of i.items) {
                    items.push(
                        {
                            id: item.id,
                            status: item.status,
                            priority: item.priority,
                            product: item.product,
                            price: item.price,
                            order: item.order,
                        }
                    )
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

                orders.push(
                    {
                        id: i.id,
                        number: i.number,
                        priority: i.priority,
                        status: i.status,
                        products_cost: i.products_cost,
                        delivery_cost: i.delivery_cost,
                        delivery_tracking_number: i.delivery_tracking_number,
                        total_cost: i.total_cost,
                        created_by: i.created_by,
                        assembler: i.assembler,
                        picker: i.picker,

                        assembler: assembler,
                        customer: customer,
                        items: items,
                        comments: comments,

                        // Date fields
                        created_at: new Date(i.created_at) || i.created_at,
                        due_date: new Date(i.due_date) || i.due_date,
                        assembling_start: new Date(i.assembling_start) || i.assembling_start,
                        assembling_end: new Date(i.assembling_end) || i.assembling_end,
                        picked_at: new Date(i.picked_at) || i.picked_at,
                        shipped_at: new Date(i.shipped_at) || i.shipped_at,
                    }
                )
            };
            state.orders = orders
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
                commit('setOrders', res.data);
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
    },
    modules: {},
};
