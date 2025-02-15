import { createStore } from 'vuex';
import orders from '../api/orders';
import { Product } from './products';
import { OrderItem } from './order_items';

class Order {
    id = null;
    customer = null;
    designer = null;
    assembler = null;
    created_by = null;
    picker = null;
    priority = null;
    status_name = null;
    delivery_payer_name = null;
    number = null;
    created_at = null;
    ordered_at = null;
    due_date = null;
    status = null;
    products_cost = null;
    delivery_cost = null;
    delivery_payer = null;
    delivery_tracking_number = null;
    comment_for_manager = null;
    comment_for_assembler = null;
    comment_for_picker = null;
    comment_for_sender = null;
    total_cost = null;
    discount = null;
    assembling_start = null;
    assembling_end = null;
    picked_at = null;
    shipped_at = null;
    completed_at = null;

    constructor(i) {

        Object.assign(this, i);

        this.assembler = typeof i.assembler === 'object' && i.assembler != null ? {
            id: i.assembler.id,
            // first_name: i.assembler.first_name,
            // last_name: i.assembler.last_name,
            full_name: i.assembler.first_name + ' ' + i.assembler.last_name,
        } : i.assembler;
        this.created_by = typeof i.created_by === 'object' && i.created_by != null ? {
            id: i.created_by.id,
            // first_name: i.created_by.first_name,
            // last_name: i.created_by.last_name,
            full_name: i.created_by.first_name + ' ' + i.created_by.last_name,
        } : i.created_by;
        this.picker = typeof i.picker === 'object' && i.picker != null ? {
            id: i.picker.id,
            // first_name: i.picker.first_name,
            // last_name: i.picker.last_name,
            full_name: i.picker.first_name + ' ' + i.picker.last_name,
        } : i.picker;
        // let designer_user = i.designer_user ? {
        //     id: i.designer_user.id,
        //     name: i.designer_user.name,
        // } : null;

        // let customer = i.customer ? {
        //     id: i.customer.id,
        //     organisation: i.customer.organisation,
        //     name: i.customer.name,
        //     address: i.customer.address,
        //     phone: i.customer.phone,
        // } : null;

        let items = []
        for (var item of i.items) {            
            try {
                items.push(new OrderItem(item))
            } catch (e) {
                items.push(item)
            }
        };
        this.items = items
        this.status = i.status_name;
        this.created_at = i.created_at ? new Date(i.created_at) : null;
        this.ordered_at = i.ordered_at ? new Date(i.ordered_at) : null;
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
        deadline.setDate(deadline.getDate() - 10)
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
        addOrders(state, data) {
            let orders = []
            for (var i of data) {
                orders.push(new Order(i));
            };
            state.orders.concat(orders);
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
        async fetchFilterByChunk({ commit }, filters) {
            const currentPage = 1;
            const nextPage = true;
            const isLoading = true;

            let filters_ = filters + '&page_size=20';
            commit('setOrders', []);

            while (nextPage && isLoading) {
                let filters__ = filters_ + `&page=${currentPage}`

                try {
                    const res = await orders.fetchFilter(filters__);
                    commit('addOrders', res.data);
                    nextPage = !!res.data.next;
                    if (nextPage && !isLoading) {
                        currentPage += 1;
                        fetchData();
                    }
                } catch (err) {
                    throw err;
                } finally {
                    isLoading = false;
                }
            }
        },
        async fetchById({ commit }, { id }) {
            try {
                const res = await orders.fetchById(id);
                commit('setOrder', res.data);
                return res;
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
