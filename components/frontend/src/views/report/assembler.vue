<script setup>
import { useStore } from 'vuex';
import { onMounted, ref, computed } from 'vue';
import '@/assets/sass/apps/invoice-list.scss';

import { useMeta } from '@/composables/use-meta';
useMeta({ title: 'Отчет по сборщику' });

//flatpickr
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import '@/assets/sass/forms/custom-flatpickr.css';

import ApexChart from 'vue3-apexcharts';

const store = useStore();

const columns = ref([
    'product',
    'assembled_at',
    'price',
]);
const headings = {
    product: 'Изделие',
    assembled_at: 'Дата сборки',
    price: 'Цена',
}

const table_option = ref({
    headings: headings,
    perPage: 10,
    perPageValues: [10, 20, 50, 100],
    skin: 'table table-hover',
    columnsClasses: { actions: 'actions text-center' },
    pagination: { nav: 'scroll', chunk: 20 },
    resizableColumns: false,
    sortable: [
        'product',
        'price',
    ],
    sortIcon: {
        base: 'sort-icon-none',
        up: 'sort-icon-asc',
        down: 'sort-icon-desc',
    },
    texts: {
        count: 'С {from} по {to} из {count}',
        filter: '',
        filterPlaceholder: 'Поиск...',
        limit: 'Показать:',
        noResults: "Нет данных",
        filterBy: "Фильтр",
    },
});
const statuses = ref({
    'Новый': 'badge-info',
    'Ожидает оплаты': 'badge-info',
    'Оплачен': 'badge-primary',
    'Сборка': 'badge-warning',
    'Собран': 'badge-success',
    'Покраска': 'badge-success',
    'Упаковка': 'badge-secondary',
    'Отправлен': 'badge-dark',
    'Завершен': 'badge-dark',
});

onMounted(() => {
    bind_data();
});
const getCurrentMonthStartAndEnd = () => {
    const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    return [startDate, endDate];
}
const assembler = ref(null);
const dateRange = ref(null);
let startDate = null;
let endDate = null;
const bind_data = () => {
    let currentMonth = getCurrentMonthStartAndEnd()
    startDate = currentMonth[0]
    endDate = currentMonth[1]
    dateRange.value = [startDate, endDate];
    store.dispatch('users/fetchItems');
    store.dispatch(
        'chart/fetch',
        `start_date=${startDate.getTime() / 1000}&end_date=${endDate.getTime() / 1000}`
    );
};
const changeRange = (range) => {
    if (range.length == 1) {
        startDate = range[0]
    } else if (range.length == 2) {
        startDate = range[0];
        endDate = range[1];
        change();
    }
}
const change = () => {
    if (assembler.value !== null) {
        startDate.setHours(0, 0, 0, 0)
        endDate.setHours(23, 59, 59, 0)
        const order_items_filter = `status_name=assembled
        &ordering=assembled_at
        &order__assembler=${assembler.value}
        &assembled_at__gte=${startDate.toISOString()}
        &assembled_at__lte=${endDate.toISOString()}
        `
        store.dispatch('order_items/fetchFilter', order_items_filter)
    }
}
function countAndSumByDate(objects) {
    const result = {};
    let totalValue = 0;

    objects.forEach(obj => {
        const date = obj.date.toISOString().split('T')[0];
        if (!result[date]) {
            result[date] = { count: 0, sum: 0 };
        }
        result[date].count += 1;
        result[date].sum += obj.value;
        totalValue += obj.value;
    });

    const sortedResult = Object.keys(result).sort().reduce((acc, key) => {
        acc[key] = result[key];
        return acc;
    }, {});

    return { dailyCounts: sortedResult, totalValue: totalValue };
}

//Statistics
const total_visit_series = ref([{ data: [21, 9, 36, 12, 44, 25, 59, 41, 66, 25] }]);
const total_visit_options = computed(() => {
    const is_dark = store.state.is_dark_mode;
    return {
        chart: { sparkline: { enabled: true }, dropShadow: { enabled: true, top: 3, left: 1, blur: 3, color: '#009688', opacity: 0.7 } },
        stroke: { curve: 'smooth', width: 2 },
        markers: { size: 0 },
        colors: ['#009688'],
        grid: { padding: { top: 0, bottom: 0, left: 0 } },
        tooltip: {
            theme: is_dark ? 'dark' : 'light',
            x: { show: false },
            y: {
                title: {
                    formatter: function formatter() {
                        return '';
                    },
                },
            },
        },
        responsive: [{ breakPoint: 576, options: { chart: { height: 95 }, grid: { padding: { top: 45, bottom: 0, left: 0 } } } }],
    };
});
const paid_visit_series = ref([{ data: [22, 19, 30, 47, 32, 44, 34, 55, 41, 69] }]);
const paid_visit_options = computed(() => {
    const is_dark = store.state.is_dark_mode;
    return {
        chart: { sparkline: { enabled: true }, dropShadow: { enabled: true, top: 1, left: 1, blur: 2, color: '#e2a03f', opacity: 0.7 } },
        stroke: { curve: 'smooth', width: 2 },
        markers: { size: 0 },
        colors: ['#e2a03f'],
        grid: { padding: { top: 0, bottom: 0, left: 0 } },
        tooltip: {
            theme: is_dark ? 'dark' : 'light',
            x: { show: false },
            y: {
                title: {
                    formatter: function formatter() {
                        return '';
                    },
                },
            },
        },
        responsive: [{ breakPoint: 576, options: { chart: { height: 95 }, grid: { padding: { top: 35, bottom: 0, left: 0 } } } }],
    };
});
</script>

