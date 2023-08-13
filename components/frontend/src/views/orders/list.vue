<script setup>
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import '@/assets/sass/apps/invoice-list.scss';

import { useMeta } from '@/composables/use-meta';

useMeta({ title: 'Заказы' });

const store = useStore();

const items = ref([]);
const columns = ref([
    'id',
    'number',
    'created_at',
    'due_date',
    'customer',
    'items',
    'items_assembled',
    'comments',
    'assembler',
    'status',
]);
const headings = {
    id: (h, row, index) => {
        return '';
    },
    number: 'Номер',
    created_at: 'Создан',
    customer: 'Заказчик',
    due_date: 'Отгрузка',
    items: 'Изделий в заказе',
    items_assembled: 'Собрано',
    items_assembled_percent: '%',
    comments: 'Комментарии',
    assembler: 'Сборщик',
    status: 'Статус',
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
        'invoice',
        'created_at',
        'customer',
        'deadline',
        'items',
        'items_assembled',
        'items_assembled_percent',
        'comments',
        'assembler',
        'status',
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
    'Новый': 'success',
    'Ожидает оплаты': 'success',
    'Оплачен': 'success',
    'Сборка': 'success',
    'Собран': 'success',
    'Покраска': 'success',
    'Упаковка': 'success',
    'Отправлен': 'success',
    'Завершен': 'success',
});

onMounted(() => {
    bind_data();
});

const bind_data = () => {
    store.dispatch('orders/fetchItems')
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
                                <li class="breadcrumb-item"><a href="javascript:;">Заказы</a></li>
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
                            <template #beforeFilter>
                                <router-link to="/orders/add" class="btn me-2 btn-primary"><svg
                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-plus">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    Новый
                                </router-link>

                                <button type="button" class="btn ml-2 btn-danger" @click="delete_row()">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="feather feather-trash-2">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path
                                            d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                        </path>
                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                    </svg>
                                    Удалить
                                </button>
                            </template>
                            <template #id="props">
                                <div class="checkbox-outline-primary custom-control custom-checkbox">
                                    <input variant="primary" type="checkbox" class="custom-control-input"
                                        :id="'chk' + props.row.id" @change="selcted_row(props.row.id)" />
                                    <label class="custom-control-label" :for="'chk' + props.row.id"></label>
                                </div>
                            </template>
                            <template #number="props">
                                <router-link to="/orders/preview">
                                    <span class="inv-number">{{ props.row.number }}</span>
                                </router-link>
                            </template>
                            <template #created_at="props">
                                <div :data_sort="props.row.created_at">{{ props.row.created_at.toLocaleDateString('ru') }}
                                </div>
                            </template>
                            <template #assembler="props">
                                <div>{{ props.row.assembler.full_name || '' }}</div>
                            </template>
                            <template #customer="props">
                                <div>{{ props.row.customer.name || '' }}</div>
                            </template>
                            <template #due_date="props">
                                <div :data_sort="props.row.due_date">{{ props.row.due_date.toLocaleDateString('ru') }}</div>
                            </template>
                            <template #status="props">
                                <span class="badge inv-status" :class="'badge-' + statuses[props.row.status]">
                                    {{ props.row.status }}
                                </span>
                            </template>
                            <template #items="props">
                                <div :data_sort="props.row.due_date">{{ props.row.items.length }}</div>
                            </template>
                            <template #comments="props">
                                <div :data_sort="props.row.due_date">{{ props.row.comments.length }}</div>
                            </template>
                            <template #items_assembled="props">
                                <div :data_sort="props.row.due_date">{{ props.row.items.filter(x => x.status == "Собран").length }}</div>
                            </template>
                            <template #actions="props">
                                <div class="mb-4 me-2 custom-dropdown dropdown btn-group">
                                    <a class="btn dropdown-toggle btn-icon-only" href="#" role="button" id="pendingTask"
                                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <svg xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px" width="24"
                                            height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="feather feather-more-horizontal">
                                            <circle cx="12" cy="12" r="1"></circle>
                                            <circle cx="19" cy="12" r="1"></circle>
                                            <circle cx="5" cy="12" r="1"></circle>
                                        </svg>
                                    </a>

                                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="pendingTask">
                                        <li>
                                            <router-link href="javascript:void(0);" to="/orders/edit"
                                                class="dropdown-item action-edit"><svg xmlns="http://www.w3.org/2000/svg"
                                                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round" class="feather feather-edit-3">
                                                    <path d="M12 20h9"></path>
                                                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z">
                                                    </path>
                                                </svg>
                                                Edit
                                            </router-link>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);" @click="delete_row(props.row)"
                                                class="dropdown-item action-delete"><svg xmlns="http://www.w3.org/2000/svg"
                                                    width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round" class="feather feather-trash">
                                                    <polyline points="3 6 5 6 21 6"></polyline>
                                                    <path
                                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                                    </path>
                                                </svg>
                                                Delete
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

