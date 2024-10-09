<script setup>
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import '@/assets/sass/apps/invoice-list.scss';

import { useMeta } from '@/composables/use-meta';

useMeta({ title: 'Заказы на упаковку' });

const store = useStore();

const items = ref([]);
const columns = ref([
    // 'id',
    // 'fav',
    'number',
    // 'created_at',
    'deadline',
    'customer',
    'items',
    // 'items_assembled',
    'comment_for_picker',
    'manager',
    'assembler',
    'status',
    'actions',
]);
const headings = {
    // id: (h, row, index) => {
    //     return '';
    // },
    number: 'Номер',
    created_at: 'Создан',
    customer: 'Заказчик',
    deadline: 'Плановая дата',
    items: 'Изделий',
    items_assembled: 'Собрано',
    items_assembled_percent: '%',
    comment_for_picker: 'Комментарий',
    manager: 'Менеджер',
    assembler: 'Сборщик',
    status: 'Статус',
    fav: 'Мои',
    actions: '',
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
        'number',
        'created_at',
        'customer',
        'deadline',
        'items',
        'items_assembled',
        'items_assembled_percent',
        'comment_for_assembler',
        'assembler',
        'status',
        'fav',
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
const selected_rows = ref([]);
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
const assembler_filter = 'status__in=assembled&ordering=-due_date'
const bind_data = () => {
    store.dispatch('orders/fetchFilter', assembler_filter)
};

const delete_row = (item) => {
    if (confirm('Are you sure want to delete selected row ?')) {
        if (item) {
            items.value = items.value.filter((d) => d.id != item.id);
        } else {
            items.value = items.value.filter((d) => !selected_rows.value.includes(d.id));
        }
    }
};

const mark_as_sended = (item) => {
    store.dispatch('orders/update_picker', {
        "id": item.id,
        "picker": store.state.auth.user.id,
        "shipped_at": new Date(),
        "status": "shipped",
    })
        .then(() => store.dispatch('orders/fetchFilter', assembler_filter))
};

//checkbox selection
const selcted_row = (val) => {
    selected_rows.value.push(val);
    return;
};
</script>

<template>
    <div class="layout-px-spacing apps-invoice-list">
        <teleport to="#breadcrumb">
            <ul class="navbar-nav flex-row">
                <li>
                    <div class="page-header">
                        <nav class="breadcrumb-one" aria-label="breadcrumb">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="javascript:;">Заказы на упаковку</a></li>
                                <li class="breadcrumb-item active" aria-current="page"><span>Список</span></li>
                            </ol>
                        </nav>
                    </div>
                </li>
            </ul>
        </teleport>

        <div class="row layout-top-spacing">
            <div class="col-xl-12 col-lg-12 col-sm-12 layout-spacing">
                <div class="panel br-6">
                    <div class="custom-table">
                        <v-client-table :data="store.state.orders.orders" :columns="columns" :options="table_option">
                            <template #fav="props">
                                <div class="text-center">
                                    <div v-if="props.row.assembler == store.state.auth.user.id">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                            viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-star text-warning" data-v-02c2cbc4="">
                                            <polygon
                                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                                            </polygon>
                                        </svg>
                                    </div>
                                </div>
                            </template>
                            <template #number="props">
                                <router-link :to="{ path: '/picker/order', query: { id: props.row.id } }">
                                    <span class="inv-number">{{ props.row.number }}</span>
                                </router-link>
                            </template>
                            <template #created_at="props">
                                <div :data_sort="props.row.created_at">
                                    {{ props.row.created_at.toLocaleDateString('ru') }}
                                </div>
                            </template>
                            <template #assembler="props">
                                <div>{{ props.row.assembler_user ? props.row.assembler_user.full_name : '' }}</div>
                            </template>
                            <template #manager="props">
                                <div>{{ props.row.manager_user ? props.row.manager_user.full_name : '' }}</div>
                            </template>
                            <template #customer="props">
                                <div>{{ props.row.customer.name || '' }}</div>
                            </template>
                            <template #deadline="props">
                                <div :data_sort="props.row.deadline">{{ props.row.due_date.toLocaleDateString('ru') }}
                                </div>
                            </template>
                            <template #status="props">
                                <span class="badge inv-status" :class="statuses[props.row.status]">
                                    {{ props.row.status }}
                                </span>
                            </template>
                            <template #items="props">
                                <div :data_sort="props.row.deadline">{{ props.row.items.length }}</div>
                            </template>
                            <template #items_assembled="props">
                                <div :data_sort="props.row.due_date">{{ props.row.items.filter(x => x.status_name ==
                                    "Собран").length }}</div>
                            </template>
                            <template #actions="props">
                                <div class="mb-4 me-2 custom-dropdown dropdown btn-group">
                                    <a class="btn dropdown-toggle btn-icon-only" href="#" role="button" id="pendingTask"
                                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px"
                                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-more-horizontal">
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="19" cy="12" r="1"></circle>
                                            <circle cx="5" cy="12" r="1"></circle>
                                        </svg>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="pendingTask">
                                        <li>
                                            <a href="javascript:void(0);" @click="mark_as_sended(props.row)"
                                                class="dropdown-item action-send">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                    class="feather feather-send" data-v-5522efca="">
                                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                                </svg>
                                                Отправлен
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </template>
                        </v-client-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