<template>
    <div class="layout-px-spacing apps-invoice-list">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="javascript:;">Отчет</a></li>
                                <li class="breadcrumb-item active" aria-current="page"><span>Сборщик</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>
        <div class="row layout-top-spacing">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                <div class="widget widget-visitor-by-browser">
                    <div class="widget-heading">
                        <h5>Чарт - текущий месяц</h5>
                    </div>
                    <div class="widget-content">
                        <div v-for="item in store.state.chart.chart" :key="item.id" class="browser-list chart">
                            <div class="w-icon icon-fill-primary">
                                <div class="avatar avatar-xl avatar-success m-1">
                                    <span class="avatar-title rounded-circle">{{ item.assembler[0] }}</span>
                                </div>
                            </div>
                            <div class="w-browser-details">
                                <div class="w-browser-info">
                                    <h6>{{ item.assembler }} - {{ item.items_count }} изделий</h6>
                                    <p class="browser-count">{{ item.percent }}%</p>
                                </div>
                                <div class="w-browser-stats">
                                    <div class="progress">
                                        <div role="progressbar" aria-valuemin="0" aria-valuemax="100"
                                            :aria-valuenow=item.percent class="progress-bar"
                                            :style="`width: ${item.percent}%`"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                <div class="widget widget-statistics">
                    <div class="widget-heading">
                        <h5>Отчет по сборщику</h5>
                    </div>
                    <div class="widget-content">
                        <div class="row">
                            <div class="col-6">
                                <label for="">Период</label>
                                <div class="form-group mb-0">
                                    <flat-pickr v-model="dateRange" :config="{ mode: 'range' }"
                                        class="form-control flatpickr active text-center"
                                        @on-change="changeRange"></flat-pickr>
                                </div>
                            </div>
                            <div class="col-6">
                                <label for="assembler">Сборщик</label>
                                <select v-model="assembler" class="form-select form-select" id="assembler"
                                    @change="change">
                                    <option value="null" selected disabled>Выберите сотрудника</option>
                                    <option v-for="user in store.state.users.users" :value="user.id" :key="user.id">
                                        {{ `${user.first_name} ${user.last_name}` }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 col-12 layout-spacing">
                <div class="widget widget-statistics">
                    <div class="widget-heading">
                        <h5>Статистика</h5>
                        <div class="task-action">
                            <div class="dropdown btn-group">
                                <a href="javascript:;" id="ddlStatistics" class="btn dropdown-toggle btn-icon-only"
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-more-horizontal">
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="19" cy="12" r="1"></circle>
                                        <circle cx="5" cy="12" r="1"></circle>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="widget-content">
                        <div class="row">
                            <div class="col-6">
                                <div class="w-detail">
                                    <p class="w-title">Всего изделий</p>
                                    <p class="w-stats">
                                        {{ store.state.order_items.order_items.length }}
                                    </p>
                                </div>
                                <!-- <apex-chart v-if="total_visit_options" height="58" type="line"
                                    :options="total_visit_options" :series="total_visit_series"></apex-chart> -->
                            </div>
                            <div class="col-6">
                                <div class="w-detail">
                                    <p class="w-title">Общая сумма</p>
                                    <p class="w-stats">
                                        {{ store.state.order_items.order_items.reduce(
                                            (sum, item) => sum + Number(item.price), 0
                                        ) }}
                                    </p>
                                </div>
                                <!-- <apex-chart v-if="paid_visit_options" height="58" type="line"
                                    :options="paid_visit_options" :series="paid_visit_series"></apex-chart> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row layout-top-spacing" v-if="assembler">
            <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                <div class="panel br-6">
                    <div class="custom-table">
                        <v-client-table :data="store.state.order_items.order_items" :columns="columns"
                            :options="table_option">
                            <template #product="props">
                                <router-link target="_blank" rel="noopener noreferrer" :to="{ path: '/orders/preview', query: { id: props.row.order } }">
                                    <span class="inv-number">{{ `${props.row.product?.sku} |
                                        ${props.row.product?.title}`
                                        }}</span>
                                </router-link>
                            </template>
                            <template #assembled_at="props">
                                <div :data_sort="props.row.assembled_at">
                                    {{ props.row.assembled_at?.toLocaleDateString('ru') }}
                                </div>
                            </template>
                        </v-client-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
