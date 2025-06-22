import { createStore } from 'vuex';
import chart from '../api/chart'

export class Chart {
    constructor(item) {
        this.assembler_id = item.assembler_id;
        this.assembler = item.assembler.trim();
        this.items_count = Number.parseInt(item.items_count);
        this.total_value = Number.parseFloat(item.total_value);
        this.percent = Math.round(Number.parseFloat(item.percent));
    }
};

export default {
    namespaced: true,
    state: {
        chart: [],
    },
    mutations: {
        setChart(state, data) {
            let items = []
            for (var i of data) {
                items.push(new Chart(i))
            };
            state.chart = items
        },
    },
    getters: {
        all(state) {
            return state.chart;
        },
    },
    actions: {
        async fetch({ commit }, filters) {
            try {
                const res = await chart.fetch(filters);
                commit('setChart', res.data);
            } catch (err) {
                throw err;
            }
        },
    },
    modules: {},
};
