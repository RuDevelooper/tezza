<script setup>
import { useStore } from 'vuex';
import { onMounted, ref } from 'vue';
import '@/assets/sass/apps/invoice-list.scss';

import { useMeta } from '@/composables/use-meta';

useMeta({ title: 'Заказы' });

const store = useStore();

const columns = ref([
    'number',
    'created_at',
    'due_date',
    'customer',
    'items_assembled',
    'assembler',
    'status',
]);
const headings = {
    number: 'Номер',
    created_at: 'Создан',
    customer: 'Заказчик',
    due_date: 'Отгрузка',
    items: 'Изделий в заказе',
    items_assembled: 'Собрано',
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
        'due_date',
        'items_assembled_percent',
        'number',
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
const statuses = ref({
    'Новый': 'badge-info',
    'Ожидает оплаты': 'badge-info',
    'Оплачен': 'badge-primary',
    'Сборка': 'badge-warning',
    'Собран': 'badge-success',
    'Покраска': 'badge-success',
    'Упаковка': 'badge-secondary',
    'Отправлен': 'badge-secondary',
    'Завершен': 'badge-dark',
});

onMounted(() => {
    bind_data();
});
const assembler_filter = 'status__in=new,wait_payment,payed,assembly,assembled,coloring,packing,shipped&ordering=-due_date'

const bind_data = async () => {
    while (true) {
        store.dispatch('orders/fetchFilter', assembler_filter);
        break;
        await new Promise(r => setTimeout(r, 300.0 * 1000));
    }
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
                                <li class="breadcrumb-item"><a href="javascript:;">СДЭК</a></li>
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
                            </template>
                            <template #number="props">
                                <router-link target="_blank" rel="noopener noreferrer" :to="{ path: '/sender/order', query: { id: props.row.id } }">
                                    <span class="inv-number">{{ props.row.number }}</span>
                                </router-link>
                            </template>
                            <template #created_at="props">
                                <div :data_sort="props.row.created_at">{{ props.row.created_at.toLocaleDateString('ru')
                                    }}
                                </div>
                            </template>
                            <template #assembler="props">
                                <div>{{ props.row.assembler ? `${props.row.assembler.first_name}
                                    ${props.row.assembler.last_name}` : '' }}</div>
                            </template>
                            <template #customer="props">
                                <div>{{ props.row.customer.name || '' }}</div>
                            </template>
                            <template #due_date="props">
                                <div :data_sort="props.row.due_date">{{ props.row.due_date.toLocaleDateString('ru') }}
                                </div>
                            </template>
                            <template #status="props">
                                <span class="badge inv-status" :class="statuses[props.row.status]">
                                    {{ props.row.status }}
                                </span>
                            </template>
                            <template #items="props">
                                <div :data_sort="props.row.due_date">{{ props.row.items.length }}</div>
                            </template>
                            <template #items_assembled="props">
                                <div :data_sort="props.row.items.length">
                                    {{ props.row.items.filter(x => x.status_name == "Собран").length }}
                                    из {{ props.row.items.length }}
                                </div>
                            </template>
                        </v-client-table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
